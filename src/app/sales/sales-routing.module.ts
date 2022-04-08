import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniformListComponent } from './components/uniform-list/uniform-list.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: ':type',
    component: UniformListComponent,
    canActivate: [AuthGuard],
    data: { menu: 'sales' },
  },
  {
    path: 'nuevo/:type',
    component: SaleFormComponent,
    canActivate: [AuthGuard],
    data: { menu: 'sales' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
