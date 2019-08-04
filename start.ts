const child_process = require('child_process');
const concurrently = require('concurrently');

child_process.exec('yarn run knex migrate:latest --knexfile ./backend/knexfile.ts');

if (process.env.NODE_ENV === 'development') {
  concurrently(['yarn run webpack --watch --development'], ['yarn run nodemon ./backend/out/main.js'])
} else {
  throw new Error('todo');
}
