import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IndexComponent } from './index.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PaymentsTableComponent } from './components/payments-table/payments-table.component';

@NgModule({
  declarations: [IndexComponent, StudentsListComponent, PaymentsComponent, PaymentsTableComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class StudentsModule {}
