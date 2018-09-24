import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './OrderComponent';
import { OrderFilterComponent } from './orderFilter/orderFilterComponent';
import { OrderDetailsComponent } from './orderDetails/orderDetailsComponent';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule
  ],
  declarations: [ 
    OrderComponent,
    OrderFilterComponent,
    OrderDetailsComponent
  ],
  entryComponents: [
    OrderComponent,
    OrderFilterComponent,
    OrderDetailsComponent 
  ],
  exports: [ 
    OrderComponent,
    OrderFilterComponent,
    OrderDetailsComponent 
  ] 
})
export class OrderModule { }
