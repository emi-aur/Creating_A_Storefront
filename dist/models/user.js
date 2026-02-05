"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.create = exports.show = exports.index = void 0;
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
const index = async () => {
  try {
    const conn = await database_1.default.connect();
    const sql = "SELECT id, firstname, lastname FROM users";
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Fehler beim Laden: ${err}`);
  }
};
exports.index = index;
const show = async (id) => {
  try {
    const conn = await database_1.default.connect();
    const sql = "SELECT id, firstname, lastname FROM users WHERE id=($1)";
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Fehler beim Finden: ${err}`);
  }
};
exports.show = show;
const create = async (u) => {
  try {
    const conn = await database_1.default.connect();
    const sql =
      "INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING id, firstname, lastname";
    const bcrypt = require("bcrypt");
    const hashedPassword = bcrypt.hashSync(
      u.password_digest + pepper,
      parseInt(saltRounds)
    );
    const result = await conn.query(sql, [
      u.firstname,
      u.lastname,
      hashedPassword,
    ]);
    const user = result.rows[0];
    conn.release();
    return user;
  } catch (err) {
    throw new Error(`Fehler beim Erstellen: ${err}`);
  }
};
exports.create = create;
const authenticate = async (firstname, lastname, password) => {
  try {
    const conn = await database_1.default.connect();
    const sql = "SELECT * FROM users WHERE firstname=($1) AND lastname=($2)";
    const result = await conn.query(sql, [firstname, lastname]);
    if (result.rows.length) {
      const user = result.rows[0];
      const bcrypt = require("bcrypt");
      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        conn.release();
        return user;
      }
    }
    conn.release();
    return null;
  } catch (err) {
    throw new Error(`Fehler bei der Authentifizierung: ${err}`);
  }
};
exports.authenticate = authenticate;
