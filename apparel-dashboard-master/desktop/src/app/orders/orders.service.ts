import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../config/api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {
    private subject: Subject<any>;
    constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private config: ConfigService) {
    }
    getExportOrders(dateRange): Observable<any> {
        return this.apiService.post(this.config.api_url + `/SalesOrder/getExportSalesOrder`, dateRange);
    }
    getExportOrdersByCode(dateRange, code: String): Observable<any> {
        const object = {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            code: code
        };
        return this.apiService.post(this.config.api_url + `/SalesOrder/getExportSalesOrderByCode`, object);
    }
    getFilterValue(): Observable<Number> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getSalesOrderFilterValue');
    }

    getFilterValueData(data): Observable<Number> {
        return this.apiService.post(this.config.api_url + '/SalesOrder/getSalesOrderFilterValueData',data);
    }

    getFilterValueDataByCompanyCode(data,companyCode: any): Observable<Number> {
        return this.apiService.post(this.config.api_url + '/SalesOrder/getSalesOrderFilterValueDataByCode/' + companyCode,data);
    }


    getFilterValueByCompanyCode(companyCode: any): Observable<Number> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getSalesOrderFilterValueByCode/' + companyCode);
    }

    getCountByStatusName(): Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getCountByStatusName');
    }
    getStatusNameCountByCode(code: String): Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getStatusNameCountByCode/' + code);
    }

    getSalesOrderByStatusName(statusName: String): Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getSalesOrderByStatusName/' + statusName);
    }

    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        location, ticketCount, status, styleOption): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            location: location,
            ticketCount: ticketCount,
            status: status,
            styleOption: styleOption
        };

        return this.apiService.post(this.config.api_url +
            '/SalesOrder/getall', object).pipe(
                map(res => res)
            );
    }
    getDataByCompanyCode(
        pageNumber, pageSize, sortLabel,
        sortDirection, search, location, ticketCount, status, styleOption, companyCode): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            location: location,
            ticketCount: ticketCount,
            status: status,
            styleOption: styleOption,
            companyCode: companyCode
        };
        return this.apiService.post(this.config.api_url + '/SalesOrder/Org/getall', object).pipe(
            map(res => res)
        );
    }

    getDataByStatusName(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        location, ticketCount, status, styleOption, statusName): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            location: location,
            ticketCount: ticketCount,
            status: status,
            styleOption: styleOption,
            statusName: statusName
        };

        return this.apiService.post(this.config.api_url +
            '/SalesOrder/getSalesOrderByStatusName', object).pipe(
                map(res => res)
            );
    }

    getDataByStatusNameCompanyCode(
        pageNumber, pageSize, sortLabel,
        sortDirection, search, location, ticketCount, status, styleOption, statusName, companyCode): Observable<any[]> {
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            location: location,
            ticketCount: ticketCount,
            status: status,
            styleOption: styleOption,
            statusName: statusName,
            companyCode: companyCode
        };
        return this.apiService.post(this.config.api_url + '/SalesOrder/Org/getSalesOrderByStatusName', object).pipe(
            map(res => res)
        );
    }
}

