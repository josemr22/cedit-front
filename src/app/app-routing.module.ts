import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canLoad: [AuthGuard],
    children: [
      {
        canActivate: [AuthGuard],
        path: 'usuarios',
        data: { menu: 'users' },
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'cursos',
        data: { menu: 'courses' },
        loadChildren: () =>
          import('./courses/courses.module').then((m) => m.CoursesModule),
      },
      {
        path: 'alumnos',
        loadChildren: () =>
          import('./students/students.module').then((m) => m.StudentsModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'caja',
        loadChildren: () =>
          import('./till/till.module').then((m) => m.TillModule),
        data: { menu: 'till' },
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./sales/sales.module').then((m) => m.SalesModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'dashboard',
        component: DashboardComponent,
        data: { menu: 'dashbaord' },
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
