import * as models from './models/teamspeak_model'
import { CreateTeamspeakData } from './ts_utilities'
import { Logger } from './utilities';

// Main data
let LatestChannels: models.TeamspeakChannels | null = null;
let LatestChannelsClean: models.TeamspeakChannelsClean | null = null;
let LatestClientsClean: models.TeamspeakClientsClean | null = null;

const GetLatestChannels = async () => { return LatestChannels }
const GetLatestCleanChannels = async () => { return LatestChannelsClean }
const GetLatestCleanClients = async () => { return LatestClientsClean }

/**
 * Gets latest data from ts server.
 */
const RefreshTeamspeakData = () => { 
  CreateTeamspeakData()
  .then(data => { 
    LatestChannels = data;
    MakeCleanVersion();
    ExtractClientsFromData();
  })
  .catch(err => Logger(err)) 
}

/**
 * Cleans ts data to be suitable for public API.
 */
const MakeCleanVersion = () => {
  const clean: models.TeamspeakChannelsClean = {
    createdAt: new Date(),
    channels: []
  }

  LatestChannels?.channels.forEach(channel => {
    const channelClean: models.ChannelDataClean = {
      cid: channel.cid,
      channelName: channel.channelInfo?.channelName,
      clients: []
    }

    channel.clients?.forEach(client => {
      const clientClean = {
        clid: client.clid,
        clientNickname: client.clientInfo?.clientNickname,
        clientInputMuted: client.clientInfo?.clientInputMuted,
        clientOutputMuted: client.clientInfo?.clientOutputMuted,
        clientInputHardware: client.clientInfo?.clientInputHardware,
        clientOutputHardware: client.clientInfo?.clientOutputHardware,
        clientIsRecording: client.clientInfo?.clientIsRecording,
        clientServergroups: client.clientInfo?.clientServergroups
      }
      channelClean.clients.push(clientClean);
    })
    clean.channels.push(channelClean);
  })

  LatestChannelsClean = clean;
}

/**
 * Creates LatestClientsClean from LatestChannelsClean.
 */
const ExtractClientsFromData = () => {
  if (LatestChannelsClean != null) {
    LatestClientsClean = {
      createdAt: LatestChannelsClean.createdAt,
      clients: []
    }
    
    LatestChannelsClean?.channels.forEach(channel => {
      channel.clients.forEach(client => {
        LatestClientsClean?.clients.push(client);
      })
    })
  }
}

export {
  GetLatestChannels,
  GetLatestCleanChannels,
  GetLatestCleanClients,
  RefreshTeamspeakData
}
