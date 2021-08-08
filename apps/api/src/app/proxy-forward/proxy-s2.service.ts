import { Injectable, Logger } from '@nestjs/common';
import * as Server from 'http-proxy';
import { environment } from '../../environments/environment';
import { HttpAdapterHost } from '@nestjs/core';
import * as passport from 'passport';

@Injectable()
export class ProxyS2Service {

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    const proxy = Server.createProxyServer();
    const logger = new Logger(ProxyS2Service.name);

    const expressInstance = this.httpAdapterHost.httpAdapter.getInstance();

    expressInstance.all('/api/proxy-s2/*',
      /*passport.authenticate('jwt', { session: false }),*/ function(req, res) {

        let rewriteUrl = '';

        const URL_MAP = [
          { source: /\/api\/proxy-s2\/(.+?)/g, mewUrl: '$1' }
        ];

        URL_MAP.forEach(it => {
          if (it.source.exec(req.originalUrl)) {
            rewriteUrl = req.originalUrl.replace(it.source, it.mewUrl);
          }
        });

        logger.debug(`[proxy s2 rewrite url] from '${req.originalUrl}' to ${rewriteUrl}`);

        req.url = rewriteUrl;

        proxy.web(req, res, {
          changeOrigin: true,
          target      : environment.server_s2
        });
      });
  }
}
