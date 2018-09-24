import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderFilterComponent } from './orderFilter/orderFilterComponent';
import { OrderDetailsComponent } from './orderDetails/orderDetailsComponent';

import { OrderService } from './order.service'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-orderComponent',
  templateUrl: 'orderComponent.html',

})

export class OrderComponent implements OnInit {

  public allList: {};
  private searchTerm: any;
  private listOfOrdersToFilter: any[] = [];
  public location: any[] = [];
  public status: any[] = [];
  private filterLocation: any[];
  private filterStatus: any[];
  private filterSort: any;
  private filterTicketNumber: any;
  private componentName;
  private companycode;
  private allorders;
  private item = [];
  private startpage: Number;
  private stoppage: Number;
  constructor(private alertctrl: AlertController, private spinnerservice: Ng4LoadingSpinnerService, public navCtrl: NavController, private orderService: OrderService, private nav: NavParams) {
    if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
      if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
        this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
      }
    }
    for (let i = 0; i < 30; i++) {
      this.item.push(this.item.length);
    }
  }

  searchQuery: string = '';
  items: string[];
  orderslist: any;

  ionViewDidLoad() {

  }

  ngOnInit(): void {
    this.spinnerservice.show();
    console.log('------------Companycode--------', this.companycode);
    this.add_orderslist();
    this.componentName = this.navCtrl.getPrevious().component.name;
  }

  getParamsValue() {
    this.filterLocation = this.nav.get('location');
    this.filterStatus = this.nav.get('status');
    this.filterTicketNumber = this.nav.get('ticketNumber');
    this.filterSort = this.nav.get('sort');
    if (this.filterSort === undefined) {
      this.filterSort = 'OrderDate';
    }
    if (this.filterStatus === undefined) {
      this.filterStatus = [];
    }
    if (this.filterTicketNumber === undefined) {
      this.filterTicketNumber = [];
    }
    // console.log('-------Filterlocation----->>>>>>>>', this.filterLocation);
    // console.log('-------Filterstatus----->>>>>>>>', this.filterStatus);
    // console.log('-------Filterticket-------->>>>', this.filterTicketNumber);
    // console.log('-------Filtersort-------->>>>', this.filterSort);
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.orderService.getDataByCompanyCode(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterLocation, this.filterTicketNumber, this.filterStatus, '', this.companycode).subscribe(
        data => {
          // console.log('-------Filterdata----->>>>>>>>', data);
          this.allorders = data;
          this.orderslist = this.allorders.response;
          this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
          this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
        }, error => {
          console.log('--------Error----->>>>', error);
        });
    } else {
      // console.log('-------Filtersort-------->>>>', this.filterSort);
      this.orderService.getData(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterLocation, this.filterTicketNumber, this.filterStatus, '').subscribe(
        data => {
          console.log('-------Filterdata----->>>>>>>>', data);
          this.allorders = data;
          this.orderslist = this.allorders.response;
          this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
          this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
        },
        error => {
          console.log('--------Error----->>>>', error);
        });
    }
    // if (this.filterStatus === undefined) {
    //   this.filterStatus = []
    // }
    // if (this.filterLocation === undefined) {
    //   this.filterLocation = []
    // }

    // this.filterSort = this.nav.get('sort');
    // console.log('----------------------->>>>>>>>>>>>>', this.componentName);
    // this.filterTicketNumber = this.nav.get('ticketNumber');
    // if (this.componentName === "OrderFilterComponent") {
    //   let filterCount, leastCount;
    //   if (this.filterLocation.length > this.filterStatus.length) {
    //     filterCount = this.filterLocation.length;
    //     leastCount = this.filterStatus.length;
    //   }
    //   else {
    //     filterCount = this.filterStatus.length;
    //     leastCount = this.filterLocation.length;
    //   }
    //   let filteredValue = this.listOfOrdersToFilter.filter((item) => {
    //     if (filterCount !== 0) {
    //       for (let i = 0; i < filterCount; i++) {
    //         for (let j = 0; j < filterCount; j++) {
    //           if (((item.CompanyCode.indexOf(this.filterLocation[i]) > -1) || (this.filterLocation.length === 0)) &&
    //             ((item.StatusName.indexOf(this.filterStatus[j]) > -1) || (this.filterStatus.length === 0)) &&
    //             ((item.tickets <= this.filterTicketNumber) || (this.filterTicketNumber === undefined))) {
    //             return true;
    //           }
    //         }
    //       }
    //     }
    //     else {
    //       if (item.tickets <= this.filterTicketNumber) {
    //         return true;
    //       }
    //     }
    //   })

    //   if (filteredValue.length === 0) {
    //     filteredValue = this.listOfOrdersToFilter;
    //   }
    //   if (this.filterSort !== undefined) {
    //     if (this.filterSort === "status") {
    //       filteredValue.sort(function (a, b) {
    //         return (a.StatusName.toLowerCase() > b.StatusName.toLowerCase()) ? 1 : ((b.StatusName.toLowerCase() > a.StatusName.toLowerCase()) ? -1 : 0);
    //       });
    //     }
    //     else if (this.filterSort === "tickets") {
    //       filteredValue.sort(function (a, b) {
    //         return (a.tickets > b.tickets) ? 1 : ((b.tickets > a.tickets) ? -1 : 0);
    //       });
    //     }
    //     else if (this.filterSort === "location") {
    //       filteredValue.sort(function (a, b) {
    //         if (a.CompanyCode !== null) {
    //           return (a.CompanyCode.toLowerCase() > b.CompanyCode.toLowerCase()) ? 1 : ((b.CompanyCode.toLowerCase() > a.CompanyCode.toLowerCase()) ? -1 : 0);
    //         }
    //       });
    //     }
    //     else if (this.filterSort === "date") {
    //       filteredValue.sort(function (a, b) {
    //         return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
    //       });
    //     }
    //     else if (this.filterSort === "ASC") {
    //       filteredValue.sort(function (a, b) {
    //         return a.tickets - b.tickets;

    //       });
    //     }
    //     else if (this.filterSort === "DESC") {
    //       filteredValue.sort(function (a, b) {
    //         return b.tickets - a.tickets;

    //       });
    //     }
    //   }
    //   this.orderslist = filteredValue;

    // }
    // else {
    //   this.orderslist = this.listOfOrdersToFilter
    // }
  }

  filterOrder() {
    console.log('-------location-------', this.location);
    this.navCtrl.push(OrderFilterComponent, {
      location: this.location,
      status: this.status
    });
  }

  displayOrderDetails(order) {
    // console.log("----> order details--> ", order);
    this.navCtrl.push(OrderDetailsComponent, {
      orderDetails: order
    });
  }

  add_orderslist() {
    this.startpage = 0;
    this.stoppage = 25;
    this.location = [];
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.orderService.getDataByCompanyCode(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '', this.companycode).subscribe
        (data => {
          this.allorders = data;
          if (this.allorders === 'There is no Order') {
            let alert = this.alertctrl.create({
              message: 'No data in Salesorder',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Dismiss Clicked')
                  }
                },
              ]
            });
            alert.present();
          } else {
            this.orderslist = this.allorders.response;
            this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
            this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
            console.log('-------Orders----->>>>', this.orderslist);
          }
        }, error => {
          console.log('------Error--->>>', error);
        })
      // this.getParamsValue();
    } else {
      this.orderService.getData(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '').subscribe
        (data => {
          this.allorders = data;
          if (this.allorders === 'There is no Order') {
            let alert = this.alertctrl.create({
              message: 'No data in Salesorder',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Dismiss Clicked')
                  }
                },
              ]
            });
            alert.present();
          } else {
            this.orderslist = this.allorders.response;
            this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
            this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
            console.log('-------Orders----->>>>', this.orderslist);
          }
        }, error => {
          console.log('------Error--->>>', error);
        })
      // this.getParamsValue();
    }
    // if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
    //   this.orderService.getallOrdersByOrg(this.companycode).subscribe(data => {
    //     this.spinnerservice.hide();
    //     console.log('data--order----->', data);
    //     this.listOfOrdersToFilter = data;
    //     // this.orderslist = data
    //     this.getParamsValue();
    //     for (let i = 0; i < data.length; i++) {
    //       if (this.location.indexOf(data[i].CompanyCode) > -1) {
    //       }
    //       else {
    //         this.location.push(data[i].CompanyCode)
    //       }
    //       if (this.status.indexOf(data[i].StatusName) > -1) {
    //       }
    //       else {
    //         this.status.push(data[i].StatusName)
    //       }
    //     }
    //   }, error => {
    //     this.spinnerservice.hide();
    //     console.log('error------->', error);
    //   });
    // } else {
    //   this.orderService.getallOrders()
    //     .subscribe(data => {
    //       this.spinnerservice.hide();
    //       console.log('data--order----->', data);
    //       this.listOfOrdersToFilter = data;
    //       // this.orderslist = data
    //       this.getParamsValue();
    //       for (let i = 0; i < data.length; i++) {
    //         if (this.location.indexOf(data[i].CompanyCode) > -1) {
    //         }
    //         else {
    //           this.location.push(data[i].CompanyCode)
    //         }
    //         if (this.status.indexOf(data[i].StatusName) > -1) {
    //         }
    //         else {
    //           this.status.push(data[i].StatusName)
    //         }
    //       }
    //     },
    //       error => {
    //         this.spinnerservice.hide();
    //         console.log('error------->', error);
    //       });
    // }
  }
  doInfinite() {
    this.stoppage = Number(this.stoppage) + Number(this.stoppage);
    // console.log('Startpage------->>>>',this.startpage);
    // console.log('Stoppage-------->>>>',this.stoppage);
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.orderService.getDataByCompanyCode(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '', this.companycode).subscribe
        (data => {
          this.allorders = data;
          this.orderslist = this.allorders.response;
          this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
          this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
        }, error => {
          console.log('------Error--->>>', error);
        })
    } else {
      this.orderService.getData(this.startpage, this.stoppage, 'OrderDate', 'desc', '', '', '', '', '').subscribe(data => {
        this.allorders = data;
        this.orderslist = this.allorders.response;
        this.location = Array.from(new Set(this.orderslist.map((customerArray => customerArray.CompanyCode))));
        this.status = Array.from(new Set(this.orderslist.map((customerArray => customerArray.StatusName))));
        // console.log('-------Orders----->>>>', this.orderslist);
      }, error => {
        // infiniteScroll.complete();
        console.log('------Error--->>>', error);
      })
      // infiniteScroll.complete();

    }

  }



  setFilteredItems() {
    console.log('-------Search  ----->>>>', this.searchTerm);
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.orderService.getDataByCompanyCode(this.startpage, this.stoppage, 'OrderDate', 'desc', this.searchTerm, '', '', '', '', this.companycode).subscribe
        (data => {
          console.log('-------Orders----->>>>', data);
          this.allorders = data;
          this.orderslist = this.allorders.response;
        }, error => {
          console.log('--------Error-->>>>>', error);
        })
    } else {
      this.orderService.getData(this.startpage, this.stoppage, 'OrderDate', 'desc', this.searchTerm, '', '', '', '').subscribe(data => {
        console.log('-------Orders----->>>>', data);
        this.allorders = data;
        this.orderslist = this.allorders.response;
      }, error => {
        console.log('--------Error-->>>>>', error);
      })
    }
    // const filteredValue = this.filterItems(this.listOfOrdersToFilter, this.searchTerm);
    // // const filteredValue2 = this.PofilterItems(this.listOfOrdersToFilter, this.searchTerm);
    // if (filteredValue === false) {
    //   this.orderslist = this.listOfOrdersToFilter;
    // } else {
    //   this.orderslist = filteredValue;
    // }
  }
  filterItems(items, searchTerm) {
    if (searchTerm === '') {
      return false;
    }
    else {
      return items.filter((item) => {
        if (item.CompanyCode !== null) {
          if (item.CompanyCode.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.PONumber !== null) {
          if (item.PONumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.OrderDate !== null) {
          if (item.OrderDate.indexOf(searchTerm) > -1) {
            return true;
          }
        }
        if (item.Tickets !== null) {
          if (item.Tickets.toString().indexOf(searchTerm.toString()) > -1) {
            return true;
          }
        }
        if (item.OrderNumber !== null) {
          if (item.OrderNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.uuid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          item.StatusName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
  }
  doRefresh(refresher) {
    this.add_orderslist();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  // getItems(ev: any) {
  //   this.orderslist = this.allOrderssToFilter

  //   let val = ev.target.value;

  //   if (val && val.trim() != '') {
  //     this.orderslist = Object(this.orderslist).filter((item) => {
  //       return (item.location.toLowerCase().search(val.toLowerCase()) > -1);
  //     })
  //   }
  // }
}
