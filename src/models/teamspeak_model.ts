import { ClientInfo, ChannelInfo } from 'ts3-nodejs-library/lib/types/ResponseTypes'

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

interface ChannelDataClean {
  createdAt?: Date | undefined,
  cid: string,
  channelName: string | undefined,
  clients: ClientDataClean[]
}

interface ClientDataClean {
  clid: string,
  clientNickname: string | undefined,
  clientInputMuted: number | undefined,
  clientOutputMuted: number | undefined,
  clientInputHardware: number | undefined,
  clientOutputHardware: number | undefined,
  clientIsRecording: boolean | undefined,
  clientServergroups: string[] | undefined
}

/**
 * Data to export
 */
interface TeamspeakChannels {
  createdAt: Date,
  channels: ChannelData[]
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
  TeamspeakChannelsClean,
  TeamspeakChannels,
  TeamspeakClientsClean,
  ChannelData,
  ChannelDataClean,
  ClientData,
  ClientDataClean,
  ClientInfo
}
