import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { Spending } from '../../interfaces/spending.interface';
import { SpendingService } from '../../services/spending.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-spendings-list',
  templateUrl: './spendings-list.component.html',
  styles: [
  ]
})
export class SpendingsListComponent implements OnInit {

  _spendings: Spending[] = [];

  cols!: any[];
  exportColumns!: any[];

  filters: FormGroup = this.fb.group({
    from: [null, Validators.required],
    to: [null, Validators.required],
  });

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spendingService: SpendingService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'description', header: 'Descripción del gasto' },
      { field: 'amount', header: 'Monto' },
      { field: 'user', header: 'Usuario' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get spendings() {
    return this._spendings.map((s) => ({
      id: s.id,
      fecha: s.date,
      description: s.description,
      amount: s.amount,
      user: s.user.name,
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.spendingService
      .getSpendings(params)
      .subscribe((spendings) => {
        this.isLoading = false;
        this._spendings = spendings;
      });
  }

  delete(id: number) {
    this.spendingService.deleteSpending(id).subscribe({
      next: _ => {
        const idx = this._spendings.findIndex(s => s.id == id);
        this._spendings.splice(idx, 1);
        Swal.fire('Bien Hecho!', 'Eliminado Correctamente', 'success');
      }
    });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.spendings.map((u) => {
        const { id, ...rest } = u;
        return rest;
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
