import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './index';
import {SharedService} from '../shared.service'

@Injectable()
export class DashboardService {
    public selected_id: number;
    constructor(private apiService: ApiService, private SharedService:SharedService) { }

    get_all_Lists(): Observable<any> {
        return this.apiService.get(this.SharedService.baseUrl+`/api/report/getall`);
    }

    // create_List(list: any): Observable<any> {
    //     return this.apiService.post(`/api/v1/companies/companiestypes/`, list);
    // }
    // delete_item(id: any): Observable<any> {
    //     return this.apiService.delete(`/api/v1/companies/companiestypes/`+id);
    // }
}