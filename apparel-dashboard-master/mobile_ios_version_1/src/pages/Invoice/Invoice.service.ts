import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { ApiService } from '../../config/api.service';
import { Constants } from '../../config/Constant';
import { map } from 'rxjs/operators';

@Injectable()

export class InvoiceService {

    constructor(private _http: HttpClient, private config: ConfigService, private apiService: ApiService) { }

    getAllInvoices(): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.GetallInvoice);
    }
    getAllInvoiceByOrg(orgName: any): Observable<any> {
        return this.apiService.get(this.config.api_url + '/Invoices/org/getall/' + orgName);
    }

    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        item, status): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            item: item,
            status: status
        };
        return this.apiService.post(this.config.api_url +
            '/Invoices/getall', object).pipe(
                map(res => res)
            );
    }
    getDataByCompanyCode(
        pageNumber, pageSize, sortLabel,
        sortDirection, search, item, status, companyCode): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            item: item,
            status: status,
            companyCode: companyCode
        };
        return this.apiService.post(this.config.api_url + '/Invoices/org/getall/', object).pipe(
            map(res => res)
        );
    }


}