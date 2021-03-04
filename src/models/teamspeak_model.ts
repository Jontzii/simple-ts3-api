import { ClientInfo, ChannelInfo } from 'ts3-nodejs-library/lib/types/ResponseTypes'

/**
 * ClientData format
 */
 interface ClientData {
  clid: string,
  clientInfo?: ClientInfo
}

interface ClientDataClean {
  createdAt?: Date,
  clid: string,
  clientNickname?: string,
  clientInputMuted?: number,
  clientOutputMuted?: number,
  clientInputHardware?: number,
  clientOutputHardware?: number,
  clientIsRecording?: boolean,
  clientServergroups?: string[]
}

interface ChannelDataClean {
  createdAt?: Date,
  cid: string,
  channelName?: string,
  clients: ClientDataClean[]
}

/**
 * Stripped version to send with API
 */
interface TeamspeakChannelsClean {
  createdAt: Date,
  channels: ChannelDataClean[]
}

interface TeamspeakClientsClean {
  createdAt: Date,
  clients: ClientDataClean[]
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
 * Data to export
 */
interface TeamspeakChannels {
  createdAt: Date,
  channels: ChannelData[]
}

export {
  TeamspeakChannelsClean,
  TeamspeakChannels,
  TeamspeakClientsClean,
  ChannelData,
  ChannelDataClean,
  ClientData,
  ClientDataClean,
  ClientInfo
}
