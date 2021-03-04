import * as express from 'express'
import * as teamspeak from './data'

/**
 * Send JSON with correct indentation.
 *
 * @param req Express requests
 * @param res Express response
 * @param data Data to send back
 */
const SendJson = (req: express.Request, res: express.Response, data: any) => {
  // Set header
  res.header('Content-Type', 'application/json')

  // Send JSON
  if (typeof (req.query.indent) === 'string' && req.query.indent.toLowerCase() === 'true') {
    res.status(200).send(JSON.stringify(data, null, 2))
  } else {
    res.status(200).send(JSON.stringify(data))
  }
}

/**
 * Handles requests from express.
 *
 * @param req Express requests
 * @param res Express response
 */
const GetAll = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406)

  teamspeak.GetLatestCleanChannels()
    .then(data => {
      if (data == null) res.sendStatus(500)
      else SendJson(req, res, data)
    })
}

/**
 * Get one channel.
 *
 * @param req Express requests
 * @param res Express response
 */
const GetChannel = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406)

  if (req.params.id) {
    teamspeak.GetLatestCleanChannels()
      .then(data => {
        if (data == null) res.sendStatus(500)
        else {
          const found = data.channels.find(channel => channel.cid === req.params.id)

          if (found) {
            found.createdAt = data.createdAt
            SendJson(req, res, found)
          } else res.sendStatus(404)
        }
      })
  } else {
    res.sendStatus(400)
  }
}

/**
 * Get one client.
 *
 * @param req Express requests
 * @param res Express response
 */
const GetClient = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406)

  if (req.params.id) {
    teamspeak.GetLatestCleanClients()
      .then(data => {
        if (data == null) res.sendStatus(500)
        else {
          const found = data.clients.find(client => client.clid === req.params.id)

          if (found) {
            found.createdAt = data.createdAt
            SendJson(req, res, found)
          } else res.sendStatus(404)
        }
      })
  } else {
    res.sendStatus(400)
  }
}

/**
 * Get all connected clients.
 *
 * @param req Express requests
 * @param res Express response
 */
const GetClients = (req: express.Request, res: express.Response) => {
  if (!req.accepts('application/json')) res.sendStatus(406)

  teamspeak.GetLatestCleanClients()
    .then(data => {
      if (data == null) res.sendStatus(500)
      else SendJson(req, res, data)
    })
}

export {
  GetAll,
  GetChannel,
  GetClient,
  GetClients
}
