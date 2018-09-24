import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-ticketdashboard',
  templateUrl: 'ticketdashboard.html',

})

export class TicketDashboardPage implements OnInit {

  public allList: {};

  private allTicketsToFilter: {};

  constructor(private menu: MenuController, public navCtrl: NavController) {
  }

  searchQuery: string = '';
  items: string[];
  Ticketslist: any;

  add_Ticketlist() {
    this.allTicketsToFilter = [
      {
        "ticketId": "435678",
        "Date": "02/05/2017",
        'OrderNumber':456778,
        'CreatedBy':'sample User',
        'AssignedUser':'John Doe',         
        "status": "Open"
      },
      {
        "ticketId": "98765",
        "Date": "04/09/2018",
        'OrderNumber':97654,
        'CreatedBy':'sample User',
        'AssignedUser':'Dhina',         
        "status": "Open"
      },
      {
        "ticketId": "435678",
        'Date': '04/09/2018',
        'OrderNumber':456778,
        'CreatedBy':'sample User',
        'AssignedUser':'Sasi',         
        'status':'Open'
      }
    ]
    this.Ticketslist = this.allTicketsToFilter;
  }

  ionViewDidLoad() {

  }

  filterOrder() {
    console.log("---->Filter Clicked ------------ >  ");
    // this.navCtrl.setRoot(OrderFilterComponent);
  }

  displayTicketDetails(order) {
    console.log("----> order details--> ", order);
    // this.navCtrl.setRoot(OrderDetailsComponent);
  }


  ngOnInit(): void {
    this.add_Ticketlist();
  }
  getItems(ev: any) {
    this.Ticketslist = this.allTicketsToFilter

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.Ticketslist = Object(this.Ticketslist).filter((item) => {
        return (item.Location.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
