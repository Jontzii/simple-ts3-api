import { TeamspeakData, TeamspeakDataClean } from './models/teamspeak_model'
import { CreateTeamspeakData } from './ts_utilities'
import { Logger } from './utilities';

let LatestStatus: TeamspeakData | null = null;
let LatestClean: TeamspeakDataClean | null = null;

const GetLatestTeamspeakData = async () => { return LatestStatus }
const RefreshTeamspeakData = () => { 
  CreateTeamspeakData()
  .then(data => { LatestStatus = data })
  .catch(err => Logger(err)) }

export {
  GetLatestTeamspeakData,
  RefreshTeamspeakData
}
