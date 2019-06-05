import * as express from 'express';
import { Server } from 'http';

// Make sure `server` is defined at the start,
// since other modules will need it
const app = express();
export const server = new Server(app);

import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import comments from './comments';

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// routes
app.use('/', comments);

const port = process.env['PORT'];

if (!port) {
	throw new Error('The environment variable PORT is missing or empty');
}

server.listen(port, () => console.log(`Tabchat server listening on port ${port}!`));
