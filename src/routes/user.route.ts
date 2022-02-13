import { Router } from 'express';

// const { apiAuth, apiAuthAdmin } = require('../middleware/api_auth');
import * as controller from '../controllers/user/user.controller';

import { userRepository } from '../controllers/user/user.repository';
import { authRepository } from '../controllers/auth/auth.repository';

const router = Router();

router.post('/signup', controller.signupController(userRepository));
router.post('/login', controller.loginController(authRepository));
router.post('/', controller.createController(userRepository));

router.get('/:id', controller.getByIdController(userRepository));
router.get('/cpf/:cpf', controller.getByCpfController(userRepository));
router.get('/', controller.listController(userRepository));

router.put('/:id', controller.updateController(userRepository));

router.delete('/:id', controller.deleteController(userRepository));

export default router;
