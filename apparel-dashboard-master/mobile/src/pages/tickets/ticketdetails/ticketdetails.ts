import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../../../pages/login/login';
import { TicketCreationService } from '../../../shared';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-ticketdetails',
  templateUrl: 'ticketdetails.html'
})
export class TicketDetailsPage {

  private ticketDetails = {
    "id": 0,
    "severity": "",
    "priority": "",
    "status": "",
    "subject": "",
    "description": "",
    "timeofcreation": "",
    "escalate": "",
    "timeofassign": "",
    "UserId": null,
    "ownerfk": null,
    "assigntofk": null,
    "assignto": {
      "id": null,
      "password": "",
      "username": ""
    },
    "user": {
      "id": null,
      "password": "",
      "username": ""
    }
  };
  reopenBtn: boolean;
  closeBtn: boolean;

  constructor(
    public navParams: NavParams, public navCtrl: NavController,
    public ticketCreationService: TicketCreationService,
    private alertCtrl: AlertController,
    public loadingController: LoadingController) {
        this.reopenBtn=false;
        this.closeBtn=false;
     }

  ionViewDidLoad() {
    var id = this.navParams.get('id');

    this.getTicketDetails(id);
  }

  getTicketDetails(id) {
    let loading = this.loadingController.create({ content: "Getting ticket details" });
    loading.present();
    this.ticketCreationService.get_ticket_byID(id).subscribe((data) => {
      console.log("------>>> ", data);

      this.ticketDetails = data;
      if(this.ticketDetails.status=="ReOpened"){
        this.reopenBtn=true;
      }if(this.ticketDetails.status=="Closed"){
        this.closeBtn=true;
      }
      console.log("--->> ", this.ticketDetails)
      loading.dismissAll();
    });
  }

  public presentAlert(message: string): void {
    let alert = this.alertCtrl.create({
      title: 'Alert..!',
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            if (message == "Reopen") {
              this.update_reopen()
            }if (message == "Close") {
              this.update_close()
            }if (message == "Escalate") {
              this.update_escalate()
            }

          }
        }
      ]
    });
    alert.present();
  }

  showAlert(ticketStatus) {
    let alert = this.alertCtrl.create({
      // title: '',
      subTitle: ticketStatus,
      buttons: ['OK']
    });
    alert.present();
  }

  update_reopen() {
    console.log("update reopen method called")
    this.ticketDetails.status = "ReOpened";
    this.ticketCreationService.update_tickets( this.ticketDetails).subscribe(
      data => {
        console.log("i am in Ticket ReOpened")
        this.showAlert("Ticket ReOpened..!");
      },
      error => {
        this.showAlert("Somthing borke..!");
      });
  }

  update_close() {
    this.ticketDetails.status = "Closed";
    this.ticketCreationService.update_tickets( this.ticketDetails).subscribe(
      data => {
        console.log("i am in Ticket Updated")
        this.showAlert("Ticket Closed..!");
      },
      error => {
        console.log("i am in error")
        this.showAlert("Somthing borke..!");
      });
  }
  update_escalate() {
    this.ticketDetails.escalate = "yes";
    this.ticketCreationService.update_tickets( this.ticketDetails).subscribe(
      data => {
        console.log("i am in Ticket Updated")
        this.showAlert("Ticket Escalated..!");
      },
      error => {
        console.log("i am in error")
        this.showAlert("Somthing borke..!");
        this.ticketDetails.escalate = "no";
      });
  }
}
