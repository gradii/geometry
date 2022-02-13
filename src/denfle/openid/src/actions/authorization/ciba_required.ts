import presence from '../../helpers/validate_presence';

export default function oidcRequired(ctx, next) {
  const required = new Set(['scope']);

  if (ctx.oidc.client.backchannelTokenDeliveryMode !== 'poll') {
    required.add('client_notification_token');
  }

  presence(ctx, ...required);

  return next();
}
