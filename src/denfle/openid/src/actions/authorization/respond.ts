import instance from '../../helpers/weak_cache';

/*
 * Based on the authorization request response mode either redirects with parameters in query or
 * fragment or renders auto-submitting form with the response members as hidden fields.
 *
 * If session management is supported stores User-Agent readable cookie with the session stated
 * used by the OP iframe to detect session state changes.
 *
 * @emits: authorization.success
 */
export default async function respond(ctx, next) {
  const out = await next();

  const { oidc: { params } } = ctx;

  if (params.state !== undefined) {
    out.state = params.state;
  }

  if (!out.id_token && instance(ctx.oidc.provider).configuration('features.issAuthResp.enabled')) {
    out.iss = ctx.oidc.provider.issuer;
  }

  ctx.oidc.provider.emit('authorization.success', ctx, out);

  const handler = instance(ctx.oidc.provider).responseModes.get(ctx.oidc.responseMode);
  await handler(ctx, params.redirect_uri, out);
}
