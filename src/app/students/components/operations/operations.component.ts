import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { Bank, Operation } from '../../interfaces/operation.interface';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styles: [],
})
export class OperationsComponent implements OnInit {
  operations: Operation[] = [];
  operation: string = '';
  bank_id: number = 1;
  banks: Bank[] = [];

  cols!: any[];
  exportColumns!: any[];
  data: any[] = [];

  constructor(
    private studentService: StudentsService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.getBanks().subscribe((b) => (this.banks = b));

    this.cols = [
      { field: 'name', header: 'Nombre' },
      { field: 'voucher', header: 'Comprobante' },
      { field: 'responsable', header: 'Registrado por' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  changeBank(event: Event) {
    this.bank_id = Number((event.target as HTMLSelectElement).value);
  }

  changeOperation(event: Event) {
    this.operation = (event.target as HTMLInputElement).value;
  }

  search() {
    console.log(this.operation, this.bank_id);
    this.studentService
      .getOperation(this.operation, this.bank_id)
      .subscribe((operations) => {
        console.log(operations);
        this.operations = operations;
        this.operations.forEach((o) => {
          if (o.payment) {
            this.data.push({
              courseTurnStudentId: o.payment.course_turn_student.id,
              name: o.payment.course_turn_student.student.name,
              voucher: o.payment.voucher,
              responsable: o.responsable.name,
            });
          } else {
            this.data.push({
              courseTurnStudentId:
                o.damping?.installment.payment.course_turn_student.id,
              name: o.damping?.installment.payment.course_turn_student.student
                .name,
              voucher: o.damping?.voucher,
              responsable: o.responsable.name,
            });
          }
        });
      });
  }
}
