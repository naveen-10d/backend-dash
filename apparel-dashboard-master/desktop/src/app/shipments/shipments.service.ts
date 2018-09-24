import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../config/api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ShipmentsService {
    private subject: Subject<any>;
    constructor(private http: HttpClient, private router: Router, private api: ApiService, private config: ConfigService) {
    }
    getallShipments(): Observable<any> {
        return this.api.get(this.config.api_url + '/Shipments/getall');
    }
    getAllShipmentsByOrg(orgName: any): Observable<any> {
        return this.api.get(this.config.api_url + '/Shipments/Org/getall/' + orgName);
    }
    getShipments(shipmentId): Observable<any> {
        return this.api.get(this.config.api_url + '/Shipments/get/' + shipmentId);
    }

    getPackedBox(packedBoxId): Observable<any> {
        return this.api.get(this.config.api_url + '/Shipments/get/packedBoxItem/' + packedBoxId);
    }

    getPackedItemByShipmentId(shipmentId: any): Observable<any> {
        return this.api.get(this.config.api_url + '/Shipments/getpackeditem/' + shipmentId);
    }

    getShipmentByDate(startdate, enddate): Observable<any> {
        const object = {
            startDate: startdate,
            endDate: enddate
        };
        return this.api.post(this.config.api_url + `/Shipments/getShipmentByDate`, object);
    }
    getShipmentByDateCode(code, startdate, enddate): Observable<any> {
        const object = {
            startDate: startdate,
            endDate: enddate,
            code: code
        };
        return this.api.post(this.config.api_url + `/Shipments/getShipmentByDateCode`, object);
    }
    getFilterValue(): Observable<Number> {
        return this.api.get(this.config.api_url + '/Shipments/getShipmentFilterValue');
    }
    getFilterValueByCompanyCode(companyCode: any): Observable<Number> {
        return this.api.get(this.config.api_url + '/Shipments/getShipmentFilterByCompanycode/' + companyCode);
    }
    getPonumberbyDate(startdate, enddate): Observable<any> {
        const object = {
            startDate: startdate,
            endDate: enddate
        };
        return this.api.post(this.config.api_url +  `/Shipments/getPonumberByDate`, object);
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
        return this.api.post(this.config.api_url +
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
        return this.api.post(this.config.api_url + '/Shipments/Org/getall', object).pipe(
            map(res => res)
        );
    }


}

