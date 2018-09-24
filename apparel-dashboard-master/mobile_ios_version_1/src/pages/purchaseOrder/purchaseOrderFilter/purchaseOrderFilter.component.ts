import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { PurchaseOrderComponent } from '../purchaseOrder.component';

@Component({
  selector: 'page-purchaseOrderFilter',
  templateUrl: 'purchaseOrderFilter.html',

})

export class PurchaseOrderFilterComponent implements OnInit {

  private location: any [];
  private customer: any [];
  private orderStatus: any [];
  private selectedLocation: any;
  private selectedCustomer: any;
  private selectedOrderStatus: any;
  private selectedSortValue: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public nav: NavParams) {
  }

  ngOnInit(): void {
    this.getParamsValue()
  }

  getParamsValue() {
    this.location = [];
    this.orderStatus = [];
    this.customer = [];
    this.location.push(this.nav.get('location'));
    this.customer.push(this.nav.get('customer'));
    this.orderStatus.push(this.nav.get('orderStatus'));
    console.log("getted params in filter --- ", this.location, this.customer, this.orderStatus);
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  selectedoption() {
    this.navCtrl.setRoot(PurchaseOrderComponent, {
      location: this.selectedLocation,
      customer: this.selectedCustomer,
      orderStatus: this.selectedOrderStatus,
      sortValue: this.selectedSortValue,
      componentname: 'PurchaseorderFilter'
    })
  }
}