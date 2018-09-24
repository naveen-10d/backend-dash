import { Injectable } from '@angular/core';
import { ApiService } from '../../config/api.service';
import { ConfigService } from '../../config/config.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../config/Constant';
import { map } from 'rxjs/operators';



@Injectable()
export class TicketService {
    constructor(private apiService: ApiService, private configService: ConfigService) { }
    // createTicket(data: any): Observable<any> {
    //     return this.apiService.post(this.configService.api_url + '/Ticket/create', data);
    // }
    getAllTicket(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getall');
    }
    getAllTicketByOrg(uuid): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getbyorg/' + uuid);
    }
    searchcomments(searchtext): Observable<any> {
        return this.apiService.get(this.configService.api_url + Constants.Searchcomments + searchtext);
    }
    Orgsearchcomments(searchtext, code): Observable<any> {
        return this.apiService.get(this.configService.api_url + Constants.OrgSearchcomments + searchtext + '/' + code);
    }
    getSearchResult(pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any): Observable<any> {
        search.pageIndex = pageIndex;
        search.pageSize = pageSize;
        search.sortLabel = sortLabel;
        search.sortDirection = sortDirection;
        return this.apiService.post(this.configService.api_url + '/Ticket/search', search);
    }
    getSearchResultByOrgId(pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any, orgId: any): Observable<any> {
        search.pageIndex = pageIndex;
        search.pageSize = pageSize;
        search.sortLabel = sortLabel;
        search.sortDirection = sortDirection;
        search.orgId = orgId;
        return this.apiService.post(this.configService.api_url + '/Ticket/searchByOrgId', search);
    }
    getFilterValueByOrgId(orgId): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getFilterByOrgId/' + orgId);
    }
    getFilterValue(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getFilter');
    }
    getData(
        pageNumber, pageSize, sortLabel, sortDirection, search,
        createdBy, assignedTo, status, organization): Observable<any[]> {
        console.log('createdBy assignedTo and status in service are ---- ', createdBy, assignedTo, status);
        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            createdBy: createdBy,
            assignedTo: assignedTo,
            status: status,
            organization: organization
        };
        return this.apiService.post(this.configService.api_url +
            '/Ticket/getAllTickets', object).pipe(
                map(res => res)
            );
    }
    getDataByOrgId(
        pageNumber, pageSize, sortLabel, sortDirection, search, createdBy, assignedTo, status, orgId): Observable<any[]> {

        const object = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortLabel: sortLabel,
            sortDirection: sortDirection,
            search: search,
            createdBy: createdBy,
            assignedTo: assignedTo,
            status: status,
            orgId: orgId
        };
        return this.apiService.post(this.configService.api_url + '/Ticket/getAllTicketByOrgId', object).pipe(
            map(res => res)
        );
    }
}
