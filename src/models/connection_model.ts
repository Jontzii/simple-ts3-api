/**
 * TeamSpeak connection variables
 */
interface TSConnectionInfo {
  Hostname: string,
  Port: number,
  QueryPort: number,
  Username?: string,
  Password?: string
}

export {
  TSConnectionInfo
}
