import {InvalidRequest, UnsupportedResponseMode} from '../../helpers/errors';
import instance from '../../helpers/weak_cache';
import {isFrontChannel} from '../../helpers/resolve_response_mode';

/*
 * Resolves and assigns params.response_mode if it was not explicitly requested. Validates id_token
 * and token containing responses do not use response_mode query.
 *
 * @throws: invalid_request
 */
export default function checkResponseMode(ctx, next, forceCheck) {
  const { params, client } = ctx.oidc;

  const frontChannel = isFrontChannel(params.response_type);

  const mode = ctx.oidc.responseMode;

  if (
    mode !== undefined
    && !instance(ctx.oidc.provider).responseModes.has(mode)
  ) {
    params.response_mode = undefined;
    throw new UnsupportedResponseMode();
  }

  const JWT = /jwt/.test(mode);

  if (
    mode !== undefined && JWT
    && (
      /^HS/.test(client.authorizationSignedResponseAlg)
      || /^(A|P|dir$)/.test(client.authorizationEncryptedResponseAlg)
    )
  ) {
    try {
      client.checkClientSecretExpiration('client secret is expired, cannot issue a JWT Authorization response');
    } catch (err) {
      const [explicit] = mode === 'jwt' ? [undefined] : mode.split('.');
      params.response_mode = explicit || undefined;
      throw err;
    }
  }

  if (mode === 'query' && frontChannel) {
    throw new InvalidRequest('response_mode not allowed for this response_type');
  } else if (mode === 'query.jwt' && frontChannel && !client.authorizationEncryptedResponseAlg) {
    throw new InvalidRequest('response_mode not allowed for this response_type unless encrypted');
  }

  if (params.response_type && ctx.oidc.fapiProfile !== undefined) {
    if (((!params.request && !params.request_uri) || forceCheck) && !params.response_type.includes('id_token') && !JWT) {
      throw new InvalidRequest('response_mode not allowed for this response_type in FAPI mode');
    }
  }

  return next();
}
