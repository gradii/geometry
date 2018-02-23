import { Logger, transports } from 'winston';

const env = process.env.NODE_ENV || 'development';

export const logger = new Logger({
  level     : 'info',
  transports: [
    new transports.Console({level: 'info'}),
    new transports.File({filename: 'combined.log', level: env === 'development' ? 'debug' : 'info'})
  ]
});

