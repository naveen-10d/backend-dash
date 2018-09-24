import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InvoiceComponent } from '../InvoiceComponent';

@Component({
    selector: 'page-InvoiceFilter',
    templateUrl: 'InvoiceFilter.html'
})

export class InvoiceFilter implements OnInit {

    constructor(public navCtrl: NavController, private nav: NavParams) {
    }
    ShipmentId: any [];
    orderid: any [];
    orderstatus: any[];
    private selectedStatus: any = [];
    private selectedSortValue: String;
    private Idnumber: any[] = [];
    private Invnumber: any[] = [];

    ngOnInit(){
        this.ShipmentId = [];
        this.orderid = [];
        this.orderstatus = [];
        this.ShipmentId=this.nav.get('Invoicenumber');
        this.orderid=this.nav.get('orderid');
        console.log('-----orderid------', this.orderid);
        console.log('-----invnumber------', this.ShipmentId);

        this.orderstatus=this.nav.get('status');
    }
    selectedoption() {
        this.navCtrl.setRoot(InvoiceComponent,{
          orderid: this.Idnumber,
          status: this.selectedStatus,
          sort: this.selectedSortValue,
          invoicenumber: this.Invnumber,
          componentname: 'InvoiceFilter'
        })
        console.log("selected option are ----", this.Idnumber, " ", this.selectedStatus, " ", this.selectedSortValue, " ", this.Invnumber);
    }

    getValue(value) {
        if (this.selectedStatus.indexOf(value) > -1) {
            this.selectedStatus.splice(this.selectedStatus.indexOf(value), 1)
        }
        else {
            this.selectedStatus.push(value);
        }
        console.log("value are checkbox ----- ", this.selectedStatus);

    }

}
