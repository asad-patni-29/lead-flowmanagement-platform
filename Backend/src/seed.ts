import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config/env';
import { User } from './models/User';
import { Lead } from './models/Lead';
import { LeadStatus, LeadSource } from './types';

const SALT_ROUNDS = 10;

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@leadflow.test';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

const upsertUser = async (
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'member'
) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name, email, passwordHash, role } },
    { upsert: true, returnDocument: 'after' }
  );
  return user;
};

const generateLead = (
  index: number,
  admin: any,
  members: any[],
  statuses: LeadStatus[],
  sources: LeadSource[]
) => {
  const firstNames = [
    'Priya', 'Daniel', 'Wei', 'Sofia', 'James', 'Emma', 'Rajesh', 'Olivia',
    'Mikhail', 'Amelia', 'Kenji', 'Isabella', 'Ahmed', 'Charlotte', 'Luis',
    'Sophie', 'Alex', 'Maria', 'David', 'Jessica'
  ];
  const lastNames = [
    'Sharma', 'Osei', 'Zhang', 'Moretti', 'Thompson', 'Wilson', 'Patel', 'Garcia',
    'Volkov', 'Martinez', 'Tanaka', 'Anderson', 'Hassan', 'Brown', 'Rodriguez',
    'Martin', 'Johnson', 'Lopez', 'Miller', 'Clark'
  ];
  const companies = [
    'Nimbus Retail', 'BrightWorks', 'Northfield Logistics', 'Verdant Foods',
    'TechVision Inc', 'CloudScale Solutions', 'DataFlow Systems', 'MetroTrade Ltd',
    'Nexus Innovations', 'Global Partners', 'Zenith Digital', 'Apex Consulting',
    'Innovate Co', 'Premier Industries', 'Elite Solutions', 'Strategic Ventures',
    'Tomorrow Tech', 'Advanced Systems', 'Future Dynamics', 'Quantum Group'
  ];
  const messages = [
    'Interested in the enterprise plan.',
    'Requested a demo of the analytics dashboard.',
    'Downloaded the pricing sheet from the site.',
    'Looking for integration with our existing system.',
    'Need scalable solution for our growing business.',
    'Interested in the free trial.',
    'Want to learn more about your features.',
    'Comparing with competitors.',
    'Urgent need for implementation.',
    'Budget available this quarter.',
  ];

  const randomMember = members[Math.floor(Math.random() * members.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  const firstName = firstNames[index];
  const lastName = lastNames[index];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phoneBase = 555 + Math.floor(index / 5);
  const phoneLast = 100 + (index % 100);
  const phone = `${phoneBase}-${phoneLast}`;

  const assignedTo = Math.random() > 0.3 ? randomMember._id : null;
  const createdBy = Math.random() > 0.2 ? admin._id : null;

  const activities: any[] = [];
  activities.push({
    type: 'created',
    message: createdBy ? `Lead created by ${admin.name}` : 'Lead submitted via public capture form',
    actor: createdBy || null,
  });

  if (assignedTo) {
    activities.push({
      type: 'assigned',
      message: `Assigned to ${randomMember.name}`,
      actor: admin._id,
    });
  }

  if (randomStatus !== 'new') {
    activities.push({
      type: 'status_changed',
      message: `Status changed to "${randomStatus}"`,
      actor: assignedTo ? randomMember._id : admin._id,
    });
  }

  const notes: any[] = [];
  if (['qualified', 'proposal', 'won', 'lost'].includes(randomStatus)) {
    notes.push({
      text: messages[Math.floor(Math.random() * messages.length)],
      author: assignedTo || admin._id,
    });
  }

  if (randomStatus === 'won') {
    notes.push({
      text: 'Contract signed and project initiated.',
      author: admin._id,
    });
  }

  return {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    company: companies[index],
    message: messages[Math.floor(Math.random() * messages.length)],
    source: randomSource,
    status: randomStatus,
    assignedTo,
    createdBy,
    activities,
    notes,
  };
};

const run = async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  // Create 1 admin and 9 members (10 users total)
  const admin = await upsertUser('Ava Admin', ADMIN_EMAIL, ADMIN_PASSWORD, 'admin');
  
  const memberUsers = [
    await upsertUser('Milo Member', 'milo@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Sarah Johnson', 'sarah@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Marcus Chen', 'marcus@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Elena Rodriguez', 'elena@leadflow.test', 'Member@123', 'member'),
    await upsertUser('James Wilson', 'james@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Priya Patel', 'priya@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Oliver Schmidt', 'oliver@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Amara Okafor', 'amara@leadflow.test', 'Member@123', 'member'),
    await upsertUser('Lucas Ferreira', 'lucas@leadflow.test', 'Member@123', 'member'),
  ];

  // Delete existing example leads
  await Lead.deleteMany({ email: { $regex: /@example\.com$/ } });

  // Generate 20 diverse leads
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
  const sources: LeadSource[] = ['website', 'referral', 'cold_call', 'event', 'other'];

  const sampleLeads = Array.from({ length: 20 }, (_, i) =>
    generateLead(i, admin, memberUsers, statuses, sources)
  );

  await Lead.insertMany(sampleLeads as unknown as Record<string, unknown>[]);

  console.log('\n✓ Seed complete!\n');
  console.log('=== 10 Users Created ===');
  console.log(`Admin:   ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  memberUsers.forEach((member, i) => {
    console.log(`Member ${i + 1}: ${member.email} / Member@123`);
  });
  console.log('\n=== 20 Sample Leads Created ===');
  console.log('Leads distributed across all statuses: new, contacted, qualified, proposal, won, lost');
  console.log('Sources: website, referral, cold_call, event, other');
  console.log('Most leads assigned to team members with activities and notes\n');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
