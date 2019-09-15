import configuration from './src/configuration';

//@ts-ignore
module.exports = {
  client: 'pg',
  connection: configuration.databaseURL
};
