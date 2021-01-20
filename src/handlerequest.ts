import * as express from 'express' 
import * as teamspeak from './ts_query'

/**
 * Send JSON with correct indentation.
 * 
 * @param req Express requests
 * @param res Express response
 * @param data Data to send back
 */
const SendJson = (req: express.Request, res: express.Response, data: any) => {
  // Set header
  res.header('Content-Type', 'application/json');

  // Send JSON
  if (typeof(req.query.indent) === "string" && req.query.indent.toLowerCase() === "true") {
    res.status(200).send(JSON.stringify(data, null, 2));
  }
  else {
    res.status(200).send(JSON.stringify(data));
  }
}

/**
 * Handles requests from express.
 * 
 * @param req Express requests
 * @param res Express response
 */
const GetAll = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406);

  teamspeak.GetLatestCleanTeamspeakData()
  .then(data => {
    if (data == null) res.sendStatus(500);
    else SendJson(req, res, data);
  })
}

/**
 * Get one channel.
 * 
 * @param req Express requests
 * @param res Express response
 */
const GetChannel = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406);

  if (req.params.id) {
    teamspeak.GetLatestCleanTeamspeakData()
    .then(data => {
      if (data == null) res.sendStatus(500);
      else {
        const found = data.channels.find(element => element.cid === req.params.channelId);
        
        if (found) {
          found.createdAt = data.createdAt;
          SendJson(req, res, found);
        }
        else res.sendStatus(404);
      }
    })
  }
  else {
    res.sendStatus(400);
  }
}

/**
 * Get one client.
 * 
 * @param req Express requests
 * @param res Express response
 */
const GetClient = (req: express.Request, res: express.Response) => {
  return res.sendStatus(501);
}

/**
 * Get all connected clients.
 * 
 * @param req Express requests
 * @param res Express response
 */
const GetClients = (req: express.Request, res: express.Response) => {
  return res.sendStatus(501);
}

export {
  GetAll,
  GetChannel,
  GetClient,
  GetClients
}
