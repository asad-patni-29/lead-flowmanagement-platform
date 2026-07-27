import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../../app';
import { User, IUser } from '../../models/User';
import { Role } from '../../types';

let counter = 0;

interface CreateUserOptions {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export const createUser = async (
  options: CreateUserOptions = {}
): Promise<{ user: IUser; password: string }> => {
  counter += 1;
  const password = options.password ?? 'Password123';
  const passwordHash = await bcrypt.hash(password, 4);

  const user = await User.create({
    name: options.name ?? `Test User ${counter}`,
    email: options.email ?? `user${counter}@example.com`,
    passwordHash,
    role: options.role ?? 'member',
  });

  return { user, password };
};

export const loginAs = async (email: string, password: string): Promise<string> => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.data.token as string;
};
