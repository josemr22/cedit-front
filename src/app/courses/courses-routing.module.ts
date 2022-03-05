import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout/main-layout.component';
import { IndexComponent } from './index.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { CreateTurnComponent } from './components/create-turn/create-turn.component';
import { EditTurnComponent } from './components/edit-turn/edit-turn.component';

const routes: Routes = [
  {
    path: 'cursos',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
        children: [
          {
            path: 'crear-curso',
            component: CreateCourseComponent,
          },
          {
            path: 'editar-curso',
            component: EditCourseComponent,
          },
          {
            path: 'crear-turno',
            component: CreateTurnComponent,
          },
          {
            path: 'editar-turno',
            component: EditTurnComponent,
          },
          {
            path: '**',
            redirectTo: 'crear-curso',
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
export class CoursesRoutingModule {}
