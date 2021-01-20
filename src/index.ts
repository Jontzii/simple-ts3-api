import express from 'express'
import * as teamspeak from './ts_query'
import * as handler from './handlerequest'
import { INTERVAL, PORT } from './env_utilities'
import { Logger } from './utilities'

const app = express();

/**
 * Methods not allowed
 */
app.post('/api/*', (req, res) => res.sendStatus(405));
app.put('/api/*', (req, res) => res.sendStatus(405));
app.delete('/api/*', (req, res) => res.sendStatus(405));

/**
 * Routes
 */
app.get('/api', (req, res) => res.redirect('/api/channels', 301));
app.get('/api/all', (req, res) => res.redirect('/api/channels', 301));
app.get('/api/channels', (req, res) => handler.GetAll(req, res));
app.get('/api/channels/:id', (req, res) => handler.GetChannel(req, res));
app.get('/api/clients', (req, res) => handler.GetClients(req, res));
app.get('/api/clients/:id', (req, res) => handler.GetClient(req, res));

app.listen(PORT, () => {
  Logger(`⚡️ Server is running at https://localhost:${PORT}`);
});

/**
 * Refresh once
 */
teamspeak.RefreshTeamspeakData();

/**
 * Interval for query
 */
const intervalObj = setInterval(() => { 
  teamspeak.RefreshTeamspeakData();
}, INTERVAL * 1000);

/**
 * Graceful exit
 */
process.on('SIGTERM', () => {
  Logger('Exiting...');
  clearInterval(intervalObj);
  Logger('Ready to exit');
});
