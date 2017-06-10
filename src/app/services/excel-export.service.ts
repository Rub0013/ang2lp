import { Injectable } from '@angular/core';

declare const XLSX: any;

@Injectable()
export class ExcelExportService {

  url = '../test-template/test.xlxs';
  oReq = new XMLHttpRequest();



  constructor() {

  }

}
