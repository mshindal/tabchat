import * as express from 'express';
import { Server } from 'http';

// Make sure `server` is defined at the start,
// since other modules will need it
const app = express();
export const server = new Server(app);

import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import comments from './comments';
import configuration from './configuration';

// In production, trust X-Forwarded-Proto, X-Forwarded-Host, and
// X-Forwarded-For headers, and redirect HTTP requests to HTTPS
if (configuration.isProduction) {
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(301, "https://" + req.headers.host + req.originalUrl);
    }
  });
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// routes
app.use('/', comments);

server.listen(configuration.port, () => console.log(`Tabchat server listening on port ${configuration.port}!`));
