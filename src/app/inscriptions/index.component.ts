import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { PreStudent } from './interfaces/pre-student.interface';
import { InscriptionsService } from './services/inscriptions.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [],
})
export class IndexComponent implements OnInit {
  _preStudents: PreStudent[] = [];
  cols!: any[];
  exportColumns!: any[];

  constructor(private inscriptionsService: InscriptionsService) {}

  ngOnInit(): void {
    this.inscriptionsService
      .getPreStudents()
      .subscribe((s) => (this._preStudents = s));

    this.cols = [
      { field: 'dni', header: 'Identificación' },
      { field: 'name', header: 'Nombre' },
      { field: 'department', header: 'Departamento' },
      { field: 'phone', header: 'Teléfono' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get preStudents() {
    return this._preStudents.map((s) => ({
      id: s.id,
      dni: s.dni,
      name: s.name,
      department: s.department.name,
      phone: `${s.phone ? s.phone + ' | ' : ''}${s.cellphone}`,
    }));
  }

  delete(id: number) {
    this.inscriptionsService.deletePreStudent(id).subscribe((_) => {
      const idx = this._preStudents.findIndex((s) => s.id == id);
      this._preStudents.splice(idx, 1);
      Swal.fire('Bien Hecho!', 'Eliminado Correctamente', 'success');
    });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.preStudents);
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
