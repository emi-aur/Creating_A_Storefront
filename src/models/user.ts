

import Client from "../database"; 
import dotenv from 'dotenv';

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password_digest: string;
};

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export const index = async (): Promise<User[]> => {
  try {
    const conn = await Client.connect();
    const sql = 'SELECT id, firstname, lastname FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Fehler beim Laden: ${err}`);
  }
};

export const show = async (id: string): Promise<User> => {
  try {
    const conn = await Client.connect();
    const sql = 'SELECT id, firstname, lastname FROM users WHERE id=($1)';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Finden: ${err}`);
  }
};

export const create = async (u: User): Promise<User> => {
try {
    const conn = await Client.connect();
    const sql = 'INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING id, firstname, lastname';
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync(u.password_digest + pepper, parseInt(saltRounds));
    const result = await conn.query(sql, [u.firstname, u.lastname, hashedPassword]);
    const user = result.rows[0];
    conn.release();
    return user;
  } catch (err) {
    throw new Error(`Fehler beim Erstellen: ${err}`);
  }
}

