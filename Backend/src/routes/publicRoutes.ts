import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createPublicLead } from '../controllers/publicController';
import { validate } from '../middleware/validate';
import { publicCreateLeadSchema } from '../validators/leadValidators';

const router = Router();

const publicLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions, please try again later.' },
});

router.post(
  '/leads',
  publicLeadLimiter,
  validate({ body: publicCreateLeadSchema }),
  createPublicLead
);

export default router;
