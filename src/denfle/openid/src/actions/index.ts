import getAuthorization from './authorization';
import userinfo from './userinfo';
import getToken from './token';
import jwks from './jwks';
import registration from './registration';
import getRevocation from './revocation';
import getIntrospection from './introspection';
import discovery from './discovery';
import endSession from './end_session';
import codeVerification from './code_verification';

export default {
  getAuthorization,
  userinfo,
  getToken,
  jwks,
  registration,
  getRevocation,
  getIntrospection,
  discovery,
  endSession,
  codeVerification,
};
