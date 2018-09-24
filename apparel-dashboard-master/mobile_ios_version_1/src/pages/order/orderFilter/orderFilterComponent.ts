import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { OrderComponent } from '../OrderComponent';

@Component({
  selector: 'page-orderFilter',
  templateUrl: 'orderFilter.html',

})

export class OrderFilterComponent implements OnInit {

  private location: any[];
  private status: any[];
  private selectedLocation: any[] = [];
  private selectedStatus: any = [];
  private selectedSortValue: String;
  private ticketNumber: Number;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private nav: NavParams) {
  }

  ngOnInit(): void {
    this.getParamsValue()

  }

  addService(test) {
    console.log("$$$$$$",test)
  }

  statusCheckBox(index){
    if(this.selectedStatus.indexOf(index) > -1){
      this.selectedStatus.slice(this.selectedStatus.indexOf(index), 1)
    } else {
      this.selectedStatus.push(index);
    }
    console.log("----< index ---> ", index)
  }

  getParamsValue() {
    this.location = this.nav.get('location');
    this.location = this.location.filter((obj) => obj !== null && obj.length > 0);
    this.status = this.nav.get('status');
    console.log("location and status are ----- ", this.location, "  ", this.status);
  }
  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  selectedoption() {
    this.navCtrl.setRoot(OrderComponent,{
      location: this.selectedLocation,
      status: this.selectedStatus,
      sort: this.selectedSortValue,
      ticketNumber: this.ticketNumber
    })
    console.log("selected option are ----", this.selectedLocation, " ", this.selectedStatus," ",this.selectedSortValue," ",this.ticketNumber);
  }
  getValue(value) {
    if(this.selectedStatus.indexOf(value) > -1){
      this.selectedStatus.splice(this.selectedStatus.indexOf(value),1)
    }
    else{
      this.selectedStatus.push(value);
    }
    console.log("value are checkbox ----- ",this.selectedStatus);
    
  }
}