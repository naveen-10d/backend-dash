import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { OrderFilterComponent } from './orderFilter/orderFilterComponent';
import { OrderDetailsComponent } from './orderDetails/orderDetailsComponent';

@Component({
  selector: 'page-orderComponent',
  templateUrl: 'orderComponent.html',
  
})

export class OrderComponent implements OnInit {

  public allList : {};
  
  private allOrderssToFilter: {};
  constructor( private menu: MenuController, public navCtrl: NavController ) {

  }

  searchQuery: string = '';
  items: string[];
  orderslist: any;

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'dhinakar',
      'ram',
      'data'
    ];
  }

  filterOrder() {
    this.navCtrl.setRoot(OrderFilterComponent);
  }

  displayOrderDetails(order) {
    console.log("----> order details--> ", order);
    this.navCtrl.push(OrderDetailsComponent, {
      orderDetails: order
    });
  }

  add_orderslist(){
    this.allOrderssToFilter=[
      {
        "orderId":"435678",
        "Location":"DFC",
        "PO":"123456789",
        "Date":"04/09/2018",
        "Tickets":2,
        "status":"In Progress"
      },
      {
        "orderId":"09876",
        "Location":"NEW Balance",
        "PO":"5666",
        "Date":"02/03/2018",
        "Tickets":7,
        "status":"Recieved"
      }
    ]


    this.orderslist = this.allOrderssToFilter;
  }
  ionViewDidLoad() {
    
  }

  ngOnInit(): void {
    // this.initializeItems();
    this.add_orderslist();
  }


  getItems(ev: any){
this.orderslist = this.allOrderssToFilter
  
      let val = ev.target.value;
  
      if (val && val.trim() != '') {
        this.orderslist = Object(this.orderslist).filter((item) => {
          return (item.Location.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
  }
}
