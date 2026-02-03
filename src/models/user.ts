import bcrypt, { hash } from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

