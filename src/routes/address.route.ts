import { Router } from 'express';

// const { apiAuth, apiAuthAdmin } = require('../middleware/api_auth');
import controller from '../controllers/address/address.controller';

import { addressRepository } from '../controllers/address/address.repository';
import { viacepService } from '../services/viacep/viacep.service';

const router = Router();

router.get('/cep/:cep', controller(addressRepository, viacepService));

export default router;
