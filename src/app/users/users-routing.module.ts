import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index.component';
import { MainLayoutComponent } from '../shared/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'usuarios',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
