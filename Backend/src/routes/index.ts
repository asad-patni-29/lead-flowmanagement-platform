import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import leadRoutes from './leadRoutes';
import publicRoutes from './publicRoutes';

const router = Router();

router.use('/', healthRoutes);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);
router.use('/public', publicRoutes);

export default router;
