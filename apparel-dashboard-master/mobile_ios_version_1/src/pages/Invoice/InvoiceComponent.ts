import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InvoiceService } from './Invoice.service';
import { InvoiceFilter } from '../Invoice/InvoiceFilter/InvoiceFilter.Component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-InvoiceComponent',
    templateUrl: 'InvoiceComponent.html',
})

export class InvoiceComponent implements OnInit {

    constructor(private alertctrl: AlertController, private spinnerservice: Ng4LoadingSpinnerService, public navCtrl: NavController, private nav: NavParams, private invoiceservice: InvoiceService) {
        if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
            if (JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode !== null) {
                this.companycode = JSON.parse(localStorage.getItem('currentuser')).user.organization.PolypmCompanyCode;
            }
        }

    }

    private invoicedetails: any;
    private salesorder: any[] = [];
    private expandindex: any;
    private items: any;
    private invoiceitems: any;
    private searchTerm: any;
    private invoice: any;
    private salesorderstatus: any[];
    ShipmentId: any[];
    OrderID: any[];
    private filterorderid: any[];
    private filterSort: any;
    private filterStatus: any[];
    private componentName;
    private filterInvnumber: any[];
    private listOfInvoiceItems: any;
    private companycode;
    private startpage: Number;
    private stoppage: Number;
    private allinvoice: any;
    ngOnInit() {
        this.spinnerservice.show();
        this.getInvoice();
    }

    getInvoice() {
        this.salesorder = [];
        this.salesorderstatus = [];
        this.ShipmentId = [];
        this.OrderID = [];
        this.startpage = 0;
        this.stoppage = 25;
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.invoiceservice.getDataByCompanyCode(this.startpage, this.stoppage, 'InvoiceNumber', 'desc', '', '', '', this.companycode).subscribe(data => {
                this.spinnerservice.hide();
                this.allinvoice = data;
                if (this.allinvoice === 'There is no Invoice') {
                    let alert = this.alertctrl.create({
                        message: 'No data in Invoice',
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
                    this.invoicedetails = this.allinvoice.response;
                    this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                    // this.OrderID = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.OrderID))));
                    this.salesorder.push(this.invoicedetails);
                    this.invoicedetails.forEach(element => {
                        this.salesorderstatus.push(element.SalesOrder.StatusName);
                        this.OrderID.push(element.SalesOrder.OrderID);
                    });
                    this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                    console.log('------test---------', this.salesorderstatus);
                }
            }, error => {
                this.spinnerservice.hide();
                console.log('----------error---------');
            })
            // this.getparamvalue();
        } else {
            this.invoiceservice.getData(this.startpage, this.stoppage, 'InvoiceNumber', 'desc', '', '', '').subscribe(data => {
                this.spinnerservice.hide();
                console.log('------test---------', data);
                this.allinvoice = data;
                if (this.allinvoice === 'There is no Invoice') {
                    let alert = this.alertctrl.create({
                        message: 'No data in Invoice',
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
                    this.invoicedetails = this.allinvoice.response;
                    this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                    // this.OrderID = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.OrderID))));
                    this.salesorder.push(this.invoicedetails);
                    this.invoicedetails.forEach(element => {
                        this.salesorderstatus.push(element.SalesOrder.StatusName);
                        this.OrderID.push(element.SalesOrder.OrderID);
                    });
                    this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                    console.log('------test---------', this.salesorderstatus);
                }
            }, error => {
                this.spinnerservice.hide();
                console.log('---------error-------', error);
            });
            // this.getparamvalue();
        }
    }

    expandrow(row, i) {
        this.items = [];
        console.log('-------row---------', row);
        this.items.push(row);
        this.items.forEach(element => {
            this.invoiceitems = element.InvoiceDetails;
            console.log('------test-------', this.invoiceitems);
        });
        this.showDetails(i);
    }


    showDetails(i) {
        this.expandindex = i;
    }

    hideDetails() {
        this.expandindex = null;
    }

    setFilteredItems() {
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.invoiceservice.getDataByCompanyCode(this.startpage, this.stoppage, 'InvoiceNumber', 'desc', this.searchTerm, '', '', this.companycode).subscribe(data => {
                this.spinnerservice.hide();
                this.allinvoice = data;
                this.invoicedetails = this.allinvoice.response;
                this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                this.salesorder.push(this.invoicedetails);
                this.invoicedetails.forEach(element => {
                    this.salesorderstatus.push(element.SalesOrder.StatusName);
                    this.OrderID.push(element.SalesOrder.OrderID);
                });
                this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                console.log('------test---------', this.salesorderstatus);
            }, error => {
                this.spinnerservice.hide();
                console.log('----------error---------');
            })
        } else {
            this.invoiceservice.getData(this.startpage, this.stoppage, 'InvoiceNumber', 'desc', this.searchTerm, '', '').subscribe(data => {
                this.spinnerservice.hide();
                console.log('------test---------', data);
                this.allinvoice = data;
                this.invoicedetails = this.allinvoice.response;
                this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                this.salesorder.push(this.invoicedetails);
                this.invoicedetails.forEach(element => {
                    this.salesorderstatus.push(element.SalesOrder.StatusName);
                    this.OrderID.push(element.SalesOrder.OrderID);
                });
                this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                console.log('------test---------', this.salesorderstatus);
            }, error => {
                this.spinnerservice.hide();
                console.log('---------error-------', error);
            });
        }
    }

    filterItems(items, searchTerm) {
        if (searchTerm === '') {
            return false;
        }
        else {
            return items.filter((item) => {
                console.log("entering into -item ---- ", item)
                if (item.InvoiceDetails.length.toString().search(searchTerm.toString()) > -1 ||
                    item.TotalPrice.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.OrderID.toString().search(searchTerm) > -1 ||
                    item.InvoiceDate.search(searchTerm) > -1 ||
                    item.InvoiceNumber.toString().search(searchTerm) > -1 ||
                    item.SalesOrder.StatusName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            });
        }
    }
    doRefresh(refresher) {
        this.getInvoice();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    filterInvoice() {
        console.log('----FilterClicked------------', this.OrderID);
        this.navCtrl.push(InvoiceFilter, {
            Invoicenumber: this.ShipmentId,
            orderid: this.OrderID,
            status: this.salesorderstatus
        });
    }
    getparamvalue() {
        this.filterorderid = this.nav.get('orderid');
        this.filterInvnumber = this.nav.get('invoicenumber');
        this.filterStatus = this.nav.get('status');
        this.filterSort = this.nav.get('sort');
        if (this.filterStatus === undefined) {
            this.filterStatus = []
        }
        if (this.filterInvnumber === undefined) {
            this.filterInvnumber = []
        }
        if (this.filterSort === undefined) {
            this.filterSort = 'InvoiceNumber'
        }
        console.log('----------Invnumber------>>>>>', this.filterInvnumber);
        if (this.companycode !== undefined && this.companycode !== 'STAHLS') {
            this.invoiceservice.getDataByCompanyCode(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterInvnumber, this.filterStatus, this.companycode).subscribe(data => {
                this.allinvoice = data;
                this.invoicedetails = this.allinvoice.response;
                this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                this.salesorder.push(this.invoicedetails);
                this.invoicedetails.forEach(element => {
                    this.salesorderstatus.push(element.SalesOrder.StatusName);
                    this.OrderID.push(element.SalesOrder.OrderID);
                });
                this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                console.log('------test---------', this.salesorderstatus);
            }, error => {
                console.log('----------error---------', error);
            })
        } else {
            this.invoiceservice.getData(this.startpage, this.stoppage, this.filterSort, 'desc', '', this.filterInvnumber, this.filterStatus).subscribe(data => {
                console.log('------test---------', data);
                this.allinvoice = data;
                this.invoicedetails = this.allinvoice.response;
                this.ShipmentId = Array.from(new Set(this.invoicedetails.map((customerArray => customerArray.ShipmentID))));
                this.salesorder.push(this.invoicedetails);
                this.invoicedetails.forEach(element => {
                    this.salesorderstatus.push(element.SalesOrder.StatusName);
                    this.OrderID.push(element.SalesOrder.OrderID);
                });
                this.salesorderstatus = Array.from(new Set(this.salesorderstatus));
                console.log('------test---------', this.salesorderstatus);
            }, error => {
                console.log('---------error-------', error);
            });
        }

        // if (this.componentName === "InvoiceFilter") {
        //     let filterCount, leastCount;
        //     if (this.filterInvnumber.length > this.filterStatus.length) {
        //         filterCount = this.filterInvnumber.length;
        //         leastCount = this.filterStatus.length;
        //     } else {
        //         filterCount = this.filterStatus.length;
        //         leastCount = this.filterInvnumber.length;
        //     }
        //     let filteredValue = this.listOfInvoiceItems.filter((item) => {
        //         if (filterCount !== 0) {
        //             for (let i = 0; i < filterCount; i++) {
        //                 for (let j = 0; j < filterCount; j++) {
        //                     if (((item.SalesOrder.StatusName.indexOf(this.filterStatus[i]) > -1) || (this.filterStatus.length === 0)) &&
        //                         ((item.InvoiceNumber.indexOf(this.filterInvnumber[j] > -1 || (this.filterInvnumber.length === 0)))) &&
        //                         ((item.OrderID <= this.filterorderid) || (this.filterorderid.length === 0))) {
        //                         return true;
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             if (item.OrderID <= this.filterorderid) {
        //                 return true;
        //             }
        //         }
        //     })
        //     if (filteredValue.length === 0) {
        //         filteredValue = this.listOfInvoiceItems;
        //     }
        //     if (this.filterSort != undefined) {
        //         if (this.filterSort === "status") {
        //             filteredValue.sort(function (a, b) {
        //                 return (a.SalesOrder.StatusName.toLowerCase() > b.SalesOrder.StatusName.toLowerCase()) ? 1 : ((b.SalesOrder.StatusName.toLowerCase() > a.SalesOrder.StatusName.toLowerCase()) ? -1 : 0);
        //             });
        //         }
        //         else if (this.filterSort === "date") {
        //             filteredValue.sort(function (a, b) {
        //                 return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0);
        //             });
        //         }

        //     }
        //     this.invoicedetails = filteredValue;
        // }
        // else {
        //     this.invoicedetails = this.listOfInvoiceItems;
        // }
    }



}