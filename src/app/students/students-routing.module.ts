import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout/main-layout.component';
import { IndexComponent } from './index.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PaymentsComponent } from './components/payments/payments.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'lista',
        component: StudentsListComponent,
      },
      {
        path: 'pagos',
        component: PaymentsComponent,
      },
      {
        path: '**',
        redirectTo: 'lista',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
