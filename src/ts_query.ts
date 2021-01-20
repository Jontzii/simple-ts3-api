import { TeamspeakChannels, TeamspeakChannelsClean, ChannelDataClean } from './models/teamspeak_model'
import { CreateTeamspeakData } from './ts_utilities'
import { Logger } from './utilities';

// Main data
let LatestStatus: TeamspeakChannels | null = null;
let LatestClean: TeamspeakChannelsClean | null = null;

const GetLatestTeamspeakData = async () => { return LatestStatus }
const GetLatestCleanTeamspeakData = async () => { return LatestClean }

/**
 * Gets latest data from ts server.
 */
const RefreshTeamspeakData = () => { 
  CreateTeamspeakData()
  .then(data => { 
    LatestStatus = data;
    MakeCleanVersion();
  })
  .catch(err => Logger(err)) 
}

/**
 * Cleans ts data to be suitable for public API.
 */
const MakeCleanVersion = () => {
  const clean: TeamspeakChannelsClean = {
    createdAt: new Date(),
    channels: []
  }

  LatestStatus?.channels.forEach(channel => {
    const channelClean: ChannelDataClean = {
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

  LatestClean = clean;
}

export {
  GetLatestTeamspeakData,
  GetLatestCleanTeamspeakData,
  RefreshTeamspeakData
}
