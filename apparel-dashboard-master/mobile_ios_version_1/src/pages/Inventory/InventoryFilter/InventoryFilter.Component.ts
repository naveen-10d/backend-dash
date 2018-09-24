import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InventoryComponent } from '../Inventory.Component';
@Component({
    selector: 'page-InventoryFilter',
    templateUrl: 'InventoryFilter.html',
})

export class InventoryFilterComponent implements OnInit {

    constructor(public navCtrl: NavController, private nav: NavParams) {
    }
    private selectedSortValue: String;
    private SelectedDescription: any[] = [];
    private SelectedColor: any[] = [];
    private SelectedSize: any[] = [];
    private SelectedStatus: any[] = [];
    description: any[];
    size: any[];
    color: any[];
    status: any[];
    ngOnInit(){
        // this.description = [];
        // this.color = [];
        // this.size = [];
        this.description = this.nav.get('description');
        this.size = this.nav.get('size');
        this.color = this.nav.get('color');
        this.status = this.nav.get('status');
    }
    selectedoption() {
        this.navCtrl.setRoot(InventoryComponent,{
          description: this.SelectedDescription,
          color: this.SelectedColor,
          sort: this.selectedSortValue,
          size: this.SelectedSize,
          status: this.SelectedStatus,
          componentname: 'InventoryFilter'
        })
        console.log("selected option are ----", this.SelectedDescription, " ", this.SelectedColor, " ", this.selectedSortValue, " ", this.SelectedStatus);
    }

    getValue(value) {
        if (this.SelectedStatus.indexOf(value) > -1) {
            this.SelectedStatus.splice(this.SelectedStatus.indexOf(value), 1)
        }
        else {
            this.SelectedStatus.push(value);
        }
        console.log("value are checkbox ----- ", this.SelectedStatus);

    }

}