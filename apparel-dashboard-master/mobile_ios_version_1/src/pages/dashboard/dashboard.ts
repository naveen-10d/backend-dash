import { Component, OnInit } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { DashboardService } from './dashboard.service';
import { TicketDetailsComponent } from '../tickets/ticketDetails/ticketDetailsComponent'

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',

})

export class DashboardPage implements OnInit {

  public allList: {};

  ticketDays = 7;

  orderreceived: number;

  orderreceivedtoday: number;

  prioritytickets: any;

  orderReceivedPercent: any;

  orderShipped: number;

  orderShippedToday: number;

  orderShippedPercent: number;

  orderOnTimeToday: number;

  orderOnTimePercent: number;

  ticketlength: number;

  private companycode;

  constructor(public navCtrl: NavController, public authService: AuthService, public app: App, private dashboardService: DashboardService) {
    if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
      if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
        this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
      }
    }

  }

  ionViewDidLoad() {

  }

  ngOnInit(): void {
    console.log('-------CompanyCode------>>>>>', this.companycode);
    // this.dashboardService.get_all_Lists().subscribe((data) => {
    // this.orderreceivedtoday = 0;
    // this.orderShippedToday = 0;
    // this.orderOnTimeToday = 0;  
    // var data = [{
    //   "reportname": "customer_product"
    // },
    // {
    //   "reportname": "Warehouse_Comparision"
    // },
    // {
    //   "reportname": "Forcastvsorders"
    // }]
    // this.allList = data
    this.getPrioritytickets();
    this.getOrderReceived();
    this.getOrdersShipped();
    this.onTime();
    // });
  }

  ionViewCanEnter() {
    if (!this.authService.authenticated()) {
      this.app.getRootNav().setRoot(LoginPage);
    }
  }

  getPrioritytickets() {
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.dashboardService.get_priorityOrg(this.ticketDays, this.companycode).subscribe(data => {
        this.prioritytickets = data.PriorityTickets;
        this.ticketlength = this.prioritytickets.length;
        console.log('--------------priority ticket list-------', this.prioritytickets);
      }, error => {
        console.log('----Error----->>>>', error);
      })
    } else {
      this.dashboardService.get_priority(this.ticketDays).subscribe(data => {
        this.prioritytickets = data.PriorityTickets;
        this.ticketlength = this.prioritytickets.length;
        console.log('--------------priority ticket list-------', this.prioritytickets);

      }, error => {
        console.log('-----------error---------', error);
      })
    }
  }

  getOrderReceived() {
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.dashboardService.get_ordersReceivedOrg(this.companycode).subscribe(data => {
        this.orderreceived = data.TodayOrder;
        console.log('--------Orderrecevied---->>>>', this.orderreceived);
        this.dashboardService.get_ordersReceivedTodayOrg(this.companycode).subscribe(ordertoday => {
          this.orderreceivedtoday = ordertoday.TodayOrderReceived;
          console.log('--------OrderreceviedToday---->>>>', this.orderreceivedtoday);
        }, error2 => {
          console.log('-----Error--->>>>', error2);
        })
      }, error => {
        console.log('------Error-->>>>', error);
      })
    } else {
      this.dashboardService.get_ordersReceived().subscribe(data => {
        this.orderreceived = data.TodayOrder;
        console.log('--------Orderrecevied---->>>>', this.orderreceived);
        this.dashboardService.get_ordersReceivedToday().subscribe(ordertoday => {
          this.orderreceivedtoday = ordertoday.TodayOrderReceived;
          console.log('--------OrderreceviedToday---->>>>', this.orderreceivedtoday);
        }, error2 => {
          console.log('----------error---------', error2);
        })
      }, error => {
        console.log('------error----------', error);
      })
    }
  }

  getOrdersShipped() {
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.dashboardService.get_orderShippedOrg(this.companycode).subscribe(data => {
        console.log('--------orderShipped---->>>>', data);
        this.orderShipped = data.TodayShippedOrder;
        this.dashboardService.get_orderShippedTodayOrg(this.companycode).subscribe(data2 => {
          console.log('--------orderShippedToday---->>>>', data2);
          this.orderShippedToday = data2.TodayShipped;
          this.orderShippedPercent = data2.percent;
        }, error2 => {
          console.log('----Error----->>>>>', error2);
        })
      }, error => {
        console.log('----Error----->>>>', error);
      })
    } else {
      this.dashboardService.get_orderShipped().subscribe(
        data => {
          console.log('--------orderShipped---->>>>', data);
          this.orderShipped = data.TodayShippedOrder;
          this.dashboardService.get_orderShippedToday().subscribe(
            data2 => {
              console.log('--------orderShippedToday---->>>>', data2);
              this.orderShippedToday = data2.TodayShipped;
              this.orderShippedPercent = data2.percent;
              // const percent = (this.orderShippedToday / this.orderShipped) * 100;
              // if (percent.toString() === 'NaN') {
              //   this.orderShippedPercent = 0;
              // } else { console.log('percent 2-------->', percent); this.orderShippedPercent = Math.round(percent); }
            }
          );
        }
      );
    }
  }

  onTime() {
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.dashboardService.get_ordersOnTimeOrg(this.companycode).subscribe(data => {
        console.log('--------ontime---->>>>', data);
          this.orderOnTimeToday = data.onTime;
          if (data.percent !== null){
          this.orderOnTimePercent = data.percent.toFixed(2);  
        }
      }, error => {
        console.log('----Error--------->>>>', error);
      })
    } else {
      this.dashboardService.get_ordersOnTime().subscribe(
        data => {
          console.log('--------ontime---->>>>', data);
          this.orderOnTimeToday = data.onTime;
          this.orderOnTimePercent = data.percent.toFixed(2);
        }
      );
    }
  }

  Onselect(event) {
    console.log('---------------------', event);
    this.navCtrl.push(TicketDetailsComponent, {
      ticketUuid: event.uuid
    })
  }

}
