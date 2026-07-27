import request from 'supertest';
import app from '../app';
import { connectTestDb, clearTestDb, closeTestDb } from './utils/db';
import { createUser, loginAs } from './utils/factories';

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

const setupUsers = async () => {
  await createUser({ email: 'admin@example.com', password: 'Secret123', role: 'admin' });
  await createUser({ email: 'member@example.com', password: 'Secret123', role: 'member' });
  const adminToken = await loginAs('admin@example.com', 'Secret123');
  const memberToken = await loginAs('member@example.com', 'Secret123');
  return { adminToken, memberToken };
};

describe('Lead lifecycle: capture -> assign -> status -> notes -> activity trail', () => {
  it('walks a lead through its full lifecycle with correct permission boundaries', async () => {
    const { adminToken, memberToken } = await setupUsers();

    // 1. Public, unauthenticated capture
    const captureRes = await request(app).post('/api/public/leads').send({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      company: 'Nimbus Retail',
      message: 'Interested in the enterprise plan',
    });
    expect(captureRes.status).toBe(201);
    const leadId = captureRes.body.data.id as string;

    // 2. Member cannot yet see the unassigned lead
    const memberListBefore = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(memberListBefore.status).toBe(200);
    expect(memberListBefore.body.data).toHaveLength(0);

    // A member is also forbidden from viewing it directly
    const memberGetBefore = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(memberGetBefore.status).toBe(403);

    // 3. Admin sees it and assigns it to the member
    const adminList = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminList.status).toBe(200);
    expect(adminList.body.data).toHaveLength(1);
    expect(adminList.body.meta).toMatchObject({ total: 1, page: 1 });

    const memberRecord = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    const memberUser = memberRecord.body.data.find((u: { email: string }) => u.email === 'member@example.com');

    const assignRes = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assignedTo: memberUser.id });

    expect(assignRes.status).toBe(200);
    expect(assignRes.body.data.assignedTo.id).toBe(memberUser.id);
    expect(
      assignRes.body.data.activities.some((a: { type: string }) => a.type === 'assigned')
    ).toBe(true);

    // 4. Member can now see and update the lead
    const memberGetAfter = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(memberGetAfter.status).toBe(200);

    const statusRes = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ status: 'contacted' });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.status).toBe('contacted');
    expect(
      statusRes.body.data.activities.some((a: { type: string }) => a.type === 'status_changed')
    ).toBe(true);

    // 5. Member can add a timestamped note
    const noteRes = await request(app)
      .post(`/api/leads/${leadId}/notes`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ text: 'Left a voicemail, will follow up tomorrow.' });
    expect(noteRes.status).toBe(201);
    expect(noteRes.body.data.notes).toHaveLength(1);
    expect(noteRes.body.data.notes[0]).toMatchObject({ text: 'Left a voicemail, will follow up tomorrow.' });
    expect(noteRes.body.data.notes[0].createdAt).toEqual(expect.any(String));
    expect(
      noteRes.body.data.activities.some((a: { type: string }) => a.type === 'note_added')
    ).toBe(true);

    // 6. A member cannot reassign a lead
    const reassignAttempt = await request(app)
      .patch(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ assignedTo: memberUser.id });
    expect(reassignAttempt.status).toBe(403);

    // 7. A member cannot delete a lead
    const deleteAttempt = await request(app)
      .delete(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(deleteAttempt.status).toBe(403);

    // 8. Admin can delete the lead
    const deleteRes = await request(app)
      .delete(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(204);

    const finalGet = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(finalGet.status).toBe(404);
  });
});

describe('Lead pagination, filtering, and status codes', () => {
  it('paginates and filters results, and returns proper status codes for bad input', async () => {
    const { adminToken } = await setupUsers();

    const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    for (let i = 0; i < 12; i += 1) {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Lead Number ${i}`,
          email: `lead${i}@example.com`,
          status: statuses[i % statuses.length],
        });
      expect(res.status).toBe(201);
    }

    const page1 = await request(app)
      .get('/api/leads?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(page1.status).toBe(200);
    expect(page1.body.data).toHaveLength(5);
    expect(page1.body.meta).toMatchObject({ page: 1, limit: 5, total: 12, totalPages: 3 });

    const page3 = await request(app)
      .get('/api/leads?page=3&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(page3.body.data).toHaveLength(2);

    const filtered = await request(app)
      .get('/api/leads?status=qualified')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(filtered.status).toBe(200);
    expect(
      filtered.body.data.every((lead: { status: string }) => lead.status === 'qualified')
    ).toBe(true);

    const searched = await request(app)
      .get('/api/leads')
      .query({ search: 'Lead Number 3' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(searched.status).toBe(200);
    expect(searched.body.data.length).toBeGreaterThanOrEqual(1);

    // Invalid id format -> 400
    const badId = await request(app)
      .get('/api/leads/not-a-valid-id')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(badId.status).toBe(400);

    // Well-formed but non-existent id -> 404
    const missing = await request(app)
      .get('/api/leads/64b1f0f0f0f0f0f0f0f0f0f0')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(missing.status).toBe(404);

    // No auth header -> 401
    const noAuth = await request(app).get('/api/leads');
    expect(noAuth.status).toBe(401);
  });

  it('sorts list results by the requested field and direction on the backend', async () => {
    const { adminToken } = await setupUsers();

    const names = ['Zulu Lead', 'Alpha Lead', 'Middle Lead'];
    for (const name of names) {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        });
      expect(res.status).toBe(201);
    }

    const sorted = await request(app)
      .get('/api/leads')
      .query({ sortBy: 'name', sortOrder: 'asc' })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(sorted.status).toBe(200);
    expect(sorted.body.data.map((lead: { name: string }) => lead.name)).toEqual([
      'Alpha Lead',
      'Middle Lead',
      'Zulu Lead',
    ]);
  });
});
