import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TicketDashboardPage } from '../ticketdashboard';
@Component({
    selector: 'page-ticketFilter',
    templateUrl: 'ticketFilter.html'
})

export class TicketFilter implements OnInit {
    constructor(public navCtrl: NavController, private nav: NavParams) {
    }
    private ticketfilter: any;
    private status: any[];
    private ticketassigned: any;
    private assignedto: any[];
    private ticketcreated: any[];
    private Created: any[] = [];
    private Assigned: any[] = [];
    private selectedStatus: any = [];
    private selectedSortValue: String;

    ngOnInit() {
        this.ticketcreated = [];
        this.assignedto =[];
        this.status = [];
        this.ticketfilter = this.nav.get('ticketcreated');
        this.status = this.nav.get('ticketstatus');
        this.ticketassigned = this.nav.get('ticketassigned');
        this.ticketassigned.forEach(element => {
            element.forEach(assigneduser => {
                this.assignedto.push(assigneduser) 
            });
        });
        // console.log('------ticketfilter-------', this.assignedto);
        this.ticketcreated = Array.from(new Set(this.ticketfilter.map((customerArray => customerArray.firstname))));
        this.assignedto = Array.from(new Set(this.assignedto.map((itemArray => itemArray.firstname))));
        console.log('--------ticket-------', this.assignedto);
    }

    selectedoption() {
        this.navCtrl.setRoot(TicketDashboardPage,{
          createdby: this.Created,
          status: this.selectedStatus,
          sort: this.selectedSortValue,
          assigned: this.Assigned,
          componentname: 'TicketFilter'
        })
       // console.log("selected option are ----", this.Created, " ", this.selectedStatus, " ", this.selectedSortValue, " ", this.Assigned);
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