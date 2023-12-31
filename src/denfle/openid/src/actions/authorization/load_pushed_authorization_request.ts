import {PUSHED_REQUEST_URN} from '../../consts';
import {InvalidRequestUri} from '../../helpers/errors';

export default async function loadPushedAuthorizationRequest(ctx) {
  const { params } = ctx.oidc;
  const [, id] = params.request_uri.split(PUSHED_REQUEST_URN);
  const requestObject = await ctx.oidc.provider.PushedAuthorizationRequest.find(id, {
    ignoreExpiration: true,
  });
  if (!requestObject || requestObject.isExpired) {
    throw new InvalidRequestUri('request_uri is invalid or expired');
  }
  ctx.oidc.entity('PushedAuthorizationRequest', requestObject);
  return requestObject;
}
