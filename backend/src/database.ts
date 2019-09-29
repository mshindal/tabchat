import * as k from 'knex';
import configuration from './configuration';

export const knex = k({
  client: 'pg',
  connection: configuration.databaseURL
});
