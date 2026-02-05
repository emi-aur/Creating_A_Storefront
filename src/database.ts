import dotenv from "dotenv";
import { Pool } from "pg";

// Speichere ENV vor dotenv.config(), falls es bereits gesetzt ist
const currentEnv = process.env.ENV;

dotenv.config();

// Verwende gespeicherte ENV oder die aus .env
const ENV = currentEnv || process.env.ENV;

const { 
  POSTGRES_HOST, 
  POSTGRES_DB, 
  POSTGRES_USER, 
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB
} = process.env;

const dbName = ENV === "test" ? POSTGRES_TEST_DB : POSTGRES_DB;

const database = new Pool({
  host: POSTGRES_HOST,
  database: dbName,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

export default database;
