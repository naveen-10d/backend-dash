import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  PurchaseOrdersComponent } from './purchase-orders.component';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule
  ],
  declarations: [ 
    PurchaseOrdersComponent,
  ],
  entryComponents: [
    PurchaseOrdersComponent,
  ],
  exports: [ 
    PurchaseOrdersComponent,
  ] 
})
export class OrderModule { }
