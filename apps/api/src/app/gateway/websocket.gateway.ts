import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Server } from 'ws';
import { nodePseudoTerminalFactory } from '../command-server/pseudo-terminal.factory';
import { Executable, ExecutableType, FileUtils } from '@devops-tools/command-server';
import { Inject } from '@nestjs/common';

// const commands = new Commands(5, 50);
// const fileUtils = new FileUtils();

@WebSocketGateway(3201, {
  path: '/ws/gateway'
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('commands')
    protected commands,
    @Inject('fileUtils')
    protected fileUtils: FileUtils) {
  }

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('chunks')
  onQueryCommandLog(@MessageBody() data: any): Observable<WsResponse<string>> {
    const command = nodePseudoTerminalFactory({
      name          : 'test',
      displayCommand: 'display command',
      program       : 'yarn',
      args          : ['install'],
      cwd           : 'tmp/projects/test-generate/98h7coa7lff',
      isWsl         : false,
      isDryRun      : false
    });

    return new Observable((subscriber) => {
      command.onDidWriteData((data) => {
        subscriber.next(data);
      });

      command.onError(() => {
        // subscriber.error(data);
      });

      command.onExit(() => {
        subscriber.complete();
      });
    }).pipe(
      map((chunk: string) => {
        return { event: 'chunk', data: chunk };
      })
    );
  }

  @SubscribeMessage('get-command-detail-log')
  onGetCommandDetailLog(@MessageBody() body: any): Observable<WsResponse> {
    const commandInformation = this.commands.findMatchingCommand(body.id, this.commands.history);
    return new Observable(subscriber => {
      // subscriber.next(body.id);

      if (commandInformation && commandInformation.commandRunning) {
        commandInformation.commandRunning.onDidWriteData((data: string) => {
          subscriber.next(data);
        });
        commandInformation.commandRunning.onExit(() => {
          subscriber.complete();
        });
        subscriber.next(commandInformation.outChunk);
      } else {
        subscriber.next('没有找到日志');
        subscriber.complete();
      }

    }).pipe(
      timeout(1.5 * 3600 * 1000),
      map((chunk: string) => {
        return { event: 'command-detail-output', data: chunk };
      })
    );
  }


  // @SubscribeMessage('')


  // @Saga()
  // onWsSagaEvent = (events$: Observable<any>): Observable<ICommand> => {
  //   return this._bindSaga(events$);
  // };
  //
  // @Saga()
  // onWsCommandLog = () => {
  //
  // };


}
