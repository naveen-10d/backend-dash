import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TicketService } from '../ticket.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {TicketDashboardPage} from '../ticketdashboard'
@Component({
  selector: 'page-newTicket2',
  templateUrl: 'newTicket2.html',

})

export class NewTicket2Component implements OnInit {

  private ticket: any = {
    Type: '',
    Status: '',
    assignedToUuid: '',
    createdByUuid: '',
    createdByUser:{},
    description: '',
    organizationUuid: '',
    salesorder: []
  }
  orgUUID: String;
  public Description;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private navParam: NavParams, private ticketService: TicketService,
    private spinnerservice: Ng4LoadingSpinnerService) {   
       
 }


  ngOnInit(): void {
    this.ticket.createdByUser = JSON.parse(localStorage.getItem('currentuser')).user;
    this.ticket.Type = this.navParam.get('ticketType');
    this.ticket.salesorder = this.navParam.get('ticketOrder');
    const json = JSON.parse(localStorage.getItem('currentuser'));
    // this.ticket.assignedToUuid = json.user.uuid;
    this.ticket.createdByUuid = json.user.uuid;
    this.ticket.organizationUuid = json.user.organizationUuid;
    // console.log("current user values are ---- -", json);
    console.log("ticket  values are ---- -", this.ticket);
  }

  ionViewDidLoad() {
    // this.viewCtrl.setBackButtonText('');
  }

  createTicket() {
    this.spinnerservice.show();
    this.ticket.Status = "New";
    this.ticket.description = this.Description;
    console.log("before creating ticket are --- ", this.ticket);
    this.ticketService.saveTicket(this.ticket).subscribe(
      data => {
        // this.spinnerservice.hide();
        // this.navCtrl.push(TicketDashboardPage, {
        // });    
        console.log("success to save the data --- ",data)
        this.spinnerservice.hide();
        this.navCtrl.setRoot(TicketDashboardPage, {});
      },
      error => {
        console.log("something went wrong")
      }
    )
  }




}