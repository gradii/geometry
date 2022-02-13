import presence from '../helpers/validate_presence';
import instance from '../helpers/weak_cache';
import {UnsupportedGrantType, UnauthorizedClient} from '../helpers/errors';
import noCache from '../shared/no_cache';
import getTokenAuth from '../shared/token_auth';
import {urlencoded as parseBody} from '../shared/selective_body';
import rejectDupes from '../shared/reject_dupes';
import paramsMiddleware from '../shared/assemble_params';

const grantTypeSet = new Set(['grant_type']);

export default function tokenAction(provider) {
  const { params: authParams, middleware: tokenAuth } = getTokenAuth(provider, 'token');
  const { grantTypeParams } = instance(provider);

  return [
    noCache,
    parseBody,
    paramsMiddleware.bind(undefined, grantTypeParams.get(undefined)),
    ...tokenAuth,

    rejectDupes.bind(undefined, { only: grantTypeSet }),

    async function stripGrantIrrelevantParams(ctx, next) {
      const grantParams = grantTypeParams.get(ctx.oidc.params.grant_type);
      if (grantParams) {
        Object.keys(ctx.oidc.params).forEach((key) => {
          if (!(authParams.has(key) || grantParams.has(key))) {
            delete ctx.oidc.params[key];
          }
        });
      }
      await next();
    },

    async function supportedGrantTypeCheck(ctx, next) {
      presence(ctx, 'grant_type');

      const supported = instance(provider).configuration('grantTypes');

      if (!supported.has(ctx.oidc.params.grant_type) || ctx.oidc.params.grant_type === 'implicit') {
        throw new UnsupportedGrantType();
      }

      await next();
    },

    async function allowedGrantTypeCheck(ctx, next) {
      if (!ctx.oidc.client.grantTypeAllowed(ctx.oidc.params.grant_type)) {
        throw new UnauthorizedClient('requested grant type is not allowed for this client');
      }

      await next();
    },

    async function rejectDupesOptionalExcept(ctx, next) {
      const { grantTypeDupes } = instance(provider);
      const grantType = ctx.oidc.params.grant_type;
      if (grantTypeDupes.has(grantType)) {
        return rejectDupes({ except: grantTypeDupes.get(grantType) }, ctx, next);
      }
      return rejectDupes({}, ctx, next);
    },

    async function callTokenHandler(ctx, next) {
      const grantType = ctx.oidc.params.grant_type;

      const { grantTypeHandlers } = instance(provider);

      await grantTypeHandlers.get(grantType)(ctx, next);
      provider.emit('grant.success', ctx);
    },
  ];
}
