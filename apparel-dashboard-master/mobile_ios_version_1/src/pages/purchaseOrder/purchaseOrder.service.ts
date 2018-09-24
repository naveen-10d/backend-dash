import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config/config.service';
import { ApiService } from '../../config/api.service';
import { Constants } from '../../config/Constant';

@Injectable()
export class PurchaseOrderService {
    public selected_id: number;
    constructor(private config: ConfigService, private apiService: ApiService) { }

    getAllPurchaseOrdes(): Observable<any> {
        console.log('____gInventory Services----- > ');
        return this.apiService.get(this.config.api_url + Constants.get_all_purchase_order);
    }

    getAllPurchaseOrderByOrg(orgName: any): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_purchase_order_by_organization + orgName);
    }

}
