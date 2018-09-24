import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { ApiService } from '../../config/api.service';
import { Constants } from '../../config/Constant';
import { map } from 'rxjs/operators';

@Injectable()

export class InventoryService {

constructor(private _http: HttpClient, private config: ConfigService, private apiService: ApiService) { }

getallInventory(): Observable<any> {
    return this.apiService.get(this.config.api_url + Constants.GetAll_Inventory);
}

getInventorybyCompanycode(code): Observable<any> {
    return this.apiService.get(this.config.api_url + Constants.GetInventoryByCompanyCode +'/' + code);
}

getData(
    pageNumber, pageSize, sortLabel, sortDirection, search,
    style, color, size,code): Observable<any[]> {
    console.log('style color and size in service are ---- ', style, color, size,code);
    var object = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortLabel: sortLabel,
        sortDirection: sortDirection,
        search: search,
        style: style,
        color: color,
        size: size,
        code: code
    }
    return this.apiService.post(this.config.api_url +
        Constants.GetAll_Active_Inventories, object).pipe(
            map(res => res)
        );
}

getDataByCompanyCode(
    pageNumber, pageSize, sortLabel, sortDirection, search, style, color, size, companyCode): Observable<any[]> {

    var object = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortLabel: sortLabel,
        sortDirection: sortDirection,
        search: search,
        style: style,
        color: color,
        size: size,
        companyCode: companyCode
    }
    return this.apiService.post(this.config.api_url + Constants.GetInventoryByCompanyCode, object).pipe(
        map(res => res)
    );
}


}