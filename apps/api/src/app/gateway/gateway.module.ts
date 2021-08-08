import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { CommandServerModule } from '../command-server/command-server.module';

@Module({
  imports: [CommandServerModule],
  providers: [WebsocketGateway]
})
export class GatewayModule {

}
