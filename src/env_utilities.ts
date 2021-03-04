import { TSConnectionInfo } from './models/connection_model'
import dotenv from 'dotenv'
dotenv.config()

/**
 * TeamSpeak connection variables
 */
const TSInfo: TSConnectionInfo = {
  Hostname: process.env.TS_HOSTNAME || 'localhost',
  Port: parseInt(process.env.TS_PORT || ''),
  QueryPort: 10011,
  Username: process.env.TS_USERNAME,
  Password: process.env.TS_PASSWORD
}

/**
 * Query interval in seconds
 */
const INTERVAL: number = parseInt(process.env.QUERY_INTERVAL || '10')

/**
 * Port to use
 */
const PORT: number = parseInt(process.env.PORT || '80')

export {
  TSInfo,
  INTERVAL,
  PORT
}
