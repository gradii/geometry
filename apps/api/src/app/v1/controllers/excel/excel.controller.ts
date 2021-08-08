import { Controller, Get, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpResponseException } from '@devops-tools/api-interfaces';
import { UploadDao } from '@devops-tools/api/database/repository/upload.dao';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../../config/multer.config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { ExcelService } from '../../services/excel.service';
import { environment } from '../../../../environments/environment';
import { RbacGuard } from '@devops-tools/api/auth/guards/rbac.guard';
import { PermissionCode } from '@devops-tools/api/common';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@Controller('excel')
@ApiTags('excel')
export class ExcelController {

  constructor(
    private uploadService: UploadDao,
    private excelService: ExcelService
  ) {
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_V1_EXCEL,
    PermissionCode.API_V1_EXCEL_INFO
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  @ApiQuery({ name: 'fileHash', type: 'string', example: 'dc76fd85092ade11d14d64c80d4a51c64e81f2be' })
  @ApiOperation({ summary: 'get excel info from hash' })
  async getExcel(@Query('fileHash') fileHash: string) {
    if (!fileHash) {
      throw HttpResponseException.createQueryFieldRequiredTemplate('fileHash');
    }
    const info = await this.uploadService.findOneBy({ fileHash });

    return info;
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_V1_EXCEL,
    PermissionCode.API_V1_EXCEL_DOWNLOAD
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('download')
  @ApiQuery({ name: 'fileHash', type: 'string', example: 'dc76fd85092ade11d14d64c80d4a51c64e81f2be' })
  @ApiOperation({ summary: 'get excel file from hash' })
  // @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename=test.pdf')
  async downloadExcel(@Query('fileHash') fileHash: string, @Res() res: Response) {
    if (!fileHash) {
      throw HttpResponseException.createQueryFieldRequiredTemplate('fileHash');
    }
    const info = await this.uploadService.findOneBy({ fileHash });

    const fileStream = fs.createReadStream(info.filePath);

    res.attachment(info.originalName);

    return fileStream.pipe(res);
  }


  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_V1_EXCEL,
    PermissionCode.API_V1_EXCEL_CONTENT
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Get('content')
  @ApiQuery({ name: 'fileHash', type: 'string', example: 'dc76fd85092ade11d14d64c80d4a51c64e81f2be' })
  @ApiOperation({ summary: 'get excel content from hash' })
  async getExcelContent(@Query('fileHash') fileHash: string) {
    if (!fileHash) {
      throw HttpResponseException.createQueryFieldRequiredTemplate('fileHash');
    }
    const info = await this.uploadService.findOneBy({ fileHash });

    const content = fs.readFileSync(info.filePath);

    const data = this.excelService.parseExcel(content);
    // info;
    return data;
  }

  @UseGuards(new RbacGuard([
    PermissionCode.R_V1,
    PermissionCode.R_V1_EXCEL,
    PermissionCode.API_V1_EXCEL_UPLOAD
  ]))
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiOperation({ summary: 'upload excel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        excelFile: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('excelFile', multerOptions))
  async excel(@UploadedFile() excelFile) {
    /**
     * {
     *    "fieldname": "excelFile",
     *    "originalname": "dcs.xlsx",
     *    "encoding": "binary",
     *    "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     *    "destination": "storage/",
     *    "filename": "3393e29a-c6d6-466b-a3c8-9a5665bf0df0.xlsx",
     *    "path": "storage\\3393e29a-c6d6-466b-a3c8-9a5665bf0df0.xlsx",
     *    "size": 14183
     * }
     */

    if (!excelFile) {
      throw new HttpResponseException('文件上传失败');
    }


    const fileData = fs.readFileSync(excelFile.path);

    //if upload success
    const hash = crypto.createHash('sha1');
    hash.update(fileData);
    const fileHash = hash.digest('hex');

    const info = await this.uploadService.findOneBy({
      file_hash: fileHash
    });
    if (!info) {
      const parsedFileName = path.parse(excelFile.filename);

      const realPathDir = path.join(environment.multerConfig.dest, fileHash.slice(0, 4));
      const realFileName = `${fileHash}${parsedFileName.ext}`;
      if (!fs.existsSync(realPathDir)) {
        fs.mkdirSync(realPathDir);
      }

      const realPath = path.join(environment.multerConfig.dest, fileHash.slice(0, 4), realFileName);
      fs.renameSync(excelFile.path, realPath);

      await this.uploadService.saveFile({
        name: realFileName,
        originalName: excelFile.originalname,
        ext: parsedFileName.ext,
        mimetype: excelFile.mimetype,
        hash: fileHash,
        path: realPath,
        type: 'excel'
      });
    } else {
      fs.unlinkSync(excelFile.path);
    }

    const foundInfo = await this.uploadService.findOneBy({ fileHash: fileHash });

    if (info) {
      throw HttpResponseException.createBody('file have been uploaded', foundInfo);
    }
    return foundInfo;
  }

}
