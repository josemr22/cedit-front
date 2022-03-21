import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TillRoutingModule } from './till-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PayFormComponent } from './components/pay-form/pay-form.component';

@NgModule({
  declarations: [PayFormComponent],
  imports: [CommonModule, TillRoutingModule, SharedModule, ReactiveFormsModule],
})
export class TillModule {}
