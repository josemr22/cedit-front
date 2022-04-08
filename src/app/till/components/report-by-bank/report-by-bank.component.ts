import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { BankReport } from '../../interfaces/bank-report';
import { TillService } from '../../services/till.service';

@Component({
  selector: 'app-report-by-bank',
  templateUrl: './report-by-bank.component.html',
  styles: [
  ]
})
export class ReportByBankComponent implements OnInit {

  _report: BankReport[] = [];

  cols!: any[];
  exportColumns!: any[];

  filters: FormGroup = this.fb.group({
    from: [null, Validators.required],
    to: [null, Validators.required],
  });

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tillService: TillService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'bank', header: 'Banco' },
      { field: 'abbr', header: 'Abreviatura' },
      { field: 'total', header: 'Total Soles' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get report() {
    return this._report.map((up) => ({
      bank: up.bank.name,
      abbr: up.bank.abbreviation,
      total: up.amount.toFixed(2),
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.tillService
      .getBankReportList(params)
      .subscribe((br) => {
        this.isLoading = false;
        this._report = br;
      });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.report.map((u) => {
        return u;
      });
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'usuarios');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

}
