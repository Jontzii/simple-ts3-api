import express from 'express'
import * as teamspeak from './data'
import * as handler from './handlerequest'
import { INTERVAL, PORT } from './env_utilities'
import { Logger } from './utilities'

const app = express();
app.disable('x-powered-by');

/**
 * Routes
 */
app.get('*', (req, res, next) => {
  Logger(`Request: ${req.method}; Path: ${req.originalUrl}`)
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/teamspeak/v1/channels', (req, res) => handler.GetAll(req, res));
app.get('/teamspeak/v1/channels/:id', (req, res) => handler.GetChannel(req, res));
app.get('/teamspeak/v1/clients', (req, res) => handler.GetClients(req, res));
app.get('/teamspeak/v1/clients/:id', (req, res) => handler.GetClient(req, res));
app.get('/teamspeak', (req, res) => res.status(200).send('<p>TeamSpeak API can be found from <code>/teamspeak/v1/</code></p>'));
app.get('/teamspeak/v1', (req, res) => res.status(200).send('<p>Available routes:</p> <ul><li>/channels/:id</li><li>/clients/:id</li></ul>'));

// Catch everything else and send 404
app.get('*', (req, res) => res.sendStatus(404));

/**
 * Methods not allowed
 */
app.all('/teamspeak*', (req, res) => {
  if (req.method !== "GET") res.sendStatus(405);
})

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
