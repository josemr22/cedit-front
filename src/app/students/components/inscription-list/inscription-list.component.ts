import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { Student } from '../../interfaces/student.interface';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-inscription-list',
  templateUrl: './inscription-list.component.html',
  styles: [],
})
export class InscriptionListComponent implements OnInit {
  _students: Student[] = [];
  cols!: any[];
  exportColumns!: any[];

  constructor(private studentsService: StudentsService) {}

  ngOnInit(): void {
    this.studentsService.getStudents().subscribe((s) => (this._students = s));

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

  get students() {
    return this._students.map((s) => ({
      id: s.id,
      dni: s.dni,
      name: s.name,
      department: s.department.name,
      phone: `${s.phone ? s.phone + ' | ' : ''}${s.cellphone}`,
    }));
  }

  delete(id: number) {
    this.studentsService.deleteStudents(id).subscribe((_) => {
      const idx = this._students.findIndex((s) => s.id == id);
      this._students.splice(idx, 1);
      Swal.fire('Bien Hecho!', 'Eliminado Correctamente', 'success');
    });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.students);
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
