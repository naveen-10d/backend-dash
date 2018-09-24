import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShipmentService } from '../shipment.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'page-PackedBoxitems',
    templateUrl: 'PackedBoxitems.html',

})

export class PackedBoxitems implements OnInit {

    constructor(private spinnerservice: Ng4LoadingSpinnerService,public navCtrl: NavController, private navParams: NavParams, private shipmentService: ShipmentService) {
    }
    private packeditems: any;
    private packedboxitem: any;
    private items: any;
    private searchTerm: any;
    ngOnInit(): void {
        this.spinnerservice.show();
        this.packeditems = this.navParams.get('packeditems');
        console.log('-----packeditems--------', this.packeditems.ShipmentID);
        this.getpackeditems();
    }
    getpackeditems() {

        this.shipmentService.getPackedItemByShipmentId(this.packeditems.ShipmentID).subscribe(data => {
            this.spinnerservice.hide();
            this.items = data.PackedItems;
            this.packedboxitem = data.PackedItems;
            console.log('--------packeditems-----------', this.items);
        }, error => {
            this.spinnerservice.hide();
            console.log('--------error----------', error);
        })

    }
    setFilteredItems() {
        const filteredValue = this.filterItems(this.items, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ")
            this.packedboxitem = this.items;
        }
        else {
            console.log("entering into else part")
            this.packedboxitem = filteredValue;

        }
    }
    filterItems(items, searchTerm) {
        if (searchTerm === '') {
            return false;
        } else {
            return items.filter((item) => {
                console.log("entering into -item ---- ", item)
                if (item.PackedBoxID.toString().search(searchTerm.toString()) > -1 ||
                    item.StyleNumber.toString().search(searchTerm.toString()) > -1 ||
                    item.StyleColor.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.StyleOption.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.GarmentSize.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.Quantity.search(searchTerm) > -1 ||
                    item.BoxCode.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.PackedBoxID.toLowerCase().search(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            });
        }
    }
    doRefresh(refresher) {
        this.getpackeditems();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

}