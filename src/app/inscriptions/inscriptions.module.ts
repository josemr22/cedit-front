import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InscriptionsRoutingModule } from './inscriptions-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index.component';
import { InscriptionFormComponent } from './components/inscription-form/inscription-form.component';

@NgModule({
  declarations: [
    IndexComponent,
    InscriptionFormComponent
  ],
  imports: [
    CommonModule,
    InscriptionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class InscriptionsModule {}
