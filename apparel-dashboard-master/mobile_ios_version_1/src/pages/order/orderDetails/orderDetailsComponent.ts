import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NewTicketComponent } from '../../tickets/newTicket/newTicketComponent'
import { OrderFilterComponent } from '../orderFilter/orderFilterComponent';
import { OrderService } from '../order.service';
@Component({
  selector: 'page-orderDetails',
  templateUrl: 'orderDetails.html',

})

export class OrderDetailsComponent implements OnInit {

  private orderDetails: any;
  private salesorder: any;
  private order: any = {
    CompanyCode: '',
    PONumber: null,
    OrderDate: '',
    Tickets: null,
  };
  private ticket: any;
  private ticketstatus: any;
  private ticketdate: any;
  private assignedto: any;
  private createdby: any;
  private orderitems: any;
  private expandindex: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController, private orderservice: OrderService) {
  }

  ngOnInit(): void {
    this.orderDetails = this.navParams.get('orderDetails');
    // console.log('---------orderdetail-----------', this.orderDetails.OrderID);
    this.getorderid();
  }
  getorderid() {
    this.orderitems = [];
    this.orderservice.getorderbyid(this.orderDetails.OrderID).subscribe(data => {
      this.order = data;
      console.log('---------orderdetail-----------', this.order);
      this.ticket = data.Ticket;
      this.orderitems = data.SalesOrderItems;
      if(this.ticket !== undefined){
        this.ticket.forEach(element => {
          this.ticketstatus = element.Status;
          this.ticketdate = element.Date;
          element.assigned_to.forEach(element2 => {
            this.assignedto = element2.firstname;
          });
        });  
      }
      this.ticket.forEach(element => {
        this.createdby = element.created_by.firstname;
        // console.log('--------createdby-------------', element);
      })
    });
  }
  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  filterOrder() {
    this.navCtrl.push(OrderFilterComponent);
  }
  expandrow(row, i) {
    this.salesorder = row.SalesOrderDetails;
    this.showDetails(i);
  }
  showDetails(i) {
    this.expandindex = i;
  }

  hideDetails() {
    this.expandindex = null;
  }

  gotoNewTicket() {
    console.log("---->new ticket--> ");
    this.navCtrl.push(NewTicketComponent, {
      ordernumber: this.order
    });
  }
  doRefresh(refresher) {
    this.getorderid();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


}