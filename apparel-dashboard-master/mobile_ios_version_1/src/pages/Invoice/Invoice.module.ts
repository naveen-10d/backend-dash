import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceService } from './Invoice.service';
import { InvoiceComponent } from './InvoiceComponent';
import { InvoiceFilter } from '../Invoice/InvoiceFilter/InvoiceFilter.Component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    imports: [
        CommonModule,
        IonicPageModule,
        Ng4LoadingSpinnerModule
    ],
    declarations: [
        InvoiceComponent,
        InvoiceFilter
    ],
    entryComponents: [
        InvoiceComponent,
        InvoiceFilter
    ],
    exports: [
        InvoiceComponent,
        InvoiceFilter
    ],
    providers: [
        InvoiceService
    ]
})
export class Invoicemodule { }
