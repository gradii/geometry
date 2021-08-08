import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Optional } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import { multerOptions } from '../../../../config/multer.config';
import * as multer from 'multer';
import { extname } from 'path';
import { isFunction } from 'util';
import { UploadDao } from '../../../database';
import { HttpResponseErrorCode , HttpResponseException} from '@devops-tools/api-interfaces';

type MulterInstance = any;


/**
 * @deprecated
 */
@Injectable()
export class CheckExistFileInterceptor implements NestInterceptor {
  protected multer: MulterInstance;

  fieldName = 'excelFile';
  localOptions = multerOptions;

  constructor(
    @Optional()
    @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
    @Inject(UploadDao)
    private uploadDao: UploadDao
  ) {
    const combinedOptions = {
      ...options,
      ...this.localOptions
    };

    this.multer = (multer as any)(this.customMulterOptions(combinedOptions));
  }

  customMulterOptions(options) {
    return {
      ...options,
      fileFilter: (req: any, file: any, cb: any) => {
        this.uploadDao.findOneByName(file.name).then(info => {
          console.log(info);
          if (info) {
            cb(new HttpResponseException(
              `file hanve been upload [${file.mimetype}] ${extname(file.originalname)}`,
              HttpResponseErrorCode.FILE_EXIST), false);
          }

          if (isFunction(options.fileFilter)) {
            options.fileFilter(req, file, (err, data) => {
              cb(err, data);
            });
          }
        });
      }
    };
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();

    await new Promise((resolve, reject) =>
      this.multer.single(this.fieldName)(
        ctx.getRequest(),
        ctx.getResponse(),
        (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve(undefined);
        }
      )
    );
    return next.handle();
  }

}
