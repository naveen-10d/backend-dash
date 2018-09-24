import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShipmentService } from '../shipment.service';
import { PackedBoxitems } from '../PackedBoxitems/PackedBoxitems.component'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'page-PackedBox',
    templateUrl: 'PackedBox.html',

})

export class PackedBox implements OnInit {

    constructor(private spinnerservice: Ng4LoadingSpinnerService,public navCtrl: NavController, private navParams: NavParams, private shipmentService: ShipmentService) {
    }
    private packedbox: any;
    private packedboxdetail: any;
    private packedboxsummary: any;
    private searchTerm: any;
    ngOnInit(): void {
        this.spinnerservice.show();
        this.packedbox = this.navParams.get('packedbox');
        console.log('------packedbox---------', this.packedbox.ShipmentID);
        this.getpackedbox();
    }

    getpackedbox() {
        this.shipmentService.getshipmentbyid(this.packedbox.ShipmentID).subscribe(data => {
            this.spinnerservice.hide();
            this.packedboxdetail = data.PackedBoxes;
            this.packedboxsummary = data.PackedBoxes;
            console.log('------packedboxdetail----------', this.packedboxdetail);
        }, error => {
            this.spinnerservice.hide();
            console.log('----error------', error);
        })
    }
    displaypackeditems(row) {
        this.navCtrl.push(PackedBoxitems, { packeditems: row });
    }
    setFilteredItems() {
        const filteredValue = this.filterItems(this.packedboxdetail, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ")
            this.packedboxsummary = this.packedboxdetail;
        }
        else {
            console.log("entering into else part")
            this.packedboxsummary = filteredValue;

        }
    }
    filterItems(items, searchTerm) {
        if (searchTerm === '') {
            return false;
        } else {
            return items.filter((item) => {
                console.log("entering into -item ---- ", item)
                if (item.PackedBoxID.toString().search(searchTerm.toString()) > -1 ||
                    item.BoxCode.toString().search(searchTerm.toString()) > -1 ||
                    item.BoxNumber.toString().search(searchTerm.toString()) > -1 ||
                    item.ShipmentID.toString().search(searchTerm.toString()) > -1 ||
                    item.PackedUnits.toString().search(searchTerm.toString()) > -1) {
                    return true;
                }
                return false;
            });
        }
    }
    doRefresh(refresher) {
        this.getpackedbox();
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

}
