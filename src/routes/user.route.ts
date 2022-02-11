import { Router } from 'express';

// const { apiAuth, apiAuthAdmin } = require('../middleware/api_auth');
import * as controller from '../controllers/user/user.controller';

const router = Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/', controller.create);

router.get('/:id', controller.getById);
router.get('/cpf/:cpf', controller.getByCpf);
router.get('/', controller.list);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);

export default router;
