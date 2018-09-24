import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../config/api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InvoiceService {
    private subject: Subject<any>;
    constructor(private http: HttpClient, private router: Router, private api: ApiService, private config: ConfigService) {
    }
    getallInvoice(): Observable<any> {
        return this.api.get(this.config.api_url + '/Invoices/getall');
    }
    getAllInvoiceByOrg(orgName: any): Observable<any> {
        return this.api.get(this.config.api_url + '/Invoices/org/getall/' + orgName);
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
        return this.api.post(this.config.api_url +
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
        return this.api.post(this.config.api_url + '/Invoices/org/getall/', object).pipe(
            map(res => res)
        );
    }


    getFilterValue(): Observable<Number> {
        return this.api.get(this.config.api_url + '/Invoices/getInvoicesFilterValue');
    }

    getFilterValueData(data): Observable<Number> {
        return this.api.post(this.config.api_url + '/Invoices/getInvoicesFilterValueData', data);
    }

    getFilterValueDataByCompanyCode(data, companyCode: any): Observable<Number> {
        return this.api.post(this.config.api_url + '/Invoices/getInvoicesFilterValueDataByCode/' + companyCode, data);
    }


    getFilterValueByCompanyCode(companyCode: any): Observable<Number> {
        return this.api.get(this.config.api_url + '/Invoices/getInvoicesFilterValueByCode/' + companyCode);
    }
}

