import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
  declarations: [SidebarComponent, LoginComponent, MainLayoutComponent],
  imports: [CommonModule, RouterModule, TableModule, BrowserAnimationsModule],
  exports: [SidebarComponent, TableModule, ButtonModule, AutoCompleteModule],
})
export class SharedModule {}
