import * as ts3 from 'ts3-nodejs-library'
import * as types from './types'
import { Logger } from './utilities'
import { TSInfo } from './env_utilities'
import { TeamspeakChannels, ChannelData, ClientData } from './models/teamspeak_model'

let teamspeakQuery: ts3.TeamSpeak | null

/**
 * Closes connection to the Teamspeak server.
 */
const CloseTeamspeakConnection = async () => {
  Logger('Closing Teamspeak connection')
  if (teamspeakQuery) {
    await teamspeakQuery.quit()
    teamspeakQuery = null
  }
}

/**
 * Connects to the TeamSpeak 3 server specified with environment variables.
 *
 * @param ConnectionInfo Connection information read from environment
 * @returns {Promise} Promise object containing the data
 */
const ConnectToTeamspeak = (ConnectionInfo: types.TSConnectionInfo): Promise<ts3.TeamSpeak> => {
  return new Promise<ts3.TeamSpeak>((resolve, reject) => {
    if (teamspeakQuery) {
      Logger('Connection to the Teamspeak server already active')
      resolve(teamspeakQuery)
    } else {
      CreateConnectionParams(ConnectionInfo)
        .then((params) => ts3.TeamSpeak.connect(params))
        .then(ts => {
          Logger('Successfully connected to the Teamspeak server')
          teamspeakQuery = ts
          resolve(ts)
        })
        .catch(err => {
          teamspeakQuery = null
          reject(err)
        })
    }
  })
}

/**
 * Creates teamspeak data
 *
 * @returns {Promise}
 */
const CreateTeamspeakData = (): Promise<types.TeamspeakChannels> => {
  return new Promise((resolve, reject) => {
    if (teamspeakQuery) Logger('Updating TeamspeakData')
    else Logger('Creating TeamspeakData')

    const TeamspeakData: TeamspeakChannels = {
      createdAt: new Date(),
      channels: []
    }

    ConnectToTeamspeak(TSInfo)
      .then((teamspeak) => {
        AddChannelData(teamspeak)
          .then(channels => AddClientData(teamspeak, channels))
          .then(async dataWithClients => {
            TeamspeakData.channels = dataWithClients

            await CloseTeamspeakConnection()
            resolve(TeamspeakData)
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
  return new Promise((resolve, reject) => {
    const promises: Promise<ChannelData>[] = []

    teamspeak.channelList()
      .then((channels) => {
        channels.forEach(async channel => {
          promises.push(GetChannelInfo(teamspeak, channel.cid))
        })

        Promise.all(promises)
          .then(data => {
            Logger(`Found ${data.length} channel(s) on the server`)
            resolve(data)
          })
          .catch(err => reject(err))
      })
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
  return new Promise((resolve) => {
    const promises: Promise<ClientData>[] = []

    teamspeak.clientList({ cid: channel.cid, clientType: 0 })
      .then((clients) => {
        clients.forEach(client => {
          promises.push(GetClientInfo(teamspeak, client.clid))
        })

        Promise.all(promises)
          .then(clientData => {
            Logger(`Found ${clientData.length} client(s) on the channel with ID "${channel.cid}" and name "${channel.channelInfo?.channelName}"`)
            channel.clients = clientData
            resolve(channel)
          })
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
  return new Promise((resolve) => {
    const promises: Promise<ChannelData>[] = []

    channels.forEach(channel => {
      promises.push(AddClientsToChannelData(teamspeak, channel))
    })

    Promise.all(promises).then(channelData => resolve(channelData))
  })
}

/**
 * Creates ConnectionParams.
 *
 * @param ConnectionInfo Info for connection
 * @returns {Promise} Promise containing the params
 */
const CreateConnectionParams = (ConnectionInfo: types.TSConnectionInfo): Promise<ts3.ConnectionParams> => {
  return new Promise((resolve) => {
    const params: ts3.ConnectionParams = {
      host: ConnectionInfo.Hostname,
      protocol: ts3.QueryProtocol.RAW,
      queryport: ConnectionInfo.QueryPort,
      serverport: ConnectionInfo.Port,
      username: ConnectionInfo.Username,
      password: ConnectionInfo.Password,
      keepAlive: true,
      readyTimeout: 10000,
      keepAliveTimeout: 250,
      ignoreQueries: false
    }

    resolve(params)
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
  const info = await ts.channelInfo(id)
  const channelData: ChannelData = {
    cid: id,
    channelInfo: info,
    clients: []
  }

  return channelData
}

/**
 * Asynchronously fill client data
 *
 * @param ts Teamspeak object with connection
 * @param id Client ID
 * @returns {Promise}
 */
const GetClientInfo = async (ts: ts3.TeamSpeak, id: string): Promise<ClientData> => {
  const info = await ts.clientInfo(id)
  const clientData: ClientData = {
    clid: id,
    clientInfo: info[0]
  }

  return clientData
}

export {
  CloseTeamspeakConnection,
  CreateTeamspeakData
}
