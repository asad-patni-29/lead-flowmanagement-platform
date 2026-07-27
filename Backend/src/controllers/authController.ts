import { Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import { LoginInput } from '../validators/authValidators';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ sub: user._id.toString(), role: user.role });

  const response: ApiResponse = {
    success: true,
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };

  res.status(200).json(response);
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  const response: ApiResponse = {
    success: true,
    data: req.user,
  };
  res.status(200).json(response);
};
