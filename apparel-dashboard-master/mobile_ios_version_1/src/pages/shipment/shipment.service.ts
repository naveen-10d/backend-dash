import { Injectable } from "@angular/core";
import { ApiService } from "../../config/api.service";
import { ConfigService } from "../../config/config.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Constants } from "../../config/Constant";
import { map } from 'rxjs/operators';


@Injectable()
export class ShipmentService {
    constructor(private _http: HttpClient, private apiService: ApiService, private config: ConfigService
    ) { }

    getallShipment(): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_all_shipment);
    }

    getshipmentbyid(id): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_shipmentby_id + id);
    }

    getAllShipmentsByOrg(orgName: any): Observable<any> {
        return this.apiService.get(this.config.api_url + '/Shipments/Org/getall/' + orgName);
    }

    getPackedItemByShipmentId(shipmentId: any): Observable<any> {
        return this.apiService.get(this.config.api_url + '/Shipments/getpackeditem/' + shipmentId);
    }

    getPackedBox(packedBoxId): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_packeditems_byid + packedBoxId);
    }

    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,ponumber,startdate,enddate): Observable<any[]> {
        // console.log('style color and size in service are ---- ', style, color, size);
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            ponumber: ponumber,
            startdate: startdate,
            enddate: enddate,

        };
        return this.apiService.post(this.config.api_url +
            '/Shipments/getall', object).pipe(
                map(res => res)
            );
    }
    getDataByCompanyCode(
        pageNumber, pageSize, sortLabel, sortDirection, search, ponumber,companyCode,startdate,enddate): Observable<any[]> {

        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            ponumber: ponumber,
            companyCode: companyCode,
            startDate: startdate,
            endDate: enddate,
        };
        return this.apiService.post(this.config.api_url + '/Shipments/Org/getall', object).pipe(
            map(res => res)
        );
    }


}