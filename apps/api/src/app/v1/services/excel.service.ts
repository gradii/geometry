import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';


@Injectable()
export class ExcelService {


  parseExcel(content: Buffer) {
    const workbook = XLSX.read(content, { type: 'buffer' });
    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];
    const cols = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    return cols;
  }
}
