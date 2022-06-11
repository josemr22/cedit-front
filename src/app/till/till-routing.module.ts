import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { OperationControlComponent } from './components/operation-control/operation-control.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'comprobantes',
        component: VouchersListComponent
      },
      {
        path: 'gastos',
        component: SpendingsListComponent
      },
      {
        path: 'reportes',
        component: ReportsComponent
      },
      {
        path: 'produccion-por-usuario',
        component: UserProductionComponent
      },
      {
        path: 'reporte-por-banco',
        component: ReportByBankComponent
      },
      {
        path: 'notas-de-credito',
        component: CreditNotesListComponent
      },
    ],
  },
  {
    path: 'gastos/:id',
    component: SpendingFormComponent,
  },
  {
    path: 'control-operacion',
    component: OperationControlComponent,
  },
  {
    path: 'pagar/:id',
    component: PayFormComponent,
  },
  {
    path: 'mora/:id',
    component: MoraComponent,
  },
  {
    path: 'transaccion/:id',
    component: EditTransactionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TillRoutingModule { }
