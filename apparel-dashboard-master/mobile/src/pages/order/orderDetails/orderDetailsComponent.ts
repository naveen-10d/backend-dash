import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-orderDetails',
  templateUrl: 'orderDetails.html',
  
})

export class OrderDetailsComponent implements OnInit {

  private orderDetails:Object;

  constructor( private menu: MenuController , public navCtrl: NavController, private navParams: NavParams ) {
  }

  ngOnInit(): void {
    this.orderDetails = this.navParams.get('orderDetails');
    console.log("inside init-->> ", this.orderDetails)
  }
}