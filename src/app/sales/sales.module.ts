import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { UniformListComponent } from './components/uniform-list/uniform-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SaleFormComponent } from './components/sale-form/sale-form.component';


@NgModule({
  declarations: [
    UniformListComponent,
    SaleFormComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SalesModule { }
