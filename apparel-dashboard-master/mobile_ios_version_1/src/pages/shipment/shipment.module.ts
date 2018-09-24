import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ShipmentService } from './shipment.service';
import { ShipmentComponent } from './shipment.component';
import { ShipmentItemsComponent } from './shipment items/shipmentitems';
import { PackedBox } from './PackedBox/PackedBox.component';
import { PackedBoxitems } from './PackedBoxitems/PackedBoxitems.component';
import { ShipmentFilterComponent } from '../shipment/ShipmentFilter/ShipmentFilter.Component';


@NgModule({
    imports: [
        CommonModule,
        IonicPageModule,
        ReactiveFormsModule,
        Ng4LoadingSpinnerModule
    ],
    declarations: [
        ShipmentComponent,
        ShipmentItemsComponent,
        PackedBox,
        PackedBoxitems,
        ShipmentFilterComponent
    ],
    entryComponents: [
        ShipmentComponent,
        ShipmentItemsComponent,
        PackedBox,
        PackedBoxitems,
        ShipmentFilterComponent
    ],
    exports: [
        ShipmentComponent,
        ShipmentItemsComponent,
        PackedBox,
        PackedBoxitems,
        ShipmentFilterComponent
    ],
    providers: [ShipmentService]
})
export class ShipmentModule { }
