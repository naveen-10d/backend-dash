import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderComponent } from './purchaseOrder.component';
import { IonicPageModule } from 'ionic-angular';
import { PurchaseOrderFilterComponent } from './purchaseOrderFilter/purchaseOrderFilter.component';
import { PurchaseOrderDetailsComponent } from './purchaseOrderDetails/purchaseOrderDetails.component';
import { PurchaseOrderService } from './purchaseOrder.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule,
    Ng4LoadingSpinnerModule
  ],
  declarations: [ 
    PurchaseOrderComponent,
    PurchaseOrderFilterComponent,
    PurchaseOrderDetailsComponent 
  ],
  entryComponents: [
    PurchaseOrderComponent,
    PurchaseOrderFilterComponent,
    PurchaseOrderDetailsComponent 
  ],
  providers: [
    PurchaseOrderService
  ],
  exports: [ 
    PurchaseOrderComponent,
    PurchaseOrderFilterComponent,
    PurchaseOrderDetailsComponent 
  ] 
})
export class PurchaseOrderModule { }
