import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { OperationsComponent } from './components/operations/operations.component';
import { InscriptionListComponent } from './components/inscription-list/inscription-list.component';
import { InscriptionFormComponent } from './components/inscription-form/inscription-form.component';
import { InformsListComponent } from './informs-list/informs-list.component';
import { InformsFormComponent } from './informs-form/informs-form.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EditStudentWithCourseComponent } from './components/edit-student-with-course/edit-student-with-course.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        canActivate: [AuthGuard],
        path: 'informes',
        component: InformsListComponent,
        data: { menu: 'informs' },
      },
      {
        path: 'informes/nuevo',
        component: InformsFormComponent,
        canActivate: [AuthGuard],
        data: { menu: 'informs' },
      },
      {
        path: 'inscripcion',
        component: InscriptionListComponent,
        canActivate: [AuthGuard],
        data: { menu: 'inscription' },
      },
      {
        path: 'inscripcion/inscribir/:id',
        component: InscriptionFormComponent,
        canActivate: [AuthGuard],
        data: { menu: 'inscription' },
      },
      {
        path: '',
        component: IndexComponent,
        canActivate: [AuthGuard],
        data: { menu: 'students' },
        children: [
          {
            path: 'lista',
            component: StudentsListComponent,
          },
          {
            path: 'editar/:id',
            component: EditStudentWithCourseComponent,
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
export class StudentsRoutingModule { }
