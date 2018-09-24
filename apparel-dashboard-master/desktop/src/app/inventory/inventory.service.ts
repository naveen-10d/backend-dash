import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import { ApiService } from '../config/api.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/Constant';
import { map } from 'rxjs/operators';

@Injectable()
export class InventoryService {
    public selected_id: number;
    constructor(private _http: HttpClient, private config: ConfigService, private apiService: ApiService) { }

    getAllActiveInventories(pageNumber, pageSize): Observable<any> {
        return this.apiService.get(this.config.api_url +
            Constants.GetAll_Active_Inventories + `/?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }
    getAllInventories(pageNumber, pageSize): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.GetAll_Inventory);
    }
    getAllInventoryItems(): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.GetAllInventoryItems);
    }
    getInventorybyId(id): Observable<any> {
        return this.apiService.get(this.config.api_url + '/Inventory/get/' + id);
    }
    getInventoryitems(id): Observable<any> {
        return this.apiService.get(this.config.api_url + '/InventoryItems/get/' + id);
    }
    getInventorybyCompanycode(code): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.GetInventoryByCompanyCode + '/' + code);
    }
    getDataCount(): Observable<Number> {
        return this.apiService.get(this.config.api_url + '/Inventory/getCount');
    }
    getFilterValue(): Observable<Number> {
        return this.apiService.get(this.config.api_url + '/Inventory/getInventoryFilterValue');
    }
    getFilterValueByCompanyCode(companyCode: any): Observable<Number> {
        return this.apiService.get(this.config.api_url + '/Inventory/getInventoryFilterValueByCode/' + companyCode);
    }
    getInventoryByDateRange(startDate, endDate): Observable<any> {
        return this.apiService.get(this.config.api_url + `/Inventory/getInventoryByDateRange/?startDate=${startDate}&endDate=${endDate}`);
    }
    getInventoryItemsByDateRange(startDate, endDate, style): Observable<any> {
        const object = {
            startDate: startDate,
            endDate: endDate,
            style: style
        };
        return this.apiService.post(this.config.api_url +
             `/InventoryItems/getInventoryItemsByDateRange`, object);
    }
    getInventoryItemsByDateRangeCode(startDate, endDate, code, style): Observable<any> {
        const object = {
            startDate: startDate,
            endDate: endDate,
            code: code,
            style: style
        };
        return this.apiService.post(this.config.api_url +
             `/InventoryItems/getInventoryItemsByDateRangeCode`, object);
    }
    exportAllInventory(): Observable<any> {
        return this.apiService.get(this.config.api_url + `/Inventory/exportAllInventory`);
    }
    exportAllInventoryByCode(code): Observable<any> {
        return this.apiService.get(this.config.api_url + `/Inventory/exportAllInventoryByCode/?code=${code}`);
    }
    //     getData(
    //         pageNumber, pageSize, sortLabel, sortDirection, search,
    //         style, color, size): Observable<any[]> {
    // console.log('style color and size in service are ---- ', style,color,size);
    //         return this.apiService.get(this.config.api_url +
    //             Constants.GetAll_Active_Inventories +
    //             `/?pageNumber=${pageNumber}&pageSize=${pageSize}
    // &sortLabel=${sortLabel}&sortDirection=${sortDirection}&search=${search}&
    // style[]=${style}&color[]=${color}&size[]=${size}`
    //         ).pipe(
    //             map(res => res)
    //         );
    //     }


    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        style, color, size, code): Observable<any[]> {
        console.log('style color and size in service are ---- ', style, color, size);
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            style: style,
            color: color,
            size: size,
            code: code
        };
        return this.apiService.post(this.config.api_url +
            Constants.GetAll_Active_Inventories, object).pipe(
                map(res => res)
            );
    }
    getDataByCompanyCode(
        pageNumber, pageSize, sortLabel, sortDirection, search, style, color, size, companyCode): Observable<any[]> {

        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            style: style,
            color: color,
            size: size,
            companyCode: companyCode
        };
        return this.apiService.post(this.config.api_url + Constants.GetInventoryByCompanyCode, object).pipe(
            map(res => res)
        );
    }

    getFilterValueData(data): Observable<Number> {
        return this.apiService.post(this.config.api_url + '/Inventory/filterinventory', data);
    }
    getFilterValueDataByCompanyCode(data, companyCode: any): Observable<Number> {
        return this.apiService.post(this.config.api_url + '/Inventory/Filtervaluebycompanycode/' + companyCode,data);
    }

}
