import pg from 'pg'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import addFakeData from './data.js';

const { Pool } = pg;

dotenv.config();

const pool = new Pool();

const query = await fs.readFile("./src/db/db.sql");
await pool.query(query.toString());

if (process.env.GENERATE_FAKE_DATA == "true") {
    console.log("Generating fake data...");
    await addFakeData(pool);
    console.log("Fake data generated");
}

export default pool;
