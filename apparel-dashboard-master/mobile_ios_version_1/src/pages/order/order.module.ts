import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './OrderComponent';
import { OrderFilterComponent } from './orderFilter/orderFilterComponent';
import { OrderDetailsComponent } from './orderDetails/orderDetailsComponent';
import { IonicPageModule } from 'ionic-angular';
import {OrderService} from './order.service'
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule,
    Ng4LoadingSpinnerModule
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
  ],
  providers: [
    OrderService
  ], 
})
export class OrderModule { }
