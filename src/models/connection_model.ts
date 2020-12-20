/**
 * TeamSpeak connection variables
 */
interface TSConnectionInfo {
  Hostname: string,
  Port: number,
  QueryPort: number,
  Username?: string | undefined,
  Password?: string | undefined
}

export {
  TSConnectionInfo
}