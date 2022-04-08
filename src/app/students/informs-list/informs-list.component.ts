import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Student } from '../interfaces/student.interface';
import { StudentsService } from '../services/students.service';
import { HttpParams } from '@angular/common/http';
import { exportExcel, exportPdf } from "../../helpers/exports";

@Component({
  selector: 'app-informs-list',
  templateUrl: './informs-list.component.html',
  styles: [],
})
export class InformsListComponent implements OnInit {
  _students: Student[] = [];
  cols!: any[];
  exportColumns!: any[];

  isLoading: boolean = true;

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
    const params = new HttpParams().set('onlyNotEnrolled', true);
    this.studentsService.getStudents(params).subscribe((s) => {
      this._students = s;
      this.isLoading = false;
    });

    this.cols = [
      { field: 'dni', header: 'Identificación' },
      { field: 'name', header: 'Nombre' },
      { field: 'department', header: 'Departamento' },
      { field: 'phone', header: 'Teléfono' },
      { field: 'email', header: 'Email' },
      { field: 'course', header: 'Curso' },
      { field: 'registered_at', header: 'Fecha de Registro' },
      { field: 'registered_by', header: 'Registrado por' },
    ];

    // this.exportColumns = this.cols.map((col) => ({
    //   title: col.header,
    //   dataKey: col.field,
    // }));
  }

  get students() {
    return this._students.map((s) => ({
      id: s.id,
      dni: s.dni,
      name: s.name,
      department: s.department.name,
      phone: `${s.phone ? s.phone + ' | ' : ''}${s.cellphone}`,
      email: s.email,
      course: s.course.name,
      registered_at: s.created_at,
      registered_by: s.registered_by.name
    }));
  }

  delete(id: number) {
    this.studentsService.deleteStudents(id).subscribe((_) => {
      const idx = this._students.findIndex((s) => s.id == id);
      this._students.splice(idx, 1);
      Swal.fire('Bien Hecho!', 'Eliminado Correctamente', 'success');
    });
  }

  exportExcel() {
    exportExcel([...this.students], [...this.cols], 'informes');
  }

  exportPdf() {
    exportPdf();
  }

}
