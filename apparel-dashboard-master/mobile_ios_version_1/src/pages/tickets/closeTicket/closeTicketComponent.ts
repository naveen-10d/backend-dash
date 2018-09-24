import { Component, OnInit } from "@angular/core";
import { NavParams, NavController } from 'ionic-angular';
import { TicketService } from '../ticket.service';
import { TicketDashboardPage } from '../ticketdashboard';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-closeTicket',
    templateUrl: 'closeTicket.html'
})
export class CloseTicketComponent implements OnInit {
    constructor(private ticketservice: TicketService, private navParams: NavParams, public navCtrl: NavController,
        private alertctrl: AlertController) {
    }

    private Reason: any;
    private ticketdetails: any;
    ngOnInit() {
        this.ticketdetails = this.navParams.get('ticketdetail');
        console.log('---------tdetial---------', this.ticketdetails);
        this.getcloseReason();
    }
    getcloseReason() {
        this.ticketservice.getcloseReason().subscribe(data => {
            this.Reason = data;
            console.log('--------close-------', this.Reason);
        }, error => {

        });
    }

    closeTicketOption(close) {
        let alert = this.alertctrl.create({
            title: 'Close Ticket Confirmation',
            message: 'You have Confirmed to Close this Ticket',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Dismiss Clicked')
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        const datatoupdate = this.ticketdetails;
                        datatoupdate.CloseReason = close.Reason;
                        datatoupdate.CloseReasonUuid = close.uuid;
                        datatoupdate.Status = "Closed";
                        console.log('-----------datatoupdate-----------', datatoupdate);
                        this.ticketservice.updateticket(datatoupdate).subscribe(data => {
                            console.log('----------updated data-----------', data);
                        }, error => {

                        });
                        this.navCtrl.setRoot(TicketDashboardPage, {
                        });

                    }
                }
            ]
        });
        alert.present();

    }
}