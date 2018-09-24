import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-puchaseorder-component',
  templateUrl: 'purchase-ordersComponent.html',
  
})

export class PurchaseOrdersComponent implements OnInit {

  public allList : {};
  
  private allOrderssToFilter: {};
  constructor( private menu: MenuController, public navCtrl: NavController ) {

  }

  searchQuery: string = '';
  items: string[];
  orderslist: any;
  
  filterOrder() {
    // this.navCtrl.setRoot(OrderFilterComponent);
  }

  displayOrderDetails(order) {
    console.log("----> order details--> ", order);
    // this.navCtrl.push(OrderDetailsComponent, {
    //   orderDetails: order
    // });
  }

  add_orderslist(){
    this.allOrderssToFilter=[
      {
        "orderId":"435678",
        "location":"DFC",
        "customer":"123456789",
        "date":"04/09/2018",
        "tickets":2,
        "forecasted_arraival":"In Progress"
      },
      {
        "orderId":"435678",
        "location":"DFC",
        "customer":"123456789",
        "date":"04/09/2018",
        "tickets":2,
        "forecasted_arraival":"In Progress"
      },
      {
        "orderId":"435678",
        "location":"DFC",
        "customer":"123456789",
        "date":"04/09/2018",
        "tickets":2,
        "forecasted_arraival":"In Progress"
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
