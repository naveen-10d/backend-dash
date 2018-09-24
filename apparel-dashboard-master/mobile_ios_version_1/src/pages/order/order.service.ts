import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config/config.service';
import { ApiService } from '../../config/api.service';
import { Constants } from '../../config/Constant';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {
    //public selected_id: number;
    constructor(private config: ConfigService, private apiService: ApiService) { }

    getallOrders(): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_all_order);
    }
    getorderbyid(id):Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/get/' + id);
    }
    getallOrdersByOrg(code): Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/Org/getall/'+code);
    }

    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        location, ticketCount, status, styleOption): Observable<any[]> {
        var object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            location: location,
            ticketCount: ticketCount,
            status: status,
            styleOption: styleOption
        }

        return this.apiService.post(this.config.api_url +
            '/SalesOrder/getall', object).pipe(
                map(res => res)
            );
    }
    getDataByCompanyCode(
        pageNumber, pageSize, sortLabel,
        sortDirection, search, location, ticketCount, status, styleOption, companyCode): Observable<any[]> {
        var object = {
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
        }
        return this.apiService.post(this.config.api_url + '/SalesOrder/Org/getall', object).pipe(
            map(res => res)
        );
    }

}
