import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { InventoryService } from './Inventory.service';
import { InventoryComponent } from './Inventory.Component';
import { InventoryFilterComponent } from './InventoryFilter/InventoryFilter.Component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    imports: [
        CommonModule,
        IonicPageModule,
        Ng4LoadingSpinnerModule
    ],
    declarations: [
        InventoryComponent,
        InventoryFilterComponent
    ],
    entryComponents: [
        InventoryComponent,
        InventoryFilterComponent
    ],
    exports: [
        InventoryComponent,
        InventoryFilterComponent
    ],
    providers: [
        InventoryService
    ]
})
export class Inventorymodule { }
