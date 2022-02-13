import noCache from '../../shared/no_cache';
import bodyParser from '../../shared/conditional_body';
import rejectDupes from '../../shared/reject_dupes';
import paramsMiddleware from '../../shared/assemble_params';
import sessionMiddleware from '../../shared/session';
import instance from '../../helpers/weak_cache';
import {PARAM_LIST} from '../../consts';
import checkResource from '../../shared/check_resource';
import getTokenAuth from '../../shared/token_auth';
import checkClient from './check_client';
import checkResponseMode from './check_response_mode';
import rejectUnsupported from './reject_unsupported';
import rejectRegistration from './reject_registration';
import oauthRequired from './oauth_required';
import oneRedirectUriClients from './one_redirect_uri_clients';
import fetchRequestUri from './fetch_request_uri';
import processRequestObject from './process_request_object';
import oidcRequired from './oidc_required';
import cibaRequired from './ciba_required';
import checkPrompt from './check_prompt';
import checkMaxAge from './check_max_age';
import checkIdTokenHint from './check_id_token_hint';
import checkScope from './check_scope';
import checkResponseType from './check_response_type';
import checkRedirectUri from './check_redirect_uri';
import checkWebMessageUri from './check_web_message_uri';
import assignDefaults from './assign_defaults';
import checkClaims from './check_claims';
import assignClaims from './assign_claims';
import loadAccount from './load_account';
import loadGrant from './load_grant';
import interactions from './interactions';
import respond from './respond';
import checkPKCE from './check_pkce';
import processResponseTypes from './process_response_types';
import interactionEmit from './interaction_emit';
import getResume from './resume';
import checkClientGrantType from './check_client_grant_type';
import checkOpenidScope from './check_openid_scope';
import deviceAuthorizationResponse from './device_authorization_response';
import authenticatedClientId from './authenticated_client_id';
import deviceUserFlow from './device_user_flow';
import deviceUserFlowErrors from './device_user_flow_errors';
import deviceUserFlowResponse from './device_user_flow_response';
import pushedAuthorizationRequestRemapErrors from './pushed_authorization_request_remap_errors';
import backchannelRequestRemapErrors from './backchannel_request_remap_errors';
import stripOutsideJarParams from './strip_outside_jar_params';
import pushedAuthorizationRequestResponse from './pushed_authorization_request_response';
import cibaLoadAccount from './ciba_load_account';
import checkRequestedExpiry from './check_requested_expiry';
import backchannelRequestResponse from './backchannel_request_response';
import checkCibaContext from './check_ciba_context';

const A = 'authorization';
const R = 'resume';
const DA = 'device_authorization';
const CV = 'code_verification';
const DR = 'device_resume';
const PAR = 'pushed_authorization_request';
const BA = 'backchannel_authentication';

const authRequired = new Set([DA, PAR, BA]);

const parseBody = bodyParser.bind(undefined, 'application/x-www-form-urlencoded');

export default function authorizationAction(provider, endpoint) {
  const {
    features: {
      claimsParameter,
      resourceIndicators,
      webMessageResponseMode,
    },
    extraParams,
  } = instance(provider).configuration();

  const allowList = new Set(PARAM_LIST);

  if (webMessageResponseMode.enabled) {
    allowList.add('web_message_uri');
    allowList.add('web_message_target');
  }

  if (claimsParameter.enabled) {
    allowList.add('claims');
  }

  let rejectDupesMiddleware = rejectDupes.bind(undefined, {});
  if (resourceIndicators.enabled) {
    allowList.add('resource');
    rejectDupesMiddleware = rejectDupes.bind(undefined, { except: new Set(['resource']) });
  }

  extraParams.forEach(Set.prototype.add.bind(allowList));
  if ([DA, CV, DR, BA].includes(endpoint)) {
    allowList.delete('web_message_uri');
    allowList.delete('web_message_target');
    allowList.delete('response_type');
    allowList.delete('response_mode');
    allowList.delete('code_challenge_method');
    allowList.delete('code_challenge');
    allowList.delete('state');
    allowList.delete('redirect_uri');
    allowList.delete('prompt');
  }

  if (endpoint === BA) {
    allowList.add('client_notification_token');
    allowList.add('login_hint_token');
    allowList.add('binding_message');
    allowList.add('user_code');
    allowList.add('request_context');
    allowList.add('requested_expiry');
  }

  const stack = [];

  const use = (middleware, ...only) => {
    if (only.includes(endpoint)) {
      stack.push(middleware());
    }
  };
  const returnTo = /^(code|device)_/.test(endpoint) ? 'device_resume' : 'resume';

  /* eslint-disable no-multi-spaces, space-in-parens */
  use(() => noCache,                                        A, DA, R, CV, DR, PAR, BA);
  use(() => sessionMiddleware,                              A,     R,     DR         );
  use(() => deviceUserFlowErrors,                                     CV, DR         );
  use(() => getResume.bind(undefined, allowList, returnTo),        R,     DR         );
  use(() => deviceUserFlow.bind(undefined, allowList),                CV, DR         );
  use(() => parseBody,                                      A, DA,            PAR, BA);
  if (authRequired.has(endpoint)) {
    const { params: authParams, middleware: tokenAuth } = getTokenAuth(provider, 'token');
    use(() => paramsMiddleware.bind(undefined, authParams),    DA,            PAR, BA);
    tokenAuth.forEach((tokenAuthMiddleware) => {
      use(() => tokenAuthMiddleware,                           DA,            PAR, BA);
    });
  }
  use(() => authenticatedClientId,                             DA,                 BA);
  use(() => paramsMiddleware.bind(undefined, allowList),    A, DA,            PAR, BA);
  use(() => stripOutsideJarParams,                                            PAR, BA);
  use(() => rejectDupesMiddleware,                          A, DA,            PAR, BA);
  use(() => rejectUnsupported,                              A, DA,            PAR, BA);
  use(() => checkClient,                                    A, DA, R, CV, DR         );
  use(() => checkClientGrantType,                              DA,                 BA);
  use(() => checkResponseMode,                              A,                PAR    );
  use(() => pushedAuthorizationRequestRemapErrors,                            PAR    );
  use(() => backchannelRequestRemapErrors,                                         BA);
  use(() => fetchRequestUri,                                A, DA                    );
  use(() => processRequestObject.bind(
    undefined, allowList, rejectDupesMiddleware,
  ),                                                        A, DA,            PAR, BA);
  use(() => oneRedirectUriClients,                          A,                PAR    );
  use(() => oauthRequired,                                  A,                PAR    );
  use(() => rejectRegistration,                             A, DA,            PAR, BA);
  use(() => checkResponseType,                              A,                PAR    );
  use(() => oidcRequired,                                   A,                PAR    );
  use(() => cibaRequired,                                                          BA);
  use(() => assignDefaults,                                 A, DA,                 BA);
  use(() => checkPrompt,                                    A,                PAR    );
  use(() => checkResource,                                  A, DA, R, CV, DR, PAR, BA);
  use(() => checkScope.bind(undefined, allowList),          A, DA,            PAR, BA);
  use(() => checkOpenidScope.bind(undefined, allowList),    A, DA,            PAR, BA);
  use(() => checkRedirectUri,                               A,                PAR    );
  use(() => checkWebMessageUri,                             A,                PAR    );
  use(() => checkPKCE,                                      A, DA,            PAR    );
  use(() => checkClaims,                                    A, DA,            PAR, BA);
  use(() => checkMaxAge,                                    A, DA,            PAR, BA);
  use(() => checkRequestedExpiry,                                                  BA);
  use(() => checkCibaContext,                                                      BA);
  use(() => checkIdTokenHint,                               A, DA,            PAR    );
  use(() => interactionEmit,                                     A,     R, CV, DR    );
  use(() => assignClaims,                                   A,     R, CV, DR,      BA);
  use(() => cibaLoadAccount,                                                       BA);
  use(() => loadAccount,                                    A,     R, CV, DR         );
  use(() => loadGrant,                                      A,     R, CV, DR         );
  use(() => interactions.bind(undefined, returnTo),         A,     R, CV, DR         );
  use(() => respond,                                        A,     R                 );
  use(() => processResponseTypes,                           A,     R                 );
  use(() => deviceAuthorizationResponse,                       DA                    );
  use(() => deviceUserFlowResponse,                                   CV, DR         );
  use(() => pushedAuthorizationRequestResponse,                               PAR    );
  use(() => backchannelRequestResponse,                                            BA);
  /* eslint-enable no-multi-spaces, space-in-parens */

  return stack;
}
