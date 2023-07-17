import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const getKey = async (password: string) => (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

export const encrypt = async (password: string, data: string) => {
  const iv = randomBytes(20);
  const cipher = createCipheriv('aes-256-gcm', await getKey(password), iv);
  return Buffer.from(
    JSON.stringify({
      iv,
      encrypted: Buffer.concat([cipher.update(data), cipher.final()]),
    }),
  ).toString('base64');
};

export const decrypt = async (password: string, encrypted: string) => {
  const { iv, encrypted: data } = JSON.parse(Buffer.from(encrypted, 'base64').toString());
  const decipher = createCipheriv('aes-256-gcm', await getKey(password), Buffer.from(iv));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data)), decipher.final()]).toString());
};
