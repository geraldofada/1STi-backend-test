import { Router } from 'express';

import authController from '../middlewares/auth.middleware';
import * as controller from '../controllers/user/user.controller';

import { userRepository } from '../controllers/user/user.repository';
import { authRepository } from '../controllers/auth/auth.repository';

const router = Router();

router.post('/signup', controller.signupController(userRepository));
router.post('/login', controller.loginController(authRepository));
router.post(
  '/',
  authController(['ADMIN'], authRepository),
  controller.createController(userRepository)
);

router.get(
  '/:id',
  authController(['ADMIN', 'USER'], authRepository),
  controller.getByIdController(userRepository)
);
router.get(
  '/cpf/:cpf',
  authController(['ADMIN'], authRepository),
  controller.getByCpfController(userRepository)
);
router.get(
  '/',
  authController(['ADMIN'], authRepository),
  controller.listController(userRepository)
);

router.put(
  '/:id',
  authController(['ADMIN'], authRepository),
  controller.updateController(userRepository)
);

router.delete(
  '/:id',
  authController(['ADMIN'], authRepository),
  controller.deleteController(userRepository)
);

export default router;
