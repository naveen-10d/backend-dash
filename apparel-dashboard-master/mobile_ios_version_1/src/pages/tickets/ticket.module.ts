import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDashboardPage } from './ticketdashboard';
import { IonicPageModule } from 'ionic-angular';
import { NewTicketComponent } from './newTicket/newTicketComponent'
import { NewTicket2Component } from './newTicket2/newTicket2Component'
import { TicketDetailsComponent } from './ticketDetails/ticketDetailsComponent';
import { CloseTicketComponent } from './closeTicket/closeTicketComponent';
import { TicketFilter } from './ticketFilter/ticketFilter.Component'
import { TicketService } from './ticket.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertController } from 'ionic-angular';


@NgModule({
  imports: [
    CommonModule,
    IonicPageModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule,

  ],
  declarations: [
    TicketDashboardPage,
    NewTicketComponent,
    NewTicket2Component,
    TicketDetailsComponent,
    CloseTicketComponent,
    TicketFilter

  ],
  entryComponents: [
    TicketDashboardPage,
    NewTicketComponent,
    NewTicket2Component,
    TicketDetailsComponent,
    CloseTicketComponent,
    TicketFilter

  ],
  exports: [
    TicketDashboardPage,
    NewTicketComponent,
    NewTicket2Component,
    TicketDetailsComponent,
    TicketFilter

  ],
  providers: [
    TicketService,
    AlertController

  ]
})
export class TicketModule { }
