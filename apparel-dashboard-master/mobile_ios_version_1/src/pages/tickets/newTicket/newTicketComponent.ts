import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { NewTicket2Component } from '../newTicket2/newTicket2Component';
import { OrderService } from '../../order/order.service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-newTicket',
  templateUrl: 'newTicket.html',

})

export class NewTicketComponent implements OnInit {

  public allList: {};
  private startpage: Number;
  private stoppage: Number;
  private allorders: any;
  private allOrderssToFilter: {};
  ordernumber: any ;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private orderService: OrderService,
  private alertctrl: AlertController,private nav: NavParams ) {
  }

  searchQuery: string = '';
  items: string[];
  orderslist: any;

  ticketType: any;
  selectedRowValue: any[] = [];

  // filterOrder() {
  //   this.navCtrl.setRoot(OrderFilterComponent);
  // }

  add_orderslist() {
    this.startpage = 0;
    this.stoppage = 25;
    this.orderService.getData(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '').subscribe(
      data => {
        this.allorders = data;
        console.log('entering into add orders list are ----- ', data)
        this.orderslist = this.allorders.response;
        this.getParamvalue();
      },
      error => {
        console.log("something went wrong")
      }
    )

  }
  doInfinite() {
    this.stoppage = Number(this.stoppage) + Number(this.stoppage);
    // console.log('Startpage------->>>>',this.startpage);
    // console.log('Stoppage-------->>>>',this.stoppage);
    this.orderService.getData(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '').subscribe(data => {
      this.allorders = data;
      this.orderslist = this.allorders.response;
      // console.log('-------Orders----->>>>', this.orderslist);
    }, error => {
      // infiniteScroll.complete();
      console.log('------Error--->>>', error);
    })
    // infiniteScroll.complete();

  }

  ionViewDidLoad() {
    // this.viewCtrl.setBackButtonText('');
  }

  ngOnInit(): void {
    this.add_orderslist();
    // console.log('-----------type----------', this.orderslist);
    // console.log('entering into ng on inti in new ticket components are ------ ', this.selectedRowValue, this.orderslist)

  }
  getParamvalue(){
    this.ordernumber = this.nav.get('ordernumber');
    console.log('--------OrderNumber-------',this.ordernumber)
    if (this.ordernumber !== undefined){
      this.orderslist.forEach(element => {
        if (element.OrderID === this.ordernumber.OrderID){
          console.log('------Ordelist--------->>>>>', element);
          this.selectedRowValue.push(element);
        }
      });
    }

  }
  selectedRow(row) {
    if (this.selectedRowValue.indexOf(row) > -1) {
      console.log('-----testing------', this.selectedRowValue.indexOf(row));
      this.selectedRowValue.splice(this.selectedRowValue.indexOf(row), 1);
    } else {
      console.log('-----testing else------', this.selectedRowValue);
      this.selectedRowValue.push(row);
    }
  }

  getItems(ev: any) {
    this.orderslist = this.allOrderssToFilter

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.orderslist = Object(this.orderslist).filter((item) => {
        return (item.Location.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  gotoNextStep() {
    this.navCtrl.push(NewTicket2Component, {
      ticketType: this.ticketType,
      ticketOrder: this.selectedRowValue
    });
  }
  presentconfirm(){
    let alert = this.alertctrl.create({
      title: 'Confirm Ticket',
      message: 'You have not selected any Order for this ticket. Is it Ok ?',
      buttons:[
        {
        text:'Cancel',
        role:'cancel',
        handler:() =>{
          console.log('Dismiss Clicked')
        }
      },
      {
        text:'Ok',
        handler:()=>{
          this.navCtrl.push(NewTicket2Component, {
            ticketType: this.ticketType,
            ticketOrder: this.selectedRowValue
          });
        }
      }
    ]
    });
    alert.present();

  }
}