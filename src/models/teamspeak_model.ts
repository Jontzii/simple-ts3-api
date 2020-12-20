import { ClientInfo, ChannelInfo } from 'ts3-nodejs-library/lib/types/ResponseTypes'

/**
 * Data to export
 */
interface TeamspeakData {
  createdAt: Date,
  channels: ChannelData[]
}

interface TeamspeakDataClean {
  createdAt: Date,

}

/**
 * ClientData format for database
 */
interface ChannelData {
  cid: string,
  channelInfo?: ChannelInfo,
  clients?: ClientData[]
}

/**
 * ClientData format
 */
interface ClientData {
  clid: string,
  clientInfo?: ClientInfo
}

export {
  TeamspeakDataClean,
  TeamspeakData,
  ChannelData,
  ClientData,
  ClientInfo
}
