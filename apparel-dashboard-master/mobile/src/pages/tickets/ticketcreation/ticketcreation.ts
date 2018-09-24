import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../../../pages/login/login';
import { TicketCreationService } from '../../../shared';
import { TicketDashboardPage } from '../ticketdashboard/ticketdashboard';

@Component({
  selector: 'page-ticketcreation',
  templateUrl: 'ticketcreation.html'
})
export class TicketCreationPage {

  private userDetails = {
    uuid: ''
  };
  private ticket = {
    priority: '',
    severity: '',
    status: '',
    description: '',
    subject: ''
  };

  constructor(
    private menu: MenuController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public ticketCreationService: TicketCreationService,
    public loadingController: LoadingController
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem('currentuser')).user;
  }

  ionViewWillLoad() {
  }

  createTicket() {
    let loading = this.loadingController.create({ content: "Creating Ticket...." });
    loading.present();

    var data = {
      "severity": this.ticket.severity,
      "priority": this.ticket.priority,
      "status": "Open",
      "subject": this.ticket.subject,
      "description": this.ticket.description,
      "escalate": "no",
      "UserUuid": this.userDetails.uuid,
      // "assignto": {
      //     "id": 1,
      //     "username": "useradmin",
      //     "password": "useradmin"
      // }
    }

    this.ticketCreationService.create_tickets(data).subscribe((data) => {
      if (data.uuid) {
        loading.dismissAll();
        this.presentAlert('Ticket created successfully!' + '<br>' + 'Your Ticket ID:' + data.uuid);
      }
    });
  }

  goToDashboard() {
    this.navCtrl.push(TicketDashboardPage);
  }

  presentAlert(message: string): void {
    let alert = this.alertCtrl.create({
      title: 'Information',
      message: message,
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: data => {
          this.ticket = {
            priority: '',
            severity: '',
            status: '',
            description: '',
            subject: ''
          }
        }
      }]
    });
    alert.present();
  }

}
