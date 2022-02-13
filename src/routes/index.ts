import { Router } from 'express';

import user from './user.route';
import address from './address.route';

const routes = Router();

routes.use('/user', user);
routes.use('/address', address);

export default routes;
