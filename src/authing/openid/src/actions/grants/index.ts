/* eslint-disable camelcase */

import authorization_code from './authorization_code';

import client_credentials from './client_credentials';
import refresh_token from './refresh_token';
import device_code from './device_code';
import ciba from './ciba';

export default {
  authorization_code,
  client_credentials,
  refresh_token,
  'urn:ietf:params:oauth:grant-type:device_code': device_code,
  'urn:openid:params:grant-type:ciba': ciba,
};
