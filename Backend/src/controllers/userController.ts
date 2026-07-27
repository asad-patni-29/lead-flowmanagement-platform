import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { CreateUserInput } from '../validators/userValidators';
import { paginate } from '../utils/pagination';

const SALT_ROUNDS = 10;

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const sortBy = (req.query.sortBy as string) || 'name';
  const sortOrder = (req.query.sortOrder as string) || 'asc';

  // Build query
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort
  const sort: any = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const result = await paginate(User, query, {
    page,
    limit,
    sort,
  });

  const response: ApiResponse = {
    success: true,
    data: result.data,
    meta: result.meta,
  };
  res.status(200).json(response);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as CreateUserInput;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('A user with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
  });

  const response: ApiResponse = {
    success: true,
    message: 'User created',
    data: user,
  };
  res.status(201).json(response);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if email is being changed and if it already exists
  if (email && email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError('A user with this email already exists', 409);
    }
    user.email = email.toLowerCase();
  }

  // Update fields
  if (name) user.name = name;
  if (role) user.role = role;
  if (password) {
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'User updated',
    data: user,
  };
  res.status(200).json(response);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'User deleted',
  };
  res.status(200).json(response);
};
