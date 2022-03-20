import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout/main-layout.component';
import { IndexComponent } from './index.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { OperationsComponent } from './components/operations/operations.component';
import { InscriptionListComponent } from './components/inscription-list/inscription-list.component';
import { InscriptionFormComponent } from './components/inscription-form/inscription-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inscripcion',
        component: InscriptionListComponent,
      },
      {
        path: 'inscripcion/inscribir/:id',
        component: InscriptionFormComponent,
      },
      {
        path: '',
        component: IndexComponent,
        children: [
          {
            path: 'lista',
            component: StudentsListComponent,
          },
          {
            path: 'pagos/:id',
            component: PaymentsComponent,
          },
          {
            path: 'operaciones',
            component: OperationsComponent,
          },
          {
            path: '**',
            redirectTo: 'lista',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
