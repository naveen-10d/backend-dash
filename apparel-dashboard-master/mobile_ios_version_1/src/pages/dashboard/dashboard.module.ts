import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard'
import { NavBarModule } from '../navbar/navbar.module';
import {DashboardService} from './dashboard.service'


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule,
    NavBarModule
  ],
  declarations: [
    DashboardPage
  ],
  entryComponents: [
    DashboardPage
  ],
  exports: [
    DashboardPage
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
