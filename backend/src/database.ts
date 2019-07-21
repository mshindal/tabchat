import * as k from 'knex';

export const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error(`The environment variable DATABASE_URL is missing. It should be a connection string that points to a Postgres instance`)
}

console.log(`Initializing Knex`);

export const knex = k({
  client: 'pg',
  connection: connectionString
});
