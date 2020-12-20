import express from 'express'
import * as teamspeak from './ts_query'
import { HandleGETAllRequest } from './handlerequest'
import { INTERVAL, PORT } from './env_utilities'
import { Logger } from './utilities'

const app = express();

app.get('/', (req, res) => res.status(200).send("API can be found from path /all"));
app.get('/all', (req, res) => HandleGETAllRequest(req, res));

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
