import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { ShipmentComponent } from '../shipment.component';
@Component({
    selector: 'page-ShipmentFilter',
    templateUrl: 'ShipmentFilter.html',

})

export class ShipmentFilterComponent implements OnInit {
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, private nav: NavParams) {
    }
    private name: any [];
    private ponumber :any;
    private location: any[];
    private selectedLocation: any[]=[];
    private selectedStyle: any []=[];
    private selectedSortValue: String;

    ngOnInit() {
        this.ponumber =[];
        this.location =[];
        this.name = this.nav.get('shipmentname');
        this.name.forEach(element=>{
            this.ponumber = element;
            // console.log('------Element--->>>>',element);
        })
        // this.ponumber = this.name;
        console.log('------>>>>>>>>>>', this.ponumber);
        this.location.push(this.nav.get('location'));
    }
    selectedoption() {
        this.navCtrl.setRoot(ShipmentComponent,{
          location: this.selectedLocation,
          style: this.selectedStyle,
          sort: this.selectedSortValue,
          component: "ShipmentFilter"
        })
        console.log("selected option are ----", this.selectedLocation, " ", this.selectedStyle," ",this.selectedSortValue);
      }
    
}