import { Injectable, Logger, LoggerService, Scope } from '@nestjs/common';

/**
 * try to use custom logger
 * @deprecated
 */
@Injectable({ scope: Scope.TRANSIENT })
export class CoreLogger extends Logger implements LoggerService {

  error(message: any, trace?: string, context?: string): any {
  }

  log(message: any, context?: string): any {
  }

  warn(message: any, context?: string): any {
  }

}
