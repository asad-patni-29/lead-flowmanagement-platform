import { Router } from 'express';
import {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  addNote,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  addNoteSchema,
  listLeadsQuerySchema,
  idParamSchema,
} from '../validators/leadValidators';

const router = Router();

router.use(authenticate);

router.get('/', validate({ query: listLeadsQuerySchema }), listLeads);
router.post('/', validate({ body: createLeadSchema }), createLead);
router.get('/:id', validate({ params: idParamSchema }), getLead);
router.patch('/:id', validate({ params: idParamSchema, body: updateLeadSchema }), updateLead);
router.delete('/:id', validate({ params: idParamSchema }), authorize('admin'), deleteLead);
router.post(
  '/:id/notes',
  validate({ params: idParamSchema, body: addNoteSchema }),
  addNote
);

export default router;
