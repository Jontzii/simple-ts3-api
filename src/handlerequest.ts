import * as express from 'express' 
import * as teamspeak from './ts_query'

/**
 * Handles requests from express
 * 
 * @param req Express requests
 * @param res Express response
 */
const HandleGETAllRequest = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406);

  teamspeak.GetLatestTeamspeakData()
  .then(data => {
    if (data == null) res.sendStatus(500);

    // Set header
    res.header("Content-Type",'application/json');

    if (typeof(req.query.indent) === "string" && req.query.indent.toLowerCase() === "true") res.status(200).send(JSON.stringify(data, null, 2))
    else res.status(200).json(data).end();
  })
}

export {
  HandleGETAllRequest
}
