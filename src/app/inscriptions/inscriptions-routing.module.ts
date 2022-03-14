import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/main-layout/main-layout.component';
import { IndexComponent } from './index.component';
import { InscriptionFormComponent } from './components/inscription-form/inscription-form.component';

const routes: Routes = [
  {
    path: 'preinscripcion',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: 'nuevo',
        component: InscriptionFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionsRoutingModule {}
