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

describe('POST /api/auth/login', () => {
  it('returns a token and user for valid credentials', async () => {
    await createUser({ email: 'jane@example.com', password: 'Secret123', role: 'admin' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'Secret123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.user).toMatchObject({ email: 'jane@example.com', role: 'admin' });
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects an incorrect password with 401', async () => {
    await createUser({ email: 'jane@example.com', password: 'Secret123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a non-existent email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Secret123' });

    expect(res.status).toBe(401);
  });

  it('rejects a malformed request body with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects requests without a token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer garbage');
    expect(res.status).toBe(401);
  });

  it('returns the current user for a valid token', async () => {
    await createUser({ email: 'jane@example.com', password: 'Secret123', role: 'member' });
    const token = await loginAs('jane@example.com', 'Secret123');

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ email: 'jane@example.com', role: 'member' });
  });
});

describe('role-based access to /api/users', () => {
  it('blocks a member from listing users (403)', async () => {
    await createUser({ email: 'member@example.com', password: 'Secret123', role: 'member' });
    const token = await loginAs('member@example.com', 'Secret123');

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin to list users (200)', async () => {
    await createUser({ email: 'admin@example.com', password: 'Secret123', role: 'admin' });
    const token = await loginAs('admin@example.com', 'Secret123');

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('blocks a member from creating users (403)', async () => {
    await createUser({ email: 'member@example.com', password: 'Secret123', role: 'member' });
    const token = await loginAs('member@example.com', 'Secret123');

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New', email: 'new@example.com', password: 'Secret123', role: 'member' });

    expect(res.status).toBe(403);
  });

  it('lets an admin create a new user and rejects duplicate emails with 409', async () => {
    await createUser({ email: 'admin@example.com', password: 'Secret123', role: 'admin' });
    const token = await loginAs('admin@example.com', 'Secret123');

    const created = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Rep', email: 'rep@example.com', password: 'Secret123', role: 'member' });

    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({ email: 'rep@example.com', role: 'member' });

    const duplicate = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Rep', email: 'rep@example.com', password: 'Secret123', role: 'member' });

    expect(duplicate.status).toBe(409);
  });
});
