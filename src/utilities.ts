import { loggingTypes } from './types'

/**
 * Logs given string or errors to console.
 *
 * @param data String or Error to log
 * @param type Type of log
 */
const Logger = (data: string | Error, type = loggingTypes.info): void => {
  if (!process.env.LOGOFF) {
    if (typeof (data) === 'string') {
      if (type === loggingTypes.info) {
        console.info(new Date().toISOString() + ': (info) ' + data)
      } else if (type === loggingTypes.warning) {
        console.warn(new Date().toISOString() + ': (warning) ' + data)
      } else {
        console.error(new Date().toISOString() + ': (error) ' + data)
      }
    } else {
      const message: string = data.name + ', ' + data.message + ' ' + data.stack
      console.error(new Date().toISOString() + ': (error) ' + message)
    }
  }
}

export {
  Logger
}
