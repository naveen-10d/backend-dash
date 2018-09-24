import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShipmentService } from './shipment.service';
import { ShipmentItemsComponent } from './shipment items/shipmentitems';
import { ShipmentFilterComponent } from '../shipment/ShipmentFilter/ShipmentFilter.Component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-shipment',
    templateUrl: 'shipment.html',

})

export class ShipmentComponent implements OnInit {

    shipmentList: any = []
    public allshipments: any;
    private shipments: any;
    private shipmentfilter: any[] = [];
    private stylenumber: any;
    private shipmentitems: any;
    private searchTerm: any;
    private shipmentname: any[] = [];
    private location: any[];
    private style: any[] = [];
    private filterLocation: any[];
    private filterPonumber: any[];
    private filterSort: any;
    private listOfShipmentToFilter: any;
    private companycode: any;
    private startpage: Number;
    private stoppage: Number;
    public ponumber: any[] = [];
    constructor(private alertctrl: AlertController, public navCtrl: NavController, private shipmentService: ShipmentService, private nav: NavParams, private spinnerservice: Ng4LoadingSpinnerService) {
        if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
            if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
                this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
            }
        }
    }

    ionViewDidLoad() {

    }

    ngOnInit(): void {
        console.log('-------CompanyCode---------', this.companycode)
        this.spinnerservice.show();
        this.getAllShipment();
    }

    getAllShipment() {
        this.startpage = 0;
        this.stoppage = 25;
        this.shipmentfilter = [];
        this.shipmentname = [];
        this.location = [];
        this.style = [];
        this.ponumber = [];
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.shipmentService.getDataByCompanyCode(this.startpage, this.stoppage, 'PONumber', 'desc', '', '', this.companycode, '', '').subscribe(data => {
                this.spinnerservice.hide();
                this.shipmentList = data;
                if (this.shipmentList === 'There is no Shipments') {
                    let alert = this.alertctrl.create({
                        message: 'No data in Shipments',
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
                    this.allshipments = this.shipmentList.response;
                    this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                    this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                }
            }, error => { console.log('--------------error--------', error) });
            // this.getParamsValue();
        } else {
            this.shipmentService.getData(this.startpage, this.stoppage, 'PONumber', 'desc', '', '', '', '')
                .subscribe(data => {
                    this.spinnerservice.hide();
                    this.shipmentList = data;
                    if (this.shipmentList === 'There is no Shipments') {
                        let alert = this.alertctrl.create({
                            message: 'No data in Shipments',
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
                        this.allshipments = this.shipmentList.response;
                        this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                        this.ponumber.push(this.shipmentname);
                        this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                    }
                },
                    error => {
                        this.spinnerservice.hide();
                        console.log('error------->', error);
                    });
            // this.getParamsValue();

            console.log('------>>>>>>>>>>', this.ponumber);

        }
    }

    displayshipmentitems(row) {
        // console.log('--------row----------', row);
        this.navCtrl.push(ShipmentItemsComponent, { shipmentitems: row });
    }

    setFilteredItems() {
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.shipmentService.getDataByCompanyCode(this.startpage, this.stoppage, 'PONumber', 'desc', this.searchTerm, '', this.companycode, '', '')
                .subscribe(data => {
                    this.shipmentList = data;
                    this.allshipments = this.shipmentList.response;
                    this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                    this.ponumber.push(this.shipmentname);
                    this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                }, error => {
                    console.log('error------->', error);
                })

        } else {
            this.shipmentService.getData(this.startpage, this.stoppage, 'PONumber', 'desc', this.searchTerm, '', '', '')
                .subscribe(data => {
                    this.shipmentList = data;
                    this.allshipments = this.shipmentList.response;
                    this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                    this.ponumber.push(this.shipmentname);
                    this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                }, error => {
                    console.log('error------->', error);
                })

        }
        // const filteredValue = this.filterItems(this.shipmentList, this.searchTerm);
        // console.log("searched ticket are --- ", filteredValue);
        // if (filteredValue === false) {
        //     console.log("entering into filteredd valeus ")
        //     this.shipments = this.shipmentList;
        // }
        // else {
        //     console.log("entering into else part")
        //     this.shipments = filteredValue;

        // }

    }
    filterItems(items, searchTerm) {
        if (searchTerm === '') {
            return false;
        } else {
            return items.filter((item) => {
                item.ShipmentsItems.forEach(element => {
                    this.stylenumber = element.StyleNumber;
                })
                console.log("entering into -item ---- ", item)
                if (item.PONumber.toString().search(searchTerm.toString()) > -1 ||
                    this.stylenumber.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.OrderID.toString().search(searchTerm.toString()) > -1 ||
                    item.CustomerID.toString().search(searchTerm.toString()) > -1 ||
                    item.ShipmentID.toString().search(searchTerm.toString()) > -1 ||
                    item.ShipToName.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.ShipDate.search(searchTerm) > -1 ||
                    item.CompanyCode.search(searchTerm) > -1) {
                    return true;
                }
                return false;
            });
        }


    }

    filterShipment() {
        console.log('FilterClicked---------------', this.ponumber);
        this.navCtrl.push(ShipmentFilterComponent, {
            shipmentname: this.ponumber,
            location: this.location,
        });
    }

    getParamsValue() {
        this.filterLocation = this.nav.get('location');
        this.filterPonumber = this.nav.get('style');
        this.filterSort = this.nav.get('sort');
        // this.componentName = this.nav.get('component');
        if (this.filterPonumber === undefined) {
            this.filterPonumber = []
        }
        if (this.filterLocation === undefined) {
            this.filterLocation = []
        }
        if (this.filterSort === undefined) {
            this.filterSort = 'PONumber'
        }
        console.log('-------Ponumber---->>>>', this.filterPonumber);
        console.log('-------Location---->>>>', this.filterLocation);
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.shipmentService.getDataByCompanyCode(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterPonumber, this.companycode, '', '').subscribe(data => {
                this.shipmentList = data;
                this.allshipments = this.shipmentList.response;
                this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                this.ponumber.push(this.shipmentname);
                this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
            }, error => {
                console.log('-------Error------->>>>', error);
            })

        } else {
            this.shipmentService.getData(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterPonumber, '', '').subscribe(data => {
                this.shipmentList = data;
                this.allshipments = this.shipmentList.response;
                this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                this.ponumber.push(this.shipmentname);
                this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
            }, error => {
                console.log('-----------Error--------->>>>', error);
            });
        }
        // console.log('----------------------->>>>>>>>>>>>>', this.componentName);
        // if (this.componentName === "ShipmentFilter") {
        //     let filterCount, leastCount;
        //     if (this.filterLocation.length > this.filterStyle.length) {
        //         filterCount = this.filterLocation.length;
        //         leastCount = this.filterStyle.length;
        //     }
        //     else {
        //         filterCount = this.filterStyle.length;
        //         leastCount = this.filterLocation.length;
        //     }
        //     let filteredValue = this.listOfShipmentToFilter.filter((item) => {
        //         if (filterCount !== 0) {
        //             for (let i = 0; i < filterCount; i++) {
        //                 for (let j = 0; j < filterCount; j++) {
        //                     if (((item.CompanyCode.indexOf(this.filterLocation[i]) > -1) || (this.filterLocation.length === 0)) &&
        //                         ((item.ShipToName.indexOf(this.filterStyle[j]) > -1) || (this.filterStyle.length === 0))) {
        //                         return true;
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             console.log('Nothing');
        //             // if (item.tickets <= this.filterTicketNumber) {
        //             //     return true;
        //             // }
        //         }
        //     })

        //     if (filteredValue.length === 0) {
        //         filteredValue = this.listOfShipmentToFilter;
        //     }
        //     if (this.filterSort !== undefined) {
        //         if (this.filterSort === "location") {
        //             filteredValue.sort(function (a, b) {
        //                 return (a.CompanyCode.toLowerCase() > b.CompanyCode.toLowerCase()) ? 1 : ((b.CompanyCode.toLowerCase() > a.CompanyCode.toLowerCase()) ? -1 : 0);
        //             });
        //         }
        //         else if (this.filterSort === "date") {
        //             filteredValue.sort(function (a, b) {
        //                 return (a.ShipDate > b.ShipDate) ? 1 : ((b.ShipDate > a.ShipDate) ? -1 : 0);
        //             });
        //         }
        //     }
        //     this.shipmentList = filteredValue;

        // }
        // else {
        //     this.shipmentList = this.listOfShipmentToFilter
        // }
    }
    doRefresh(refresher) {
        this.getAllShipment();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    doInfinite() {
        this.stoppage = Number(this.stoppage) + Number(this.stoppage);
        // console.log('Startpage------->>>>',this.startpage);
        // console.log('Stoppage-------->>>>',this.stoppage);
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.shipmentService.getDataByCompanyCode(this.startpage, this.stoppage, 'PONumber', 'desc', '', '', this.companycode, '', '').subscribe
                (data => {
                    this.shipmentList = data;
                    this.allshipments = this.shipmentList.response;
                    this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                    this.ponumber.push(this.shipmentname);
                    this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                }, error => {
                    console.log('------Error--->>>', error);
                })
        } else {
            this.shipmentService.getData(this.startpage, this.stoppage, 'PONumber', 'desc', '', '', '', '').subscribe(data => {
                // console.log('-------Orders----->>>>', this.orderslist);
                this.shipmentList = data;
                if (this.shipmentList === 'There is no Shipments') {
                    let alert = this.alertctrl.create({
                        message: 'No data in Shipments',
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
                    this.allshipments = this.shipmentList.response;
                    this.shipmentname = Array.from(new Set(this.allshipments.map((customerArray => customerArray.PONumber))));
                    this.ponumber.push(this.shipmentname);
                    this.location = Array.from(new Set(this.allshipments.map((customerArray => customerArray.CompanyCode))));
                }
            }, error => {
                console.log('------Error--->>>', error);
            })

        }
    }

}
