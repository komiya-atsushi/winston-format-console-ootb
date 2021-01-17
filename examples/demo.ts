import winston from 'winston';
import { prettyConsole } from '../dist';

const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.errors({ stack: true }),
  transports: [
    new winston.transports.Console({
      format: prettyConsole(winston.config.npm.levels, module),
    }),
  ],
});

logger.silly('Lorem ipsum dolor sit amet');
logger.debug('consectetur adipiscing elit');
logger.verbose('sed do eiusmod tempor incididunt');
logger.info('ut labore et %s', 'dolore magna aliqua'); // use splat
logger.warn('Ut enim ad minim veniam', { num: 112358, str: '' }); // pass meta
logger.error('quis nostrud exercitation', new Error('ullamco laboris nisi ut aliquip')); // pass Error object
