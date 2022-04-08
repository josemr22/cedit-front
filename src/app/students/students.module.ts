import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IndexComponent } from './index.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PaymentsTableComponent } from './components/payments-table/payments-table.component';
import { OperationsComponent } from './components/operations/operations.component';
import { InscriptionListComponent } from './components/inscription-list/inscription-list.component';
import { InscriptionFormComponent } from './components/inscription-form/inscription-form.component';
import { PayFormComponent } from './components/pay-form/pay-form.component';
import { InformsListComponent } from './informs-list/informs-list.component';
import { InformsFormComponent } from './informs-form/informs-form.component';

@NgModule({
  declarations: [IndexComponent, StudentsListComponent, PaymentsComponent, PaymentsTableComponent, OperationsComponent, InscriptionListComponent, InscriptionFormComponent, PayFormComponent, InformsListComponent, InformsFormComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class StudentsModule { }
