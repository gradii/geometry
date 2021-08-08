import * as path from 'path';
import { getEnv, getEnvNum } from '@devops-tools/api/common';
import { Dialect } from 'sequelize';

export const environment = {
  production      : false,
  server_info     : {
    host   : '127.0.0.1',
    ws_port: '3201'
  },
  server_s1       : getEnv('SERVER_S1', 'http://10.31.24.225:3002'),
  server_s2       : getEnv('SERVER_S2', 'http://10.31.24.225:3002'),
  server_s3       : getEnv('SERVER_S3', 'http://10.31.24.225:3002'),
  server_s4       : getEnv('SERVER_S4', 'http://10.31.24.225:3002'),
  micro_service_s1: getEnv('MICRO_SERVICE_S1', 'http://10.81.6.5:10087'),
  micro_service_s2: getEnv('MICRO_SERVICE_S2', 'http://10.33.114.90:8085'),
  multerConfig    : {
    multerDest   : getEnv('UPLOAD_TEMP_LOCATION', path.join(getEnv('UPLOAD_LOCATION', 'storage'), '_multer-dest')),
    dest         : getEnv('UPLOAD_LOCATION', 'storage/files'),
    findIdeasDest: getEnv('FIND_IDEAS_DEST', path.join(getEnv('UPLOAD_LOCATION', 'storage'), '_find-ideas')),
    workbenchDest: getEnv('WORKBENCH_DEST', path.join(getEnv('STORAGE_LOCATION', 'storage'), '_workbench'))
  },
  database        : {
    dialect : 'mysql' as Dialect,
    host    : getEnv('DATABASE_HOST', '127.0.0.1'),
    port    : getEnvNum('DATABASE_PORT', 3306),
    username: getEnv('DATABASE_USER', 'aidevops'),
    password: getEnv('DATABASE_PASSWORD', 'og#devops@125'),
    database: getEnv('DATABASE_DATABASE', 'devops'),
    logging : true
  },
  jwtSecret       : getEnv('JWT_SECRET', 'e187b5fdd2ee645897e5e072a19be038'),
  swagger         : {
    user    : getEnv('SWAGGER_USER', 'dev'),
    password: getEnv('SWAGGER_PASSWORD', 'workbench#swagger')
  }
};
