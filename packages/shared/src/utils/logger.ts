import pino, { type Logger } from "pino"
import { env } from "./env"
import pretty from "pino-pretty"

let globalLoggerInstance: Logger

export class LoggerFactory {
  static getLogger(source: string): Logger {
    if (!globalLoggerInstance) {
      globalLoggerInstance = pino({ level: env.LOG_LEVEL, name: env.LOG_NAME }, pretty())
    }
    return globalLoggerInstance.child({ source })
  }
}
