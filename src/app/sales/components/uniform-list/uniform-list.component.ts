import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { switchMap } from 'rxjs/operators';
import { Course } from 'src/app/courses/interfaces/course.interface';
import { CoursesService } from 'src/app/courses/services/courses.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Sale } from '../../interfaces/sale.interface';
import { SaleService } from '../../services/sale.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saleTypes as st, saleTypes } from '../../../helpers/sale-types';

@Component({
  selector: 'app-uniform-list',
  templateUrl: './uniform-list.component.html',
  styles: [
  ]
})
export class UniformListComponent implements OnInit {

  courses: Course[] = [];
  _sales: Sale[] = [];
  saleYears: number[] = [];

  saleType: string = '';

  exportColumns!: any[];

  filters: FormGroup = this.fb.group({
    saleYear: [null],
    saleType: [null],
    courseId: [null],
  });

  isLoading: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private saleService: SaleService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ type }) => {
      this.saleType = type;
      const saleTypeObj = st.find(st => st.label == type);
      if (!saleTypeObj) {
        this.router.navigateByUrl('/ventas/uniformes');
        return;
      }
      this.filters.get('saleType')!.setValue(saleTypeObj!.code);
    });

    this.coursesService
      .getCourses()
      .pipe(
        switchMap((c) => {
          this.courses = c;
          this.filters.get('courseId')?.setValue(this.courses[0].id);
          return this.saleService.getSaleYears();
        })
      )
      .subscribe((y) => {
        for (let i = y.min_year; i <= y.max_year; i++) {
          this.saleYears.push(i);
        }
        this.filters.get('saleYear')?.setValue(this.saleYears[0]);
      });

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get cols(){
    const c = [
      { field: 'dni', header: 'DNI' },
      { field: 'name', header: 'Nombre' },
      { field: 'phone', header: 'Teléfono' },
      { field: 'email', header: 'Correo' },
      { field: 'amount', header: 'Monto' },
      { field: 'balance', header: 'Saldo' },
      { field: 'deuda', header: 'Estado' },
      { field: 'state', header: 'Entrega' },
      { field: 'created_at', header: 'Fecha de Registro' },
      { field: 'extra', header: `${this.saleType == 'servicios' ? 'Descripción' : 'Fecha de culminación'}` },
      { field: 'course', header: 'Course' },
    ];

    if(this.saleType == 'uniformes'){
      const idx = c.findIndex(e => e.field == 'extra');
      c.splice(idx,1);
    }
    if(this.saleType == 'servicios'){
      const idx = c.findIndex(e => e.field == 'course');
      c.splice(idx,1);
      const idx2 = c.findIndex(e => e.field == 'state');
      c.splice(idx2,1);
    }

    return c;
  }

  get sales() {
    return this._sales.map((s) => ({
      paymentId: s.id,
      dni: s.course_turn_student.student.dni,
      name: s.course_turn_student.student.name,
      phone: `${s.course_turn_student.student.cellphone} ${s.course_turn_student.student.phone ? ('| ' + s.course_turn_student.student.phone) : ''}`,
      email: s.course_turn_student.student.email,
      amount: s.payment.amount.toFixed(2),
      balance: s.payment.installments[0].balance.toFixed(2),
      deuda: s.payment.installments[0].balance === 0 ? 'Cancelado' : 'Deuda',
      state: s.state ? 'Entregado' : 'No entregado',
      created_at: s.created_at,
      extra: s.extra,
      course: s.course_turn_student.course_turn.course.name
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.saleService
      .getSales(params)
      .subscribe((sales) => {
        this.isLoading = false;
        this._sales = sales;
      });
  }

  // Exports

  exportPdf() {
    console.log('pdf');
  }

  exportExcel() {
    console.log('hola');
    import('xlsx').then((xlsx) => {
      const data = this.sales.map((u) => {
        const { paymentId, ...rest } = u;
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
