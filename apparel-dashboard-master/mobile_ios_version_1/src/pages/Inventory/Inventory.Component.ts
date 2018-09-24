import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InventoryService } from './Inventory.service';
import { InventoryFilterComponent } from './InventoryFilter/InventoryFilter.Component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Content } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-InventoryComponent',
  templateUrl: 'Inventory.html',
})

export class InventoryComponent implements OnInit {

  @ViewChild(Content) content: Content;
  constructor(private alertctrl: AlertController, private spinnerservice: Ng4LoadingSpinnerService, public navCtrl: NavController, private nav: NavParams, private inventoryservice: InventoryService) {
    if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
      if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
        this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
      }
    }
  }
  private inventoryitems: any[];
  private inventorysearch: any;
  private items: any[] = [];
  private inventory: any;
  private expandindex: any;
  private searchTerm: any;
  description: any[];
  color: any[];
  size: any[];
  status: any[];
  private filterdescription: any[];
  private filtercolor: any[];
  private filterstatus: any[];
  private filtersize: any[];
  private filtersort: any;
  private listOfInventoryItems: any;
  private componentName;
  private companycode;
  private startpage: Number;
  private stoppage: Number;
  private allinventory: any;

  ngOnInit() {
    this.spinnerservice.show();
    console.log('------------Companycode---------', this.companycode);
    this.getInventory();
  }
  getInventory() {
    this.description = [];
    this.color = [];
    this.size = [];
    this.startpage = 0;
    this.stoppage = 25;
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.inventoryservice.getDataByCompanyCode(this.startpage, this.stoppage, 'StyleNumber', 'desc', '', '', '', '', this.companycode).subscribe(data => {
        this.spinnerservice.hide();
        this.allinventory = data;
        if (this.allinventory === 'There is no Inventory') {
          let alert = this.alertctrl.create({
            message: 'No data in Inventory',
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
          this.inventory = this.allinventory.response;
          this.inventorysearch = this.allinventory.response;
          console.log('------test-------', this.inventory);
          this.listOfInventoryItems = this.allinventory.response;
          this.description = Array.from(new Set(this.inventory.map((customerArray => customerArray.StyleNumber))));
          this.color = Array.from(new Set(this.inventory.map((customerArray => customerArray.StyleColor))));
          this.size = Array.from(new Set(this.inventory.map((customerArray => customerArray.GarmentSize))));
          this.status = Array.from(new Set(this.inventory.map((customerArray => customerArray.StatusName))));
          this.inventory.forEach(element => {
            this.inventoryitems = element.FinishedGoodsAdjustments;
            console.log('------test1234567-------', this.description);
          });
        }
        // this.getparamvalue();
      }, error => {
        this.spinnerservice.hide();
        console.log('--------error---------', error);
      });
    } else {
      this.inventoryservice.getData(this.startpage, this.stoppage, 'StyleNumber', 'desc', '', '', '', '', '').subscribe(data => {
        this.spinnerservice.hide();
        this.allinventory = data;
        if (this.allinventory === 'There is no Inventory') {
          let alert = this.alertctrl.create({
            message: 'No data in Inventory',
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
          this.inventory = this.allinventory.response;
          this.inventorysearch = this.allinventory.response;
          console.log('------test-------', this.inventory);
          this.listOfInventoryItems = this.allinventory.response;
          this.description = Array.from(new Set(this.inventory.map((customerArray => customerArray.StyleNumber))));
          this.color = Array.from(new Set(this.inventory.map((customerArray => customerArray.StyleColor))));
          this.size = Array.from(new Set(this.inventory.map((customerArray => customerArray.GarmentSize))));
          this.status = Array.from(new Set(this.inventory.map((customerArray => customerArray.StatusName))));
          this.inventory.forEach(element => {
            this.inventoryitems = element.FinishedGoodsAdjustments;
            // console.log('------test1234567-------', this.description);
          });
        }
        // this.getparamvalue();
      }, error => {
        this.spinnerservice.hide();
        console.log('-----error------', error)
      });
    }
  }
  expandrow(row, i) {
    this.items = [];
    console.log('-------row---------', row);
    this.items.push(row);
    this.items.forEach(element => {
      this.inventoryitems = element.FinishedGoodsAdjustments;
      console.log('------test-------', this.inventoryitems);
    });
    this.showDetails(i);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
  scrollToBottom() {
    this.content.scrollToBottom();
    this.doInfinite();
  }

  showDetails(i) {
    this.expandindex = i;
  }

  hideDetails() {
    this.expandindex = null;
  }

  doInfinite() {
    this.stoppage = Number(this.stoppage) + Number(this.stoppage);
    // console.log('Startpage------->>>>',this.startpage);
    // console.log('Stoppage-------->>>>',this.stoppage);
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.inventoryservice.getDataByCompanyCode(this.startpage, this.stoppage, 'StyleNumber', 'desc', '', '', '', '', this.companycode).subscribe(data => {
        this.allinventory = data;
        this.inventory = this.allinventory.response;
        this.inventorysearch = this.allinventory.response;
        console.log('-------InventoryByOrg----->>>>', this.inventory);
      }, error => {
        // infiniteScroll.complete();
        console.log('------Error--->>>', error);
      })
      // infiniteScroll.complete();
    } else {
      this.inventoryservice.getData(this.startpage, this.stoppage, 'StyleNumber', 'desc', '', '', '', '', '').subscribe(data => {
        this.allinventory = data;
        this.inventory = this.allinventory.response;
        this.inventorysearch = this.allinventory.response;
        console.log('-------InventorywithoutOrg----->>>>', this.inventory);
      }, error => {
        console.log('------Error--->>>', error);
      })
    }
  }


  setFilteredItems() {
    console.log('-------Search  ----->>>>', this.searchTerm);
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.inventoryservice.getDataByCompanyCode(this.startpage, this.stoppage, 'StyleNumber', 'desc', this.searchTerm, '', '', '', this.companycode).subscribe
        (data => {
          this.allinventory = data;
          this.inventory = this.allinventory.response;
        }, error => {
          console.log('------Error--->>>', error);
        });
    } else {
      this.inventoryservice.getData(this.startpage, this.stoppage, 'StyleNumber', 'desc', this.searchTerm, '', '', '', '').subscribe(data => {
        this.allinventory = data;
        this.inventory = this.allinventory.response;
        console.log('-------InventorywithoutOrg----->>>>', this.inventory);
      }, error => {
        console.log('------Error--->>>', error);
      })
    }
  }
  // const filteredValue = this.filterItems(this.inventory, this.searchTerm);
  // console.log("searched ticket are --- ", filteredValue);
  // if (filteredValue === false) {
  //   console.log("entering into filteredd valeus ")
  //   this.inventorysearch = this.inventory;
  // }
  // else {
  //   console.log("entering into else part")
  //   this.inventorysearch = filteredValue;

  // }

  filterItems(items, searchTerm) {
    if (searchTerm === '') {
      return false;
    } else {
      return items.filter((item) => {
        console.log("entering into -item ---- ", item)
        if (item.FinishedGoodsID.toString().indexOf(searchTerm.toString()) > -1 ||
          item.StatusName.toString().indexOf(searchTerm.toString()) > -1 ||
          item.Description.toString().indexOf(searchTerm.toString()) > -1 ||
          item.StyleColor.toString().indexOf(searchTerm.toString()) > -1 ||
          item.GarmentSize.toString().indexOf(searchTerm.toString()) > -1) {
          return true;
        }
        return false;
      });
    }


  }
  filterInventory() {
    console.log("---->Filter Clicked ------------ >  ");
    this.navCtrl.push(InventoryFilterComponent, {
      description: this.description,
      size: this.size,
      color: this.color,
      status: this.status
    })
  }

  getparamvalue() {
    this.filterdescription = this.nav.get('description');
    this.filtercolor = this.nav.get('color');
    this.filterstatus = this.nav.get('status');
    this.filtersort = this.nav.get('sort');
    if (this.filterdescription === undefined) {
      this.filterdescription = []
    }
    if (this.filtercolor === undefined) {
      this.filtercolor = []
    }
    if (this.filtersort === undefined) {
      this.filtersort = 'StyleNumber'
    }
    if (this.filterstatus === undefined) {
      this.filterstatus = [];
    }
    if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
      this.inventoryservice.getDataByCompanyCode(this.startpage, this.stoppage, this.filtersort, 'desc', '', this.filterdescription, this.filtercolor, '', this.companycode).subscribe
        (data => {
          this.allinventory = data;
          this.inventory = this.allinventory.response;
        }, error => {
          console.log('------Error--->>>', error);
        });
    } else {
      this.inventoryservice.getData(this.startpage, this.stoppage, this.filtersort, 'desc', '', this.filterdescription, this.filtercolor, this.filterstatus, '').subscribe(data => {
        this.allinventory = data;
        this.inventory = this.allinventory.response;
        console.log('-------InventorywithoutOrg----->>>>', this.inventory);
      }, error => {
        console.log('------Error--->>>', error);
      })
    }

    // if (this.componentName === "InventoryFilter") {
    //   let filterCount, leastCount;
    //   console.log('------lenght-------1', this.filterdescription);
    //   console.log('--------length------2', this.filtercolor);
    //   if (this.filterdescription.length > this.filtercolor.length) {
    //     filterCount = this.filterdescription.length;
    //     leastCount = this.filtercolor.length;
    //     console.log('-------------filter---------->>>>>>>>>', filterCount);
    //   } else {
    //     filterCount = this.filterdescription.length;
    //     leastCount = this.filtercolor.length;
    //   }
    //   let filteredValue = this.listOfInventoryItems.filter((item) => {
    //     console.log('-------filtercount------->>>>>>>>', filterCount);
    //     if (filterCount !== 0) {
    //       for (let i = 0; i < filterCount; i++) {
    //         for (let j = 0; j < filterCount; j++) {
    //           if (((item.Description.indexOf(this.filterdescription[i]) > -1) || (this.filterdescription.length === 0)) &&
    //             ((item.StyleColor.indexOf(this.filtercolor[j]) > -1) || (this.filtercolor.length === 0) ||
    //               (item.StatusName.indexOf(this.filterstatus[j]) > -1) || (this.filterstatus.length === 0))) {
    //             return true;
    //           }
    //         }
    //       }
    //     }
    //     else {
    //       console.log('Nothing');
    //     }
    //   })
    //   if (filteredValue.length === 0) {
    //     filteredValue = this.listOfInventoryItems;
    //   }
    //   if (this.filtersort != undefined) {
    //     if (this.filtersort === "color") {
    //       filteredValue.sort(function (a, b) {
    //         return (a.StyleColor.toLowerCase() > b.StyleColor.toLowerCase()) ? 1 : ((b.StyleColor.toLowerCase() > a.StyleColor.toLowerCase()) ? -1 : 0);
    //       });
    //     }
    //     else if (this.filtersort === "date") {
    //       filteredValue.sort(function (a, b) {
    //         return (a.DataExportDate > b.DataExportDate) ? 1 : ((b.DataExportDate > a.DataExportDate) ? -1 : 0);
    //       });
    //     }

    //   }
    //   this.inventory = filteredValue;
    // }
    // else {
    //   this.inventory = this.listOfInventoryItems;
    // }
  }

  doRefresh(refresher) {
    this.getInventory();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


}
