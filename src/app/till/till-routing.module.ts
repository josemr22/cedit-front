import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayFormComponent } from './components/pay-form/pay-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pagar/:id',
        component: PayFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TillRoutingModule {}
