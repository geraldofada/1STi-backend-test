import { Request, Response } from 'express';

import redis from '../../clients/redis.client';

const login = (req: Request, res: Response) => {};
const signup = (req: Request, res: Response) => {};
const get = (req: Request, res: Response) => {};
const list = (req: Request, res: Response) => {};
const update = (req: Request, res: Response) => {};
const remove = (req: Request, res: Response) => {};

export { login, signup, get, list, update, remove };
