import { Router } from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createUserSchema } from '../validators/userValidators';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listUsers);
router.post('/', validate({ body: createUserSchema }), createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
