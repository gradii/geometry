import { Dialect } from 'sequelize';

import * as path from 'path';
import { getEnv, getEnvNum } from '@devops-tools/api/common';

export const environment = {
  production      : false,
  server_info     : {
    host   : '127.0.0.1',
    ws_port: '3201'
  },
  server_s1       : getEnv('SERVER_S1', 'http://localhost:3002'),
  server_s2       : getEnv('SERVER_S2', 'http://localhost:3002'),
  server_s3       : getEnv('SERVER_S3', 'http://localhost:3002'),
  server_s4       : getEnv('SERVER_S4', 'http://localhost:3002'),
  micro_service_s1: getEnv('MICRO_SERVICE_S1', 'http://localhost:3002'),
  micro_service_s2: getEnv('MICRO_SERVICE_S2', 'http://10.33.114.90:8085'),
  multerConfig    : {
    dest         : getEnv('UPLOAD_LOCATION', 'storage/files'),
    multerDest   : getEnv('UPLOAD_TEMP_LOCATION', path.join(getEnv('STORAGE_LOCATION', 'storage'), '_multer-dest')),
    findIdeasDest: getEnv('FIND_IDEAS_DEST', path.join(getEnv('STORAGE_LOCATION', 'storage'), '_find-ideas')),
    workbenchDest: getEnv('WORKBENCH_DEST', path.join(getEnv('STORAGE_LOCATION', 'storage'), '_workbench'))
  },
  database        : {
    dialect : 'mysql' as Dialect,
    host    : getEnv('DATABASE_HOST', '127.0.0.1'),
    port    : getEnvNum('DATABASE_PORT', 3306),
    username: getEnv('DATABASE_USER', 'root'),
    password: getEnv('DATABASE_PASSWORD', '123456'),
    database: getEnv('DATABASE_DATABASE', 'devops'),
    logging : true
  },
  mongodb_database: {
    host: getEnv('MONGODB_DATABASE_HOST', '127.0.0.1')
  },
  jwtSecret       : getEnv('JWT_SECRET', '51grh8d6p2'),
  swagger         : {
    user    : getEnv('SWAGGER_USER', 'dev'),
    password: getEnv('SWAGGER_PASSWORD', 'workbench#swagger')
  }
};

