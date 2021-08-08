import {Injectable, Logger} from "@nestjs/common";
import * as Server from "http-proxy";
import {environment} from "../../environments/environment";
import {HttpAdapterHost} from "@nestjs/core";

@Injectable()
export class ProxyS1Service {

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    const proxy = Server.createProxyServer()
    const logger = new Logger(ProxyS1Service.name);

    const expressInstance = this.httpAdapterHost.httpAdapter.getInstance()

    expressInstance.all("/api/proxy-s1/*", function (req, res) {

      const rewriteUrl = req.originalUrl.replace(/\/api\/proxy-s\d?/g, '/api')

      logger.debug(`[proxy s1 rewrite url] from '${req.originalUrl}' to ${rewriteUrl}`);

      req.url = rewriteUrl;

      const serverNum = req.originalUrl.replace(/^\/api\/proxy-s(\d+).+?$/g, '$1')

      proxy.web(req, res, {
        changeOrigin: true,
        target: environment[`server_s${serverNum}`]
      })
    })
  }
}
