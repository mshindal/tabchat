import * as k from 'knex';
import configuration from './configuration';

console.log(`Initializing Knex`);

export const knex = k({
  client: 'pg',
  connection: configuration.databaseURL
});
