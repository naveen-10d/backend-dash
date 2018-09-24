import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PurchaseOrderDetailsComponent } from './purchaseOrderDetails/purchaseOrderDetails.component';
import { PurchaseOrderFilterComponent } from './purchaseOrderFilter/purchaseOrderFilter.component';
import { PurchaseOrderService } from './purchaseOrder.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-purchaseOrder',
  templateUrl: 'purchaseOrder.html',

})

export class PurchaseOrderComponent implements OnInit {

  public allList: {};
  // searchQuery: string = '';
  // items: string[];
  private orderslist: any;
  private searchTerm: any;
  private allOrderssToFilter: {};
  private listofpurchasefilter: any;
  private purchaseorder: any;
  private vendorsPo: any;
  private companycode;
  private location: any;
  private filterlocation: any[];
  private filtercustomer: any[];
  private filterordertatus: any[];
  private componentName: any;
  private filterSort: any;
  constructor(private alertctrl: AlertController, private spinnerservice: Ng4LoadingSpinnerService, public navCtrl: NavController, private orderService: PurchaseOrderService, private nav: NavParams) {
    if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
      if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
        this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
      }
    }
  }
  ionViewDidLoad() {

  }

  ngOnInit(): void {
    this.spinnerservice.show();
    console.log('--------Companycode------', this.companycode);
    this.getAllOrders();
    // this.add_orderslist();
  }

  getAllOrders() {
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.orderService.getAllPurchaseOrderByOrg(this.companycode).subscribe(data => {
        this.spinnerservice.hide();
        console.log("---purchased order are --->>> ", data);
        this.allOrderssToFilter = data;
        this.purchaseorder = data;
        this.listofpurchasefilter = data;
        if (this.purchaseorder.length === 0) {
          console.log('---------Testting if condition-');
          this.purchaseorder = [];
          let alert = this.alertctrl.create({
            // title: 'Confirm Ticket',
            message: 'There is no Purchase Order',
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
          this.purchaseorder.forEach(element => {
            this.vendorsPo = element.VendorPO
            this.location = element.CompanyCode
          });
        }
        this.orderslist = data;
        console.log('---------------->', this.location);
        this.getparamvalue();
      }, error => {
        this.spinnerservice.hide();
        console.log('-----error------', error)
      });
    } else {
      this.orderService.getAllPurchaseOrdes().subscribe((data) => {
        this.allOrderssToFilter = data;
        this.purchaseorder = data;
        this.listofpurchasefilter = data;
        console.log("---purchased order are --->>> ", this.purchaseorder);
        if (this.purchaseorder.length === 0) {
          console.log('---------Testting if condition-');
          this.purchaseorder = [];
          let alert = this.alertctrl.create({
            // title: 'Confirm Ticket',
            message: 'There is no Purchase Order',
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
          this.purchaseorder.forEach(element => {
            this.vendorsPo = element.VendorPO
            this.location = element.CompanyCode
          });
        }
        this.orderslist = this.purchaseorder;
        console.log('---------------->', this.vendorsPo);
        this.getparamvalue();
      },
        (error) => {
          this.spinnerservice.hide();
          console.log("--error-->>", error);
        });
    }
  }

  filterOrder() {
    console.log('--------->>>>>>', this.location);
    this.navCtrl.push(PurchaseOrderFilterComponent, {
      location: this.location,
      orderStatus: this.vendorsPo.StatusName
    });
  }

  displayOrderDetails(order) {
    console.log("----> order details--> ", order);
    this.navCtrl.push(PurchaseOrderDetailsComponent, {
      orderDetails: order
    });
  }

  doRefresh(refresher) {
    this.getAllOrders();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  setFilteredItems() {

    // const filteredValue = this.dataService.filterItems(this.listOfTicketItems, this.searchTerm);
    const filteredValue = this.filterItems(this.allOrderssToFilter, this.searchTerm);
    console.log("searched ticket are --- ", filteredValue);
    if (filteredValue === false) {
      console.log("entering into filteredd valeus ")
      this.orderslist = this.allOrderssToFilter;
    }
    else {
      console.log("entering into else part")
      this.orderslist = filteredValue;

    }

  }

  filterItems(items, searchTerm) {
    if (searchTerm === '') {
      return false;
    }
    else {
      return items.filter((item) => {
        console.log("entering into -item ---- ", item)
        if (item.CompanyCode !== null) {
          if (item.CompanyCode.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        } if (item.SalesOrder.ForecastFinish !== undefined) {
          if (item.SalesOrder.ForecastFinish.indexOf(searchTerm) > -1) {
            return true;
          }
        } if (item.VendorPO.FinishDate !== null) {
          if (item.VendorPO.FinishDate.indexOf(searchTerm) > -1) {
            return true;
          }
        } if (item.SalesOrder.Tickets !== undefined) {
          if (item.SalesOrder.Tickets.toString().indexOf(searchTerm.toString()) > -1) {
            return true;
          }
        }
        if (item.uuid.indexOf(searchTerm) > -1 ||
          item.VendorPO.StatusName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
  }


  getparamvalue() {
    this.filterlocation = this.nav.get('location')
    this.filtercustomer = this.nav.get('customer');
    this.filterordertatus = this.nav.get('orderStatus');
    this.componentName = this.nav.get('componentname');
    if (this.filterordertatus === undefined) {
      this.filterordertatus = []
    }
    if (this.filtercustomer === undefined) {
      this.filtercustomer = []
    }
    if (this.filterlocation === undefined) {
      this.filterlocation = []
    }

    this.filterSort = this.nav.get('sort');
    if (this.componentName === "PurchaseorderFilter") {
      let filterCount, leastCount;
      if (this.filterlocation.length > this.filterordertatus.length) {
        filterCount = this.filterlocation.length;
        leastCount = this.filterordertatus.length;
      } else {
        filterCount = this.filterordertatus.length;
        leastCount = this.filterlocation.length;
      }
      let filteredValue = this.listofpurchasefilter.filter((item) => {
        if (filterCount !== 0) {
          for (let i = 0; i < filterCount; i++) {
            for (let j = 0; j < filterCount; j++) {
              if (((item.CompanyCode.indexOf(this.filterlocation[i]) > -1) || (this.filterlocation.length === 0)) &&
                ((item.VendorPO.StatusName.indexOf(this.filterordertatus[j]) > -1) || (this.filterordertatus.length === 0))) {
                return true;
              }
            }
          }
        } else {
          console.log('-------Nothing is called here--------');
        }
      })
      console.log('-------filtervalue-------------', filteredValue);
      if (filteredValue.length === 0) {
        filteredValue = this.listofpurchasefilter;
      }
      if (this.filterSort != undefined) {
        if (this.filterSort === "status") {
          filteredValue.sort(function (a, b) {
            return (a.VendorPO.StatusName.toLowerCase() > b.VendorPO.StatusName.toLowerCase()) ? 1 : ((b.VendorPO.StatusName.toLowerCase() > a.VendorPO.StatusName.toLowerCase()) ? -1 : 0);
          });
        } else if (this.filterSort === "date") {
          filteredValue.sort(function (a, b) {
            return (a.OrderDate > b.OrderDate) ? 1 : ((b.OrderDate > a.OrderDate) ? -1 : 0);
          });
        } else if (this.filterSort === "location") {
          filteredValue.sort(function (a, b) {
            if (a.CompanyCode !== null) {
              return (a.CompanyCode.toLowerCase() > b.CompanyCode.toLowerCase()) ? 1 : ((b.CompanyCode.toLowerCase() > a.CompanyCode.toLowerCase()) ? -1 : 0);
            }
          });
        }
      }
      this.purchaseorder = filteredValue;
    } else {
      this.purchaseorder = this.listofpurchasefilter;
    }
  }
  // getItems(ev: any) {
  //   this.orderslist = this.allOrderssToFilter

  //   let val = ev.target.value;

  //   if (val && val.trim() != '') {
  //     this.orderslist = Object(this.orderslist).filter((item) => {
  //       return (item.Location.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }
}
