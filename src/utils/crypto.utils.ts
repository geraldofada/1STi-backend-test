import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

const hashString = async (value: string) => {
  const salt = process.env.SALT_KEY!;
  const iterations = parseInt(process.env.ITERATIONS_PWD!, 10);

  const hashBuffer = await pbkdf2(value, salt, iterations, 128, 'sha512');

  return hashBuffer.toString('hex');
};

export default hashString;
