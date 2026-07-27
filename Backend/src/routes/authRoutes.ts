import { Router } from 'express';
import { login, me } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/authValidators';

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);
router.get('/me', authenticate, me);

export default router;
