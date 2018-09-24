import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShipmentService } from '../shipment.service';
import { PackedBox } from '../PackedBox/PackedBox.component';
import { PackedBoxitems} from '../PackedBoxitems/PackedBoxitems.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'page-shipmentitems',
    templateUrl: 'shipmentitems.html',

})

export class ShipmentItemsComponent implements OnInit {

    constructor(private spinnerservice: Ng4LoadingSpinnerService,public navCtrl: NavController, private navParams: NavParams, private shipmentService: ShipmentService) {
    }
    private shipmentitems: any;
    private itemdetails: any;
    private searchTerm: any;
    private shipitem: any;
    ngOnInit(): void {
        this.spinnerservice.show();
        this.shipmentitems = this.navParams.get('shipmentitems');
        console.log('--------shipment------', this.shipmentitems.ShipmentID);
        this.getshipmentitems();
    }
    getshipmentitems() {
        this.shipmentService.getshipmentbyid(this.shipmentitems.ShipmentID).subscribe(data => {
            this.spinnerservice.hide();
            this.itemdetails = data.ShipmentsItems;
            this.shipitem = data.ShipmentsItems;
            console.log('-------data---------', this.itemdetails);
        }, error => {
            this.spinnerservice.hide();
            console.log('---error-------', error);
        })
    }
    displaypackedbox(row) {
        this.navCtrl.push(PackedBoxitems, { packeditems: row });
    }
    setFilteredItems() {
        const filteredValue = this.filterItems(this.itemdetails, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ")
            this.shipitem = this.itemdetails;
        }
        else {
            console.log("entering into else part")
            this.shipitem = filteredValue;

        }

    }
    filterItems(items, searchTerm) {
        if (searchTerm === '') {
            return false;
        } else {
            return items.filter((item) => {
                console.log("entering into -item ---- ", item)
                if (item.StyleOption !== null) {
                    if (item.ShipNumber.toString().search(searchTerm.toString()) > -1 ||
                        item.StyleNumber.toString().search(searchTerm.toString()) > -1 ||
                        item.StyleColor.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                        item.StyleOption.toString().search(searchTerm.toString()) > -1 ||
                        item.GarmentSize.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                        item.Quantity.search(searchTerm) > -1) {
                        return true;
                    }
                }
                return false;
            });
        }
    }
    doRefresh(refresher) {
        this.getshipmentitems();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

}