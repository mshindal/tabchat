const knex = require('../out/database').knex;
const configuration = require('../out/configuration').default;

knex.migrate.latest().then(() => {
  // In production mode, just serve the compiled .js
  // that was created in the Dockerfile
  if (configuration.isProduction) {
    require('../out/app');
  // In dev mode, use nodemon to have live reloading,
  // and compile TypeScript on the fly
  } else {
    const nodemon = require('nodemon');
    nodemon({
      "ext": "ts",
      "exec": "ts-node src/app.ts",
      "ignore": "node_modules"
    });
  }
})
