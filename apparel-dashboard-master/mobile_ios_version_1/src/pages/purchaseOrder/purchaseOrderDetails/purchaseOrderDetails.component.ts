import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NewTicketComponent } from '../../tickets/newTicket/newTicketComponent'
import { PurchaseOrderFilterComponent } from '../purchaseOrderFilter/purchaseOrderFilter.component';

@Component({
  selector: 'page-purchaseOrderDetails',
  templateUrl: 'purchaseOrderDetails.html',

})

export class PurchaseOrderDetailsComponent implements OnInit {

  private orderDetails: Object;
  private purchaseorder: any [];
  private purchaseorderdetail: any;
  private expandindex: Number = null;

  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
  }

  ngOnInit(): void {
    this.add_purchaseorderdetails();
  }

 add_purchaseorderdetails(){
   this.purchaseorder = [];
  this.orderDetails = this.navParams.get('orderDetails');
    this.purchaseorder.push(this.orderDetails);
    this.purchaseorder.forEach(element=>{
      this.purchaseorderdetail = element.VendorReceiveDetails;
    })
  console.log("inside init-->> ", this.orderDetails)

 }
  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  filterOrder() {
    this.navCtrl.push(PurchaseOrderFilterComponent);
  }

  showDetails(index) {
    console.log("---->> ", index)
    this.expandindex = index;
  }

  hideDetails() {
    this.expandindex = null;
  }

  gotoNewTicket() {
    console.log("---->new ticket--> ");
    this.navCtrl.push(NewTicketComponent, {
    });
  }
  doRefresh(refresher) {
    this.add_purchaseorderdetails();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }



}