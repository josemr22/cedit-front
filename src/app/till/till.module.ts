import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TillRoutingModule } from './till-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PayFormComponent } from './components/pay-form/pay-form.component';
import { IndexComponent } from './index.component';
import { SpendingsListComponent } from './components/spendings-list/spendings-list.component';
import { VouchersListComponent } from './components/vouchers-list/vouchers-list.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UserProductionComponent } from './components/user-production/user-production.component';
import { ReportByBankComponent } from './components/report-by-bank/report-by-bank.component';
import { CreditNotesListComponent } from './components/credit-notes-list/credit-notes-list.component';
import { SpendingFormComponent } from './components/spending-form/spending-form.component';
import { MoraComponent } from './components/mora/mora.component';
import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';

@NgModule({
  declarations: [PayFormComponent, IndexComponent, SpendingsListComponent, VouchersListComponent, ReportsComponent, UserProductionComponent, ReportByBankComponent, CreditNotesListComponent, SpendingFormComponent, MoraComponent, EditTransactionComponent],
  imports: [CommonModule, TillRoutingModule, SharedModule, ReactiveFormsModule],
})
export class TillModule {}
