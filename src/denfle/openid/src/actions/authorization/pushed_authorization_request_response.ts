import {UnsecuredJWT} from 'jose';
import {PUSHED_REQUEST_URN} from '../../consts';
import epochTime from '../../helpers/epoch_time';
import JWT from '../../helpers/jwt';

const MAX_TTL = 60;

export default async function pushedAuthorizationRequestResponse(ctx, next) {
  let request;
  let ttl;
  if (ctx.oidc.body.request) {
    ({ request } = ctx.oidc.body);
    const now = epochTime();
    const { payload: { exp } } = JWT.decode(request);
    ttl = exp - now;

    if (!Number.isInteger(ttl) || ttl > MAX_TTL) {
      ttl = MAX_TTL;
    }
  } else {
    ttl = MAX_TTL;
    request = new UnsecuredJWT({ ...ctx.oidc.params })
      .setIssuedAt()
      .setIssuer(ctx.oidc.client.clientId)
      .setAudience(ctx.oidc.issuer)
      .setExpirationTime(`${MAX_TTL}s`)
      .encode();
  }

  const requestObject = new ctx.oidc.provider.PushedAuthorizationRequest({ request });

  const id = await requestObject.save(ttl);

  ctx.oidc.entity('PushedAuthorizationRequest', requestObject);

  ctx.status = 201;
  ctx.body = {
    expires_in: ttl,
    request_uri: `${PUSHED_REQUEST_URN}${id}`,
  };

  ctx.oidc.provider.emit('pushed_authorization_request.success', ctx, ctx.oidc.client);

  return next();
}
