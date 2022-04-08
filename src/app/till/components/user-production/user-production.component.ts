import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { UserProduction } from '../../interfaces/user-production.interface';
import { TillService } from '../../services/till.service';

@Component({
  selector: 'app-user-production',
  templateUrl: './user-production.component.html',
  styles: [
  ]
})
export class UserProductionComponent implements OnInit {
  _userProductionList: UserProduction[] = [];

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
      { field: 'user', header: 'Usuario' },
      { field: 'name', header: 'Nombre' },
      { field: 'amount', header: 'Monto Total Generado' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get userProductionList() {
    return this._userProductionList.map((up) => ({
      user: up.user.email,
      name: up.user.name,
      amount: up.amount.toFixed(2),
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.tillService
      .getUserProductionList(params)
      .subscribe((up) => {
        this.isLoading = false;
        this._userProductionList = up;
      });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.userProductionList.map((u) => {
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
