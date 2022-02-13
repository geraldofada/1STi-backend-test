import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

const hashString = async (value: string): Promise<string> => {
  const salt = process.env.SALT_KEY!;
  const iterations = parseInt(process.env.ITERATIONS_PWD!, 10);

  const hashBuffer = await pbkdf2(value, salt, iterations, 128, 'sha512');

  return hashBuffer.toString('hex');
};

const isHashCorrect = async (
  rawValue: string,
  hashToCompare: string
): Promise<boolean> => {
  const hashedValue = await hashString(rawValue);

  return hashToCompare === hashedValue;
};

export { hashString, isHashCorrect };
