import * as ts3 from 'ts3-nodejs-library';
import * as types from './types'
import { Logger } from './utilities'
import { TSInfo } from './env_utilities'
import { TeamspeakData, ChannelData, ClientData } from './models/teamspeak_model';

let teamspeakQuery: ts3.TeamSpeak | null;

/**
 * Closes connection to the Teamspeak server.
 */
const CloseTeamspeakConnection = async () => {
  Logger('Closing Teamspeak connection');
  if (teamspeakQuery) {
    await teamspeakQuery.quit();
    teamspeakQuery = null;
  }
}

/**
 * Connects to the TeamSpeak 3 server specified with environment variables.
 * 
 * @param TSInfo Connection information read from environment
 * @returns {Promise} Promise object containing the data
 */
const ConnectToTeamspeak = (TSInfo: types.TSConnectionInfo): Promise<ts3.TeamSpeak> => {
  return new Promise<ts3.TeamSpeak>(async (resolve, reject) => {
    if (teamspeakQuery) {
      Logger(`Connection to the Teamspeak server already active`)
      resolve(teamspeakQuery)
    }
    else {
      ts3.TeamSpeak.connect(await CreateConnectionParams(TSInfo))
      .then(ts => {
        Logger(`Successfully connected to the Teamspeak server`)
        teamspeakQuery = ts;
        resolve(ts);
      })
      .catch(err => {
        teamspeakQuery = null;
        reject(err);
      })
    }
  })
};

/**
 * Creates teamspeak data
 * 
 * @returns {Promise}
 */
const CreateTeamspeakData = (): Promise<types.TeamspeakData> => {
  return new Promise((resolve, reject) => {
    if (teamspeakQuery) Logger(`Updating TeamspeakData`);
    else Logger(`Creating TeamspeakData`);

    const TeamspeakData: TeamspeakData = {
      createdAt: new Date(),
      channels: []
    };

    ConnectToTeamspeak(TSInfo)
    .then((teamspeak) => { 
      AddChannelData(teamspeak)
      .then(channels => AddClientData(teamspeak, channels))
      .then(dataWithClients => { 
        TeamspeakData.channels = dataWithClients;
        resolve(TeamspeakData);
      })
    })
    .catch(err => reject(err))
  })
}

/**
 * Get channel data.
 * 
 * @param teamspeak Teamspeak object with connection
 * @returns {Promise}
 */
const AddChannelData = (teamspeak: ts3.TeamSpeak): Promise<ChannelData[]> => {
  return new Promise(async (resolve, reject) => {
    const promises: Promise<ChannelData>[] = []
    const channels = await teamspeak.channelList();

    channels.forEach(async channel => {
      promises.push(GetChannelInfo(teamspeak, channel.cid));
    })

    Promise.all(promises)
    .then(data => {
      Logger(`Found ${data.length} channel(s) on the server`);
      resolve(data)
    })
    .catch(err => reject(err));
  })
}

/**
 * Add client data to current channel data.
 * 
 * @param teamspeak Teamspeak object with connection
 * @param channel Channel data for single channel
 * @returns {Promise}
 */
const AddClientsToChannelData = (teamspeak: ts3.TeamSpeak, channel: ChannelData): Promise<ChannelData> => {
  return new Promise(async (resolve, reject) => {
    const promises: Promise<ClientData>[] = []
    const clients = await teamspeak.clientList({ cid: channel.cid, clientType: 0 });

    clients.forEach(client => {
      promises.push(GetClientInfo(teamspeak, client.clid))
    })

    Promise.all(promises)
    .then(clientData => {
      Logger(`Found ${clientData.length} client(s) on the channel with ID "${channel.cid}" and name "${channel.channelInfo?.channelName}"`);
      channel.clients = clientData;
      resolve(channel);
    })
  })
}

/**
 * Add client data to channels.
 * 
 * @param teamspeak Teamspeak object with connection
 * @param channels Current channel data from AddChannelData
 * @returns {Promise}
 */
const AddClientData = (teamspeak: ts3.TeamSpeak, channels: ChannelData[]): Promise<ChannelData[]> => {
  return new Promise((resolve, reject) => {
    const promises: Promise<ChannelData>[] = []

    channels.forEach(channel => {
      promises.push(AddClientsToChannelData(teamspeak, channel));
    })

    Promise.all(promises).then(channelData => resolve(channelData));
  })
}

/**
 * Creates ConnectionParams.
 * 
 * @param TSInfo Info for connection
 * @returns {Promise} Promise containing the params
 */
const CreateConnectionParams = (TSInfo: types.TSConnectionInfo): Promise<ts3.ConnectionParams> => {
  return new Promise((resolve) => {
    const params: ts3.ConnectionParams = {
      host: TSInfo.Hostname,
      protocol: ts3.QueryProtocol.RAW,
      queryport: TSInfo.QueryPort,
      serverport: TSInfo.Port,
      username: TSInfo.Username,
      password: TSInfo.Password,
      keepAlive: true,
      readyTimeout: 10000,
      keepAliveTimeout: 250,
      ignoreQueries: false
    };

    resolve(params);
  })
}

/**
 * Asynchronously fill channel data
 * 
 * @param ts Teamspeak object with connection
 * @param id Channel ID
 * @returns {Promise}
 */
const GetChannelInfo = async (ts: ts3.TeamSpeak, id: string): Promise<ChannelData> => {
  const info = await ts.channelInfo(id);
  const channelData: ChannelData = {
    cid: id,
    channelInfo: info,
    clients: []
  }

  return channelData;
}

/**
 * Asynchronously fill client data
 * 
 * @param ts Teamspeak object with connection
 * @param id Client ID
 * @returns {Promise}
 */
const GetClientInfo = async (ts: ts3.TeamSpeak, id: string): Promise<ClientData> => {
  const info = await ts.clientInfo(id);
  const clientData: ClientData = {
    clid: id,
    clientInfo: info[0]
  }
  
  return clientData;
}

export {
  CloseTeamspeakConnection,
  CreateTeamspeakData
}
