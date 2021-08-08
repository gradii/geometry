import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { HttpResponseException } from '@devops-tools/api-interfaces';


@Injectable()
export class RequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value === undefined || value === null || value === '') {
      throw HttpResponseException.createQueryFieldRequiredTemplate(`${metadata.data} is required`);
    }
    return value;
  }
}
