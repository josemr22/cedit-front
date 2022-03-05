import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { IndexComponent } from './index.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { CreateTurnComponent } from './components/create-turn/create-turn.component';
import { EditTurnComponent } from './components/edit-turn/edit-turn.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormCourseComponent } from './components/form-course/form-course.component';
import { SelectCourseComponent } from './components/select-course/select-course.component';

@NgModule({
  declarations: [
    IndexComponent,
    EditCourseComponent,
    CreateCourseComponent,
    CreateTurnComponent,
    EditTurnComponent,
    FormCourseComponent,
    SelectCourseComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CoursesModule {}
