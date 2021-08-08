import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';


@Injectable()
export class ConfigService {
  getDatabaseConfig() {
    return environment.database;
  }

  getJwtConfig() {
    throw new Error('not implemented!');
  }
}
