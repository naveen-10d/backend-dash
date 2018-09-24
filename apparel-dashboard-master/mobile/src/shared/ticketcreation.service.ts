import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './index';
import { SharedService } from '../shared.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TicketCreationService {
    public selected_id: number;
    private token;

    constructor(private http: HttpClient, private httpapiService: ApiService, private SharedService: SharedService) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentuser'));
        if (currentUser && currentUser.token) {
            this.setHeaders().append('Authorization', 'bearer ' + currentUser.token);
            this.token = 'bearer ' + currentUser.token;
        }
    }

    private setHeaders(): HttpHeaders {
        const headersConfig = {
            'Authorization': this.token
        };
        return new HttpHeaders(headersConfig);
    }

    create_tickets(ticketdetails): Observable<any> {
        return this.http.post(this.SharedService.baseUrl + `/api/Ticket/create`, ticketdetails, {headers:this.setHeaders()});
    }

    update_tickets(ticketdetails): Observable<any> {
        return this.http.put(this.SharedService.baseUrl + `/api/Ticket/update`, ticketdetails, {headers:this.setHeaders()});
    }

    get_all_tickets(): Observable<any> {
        return this.http.get(this.SharedService.baseUrl + `/api/Ticket/getall`, {headers:this.setHeaders()});
    }

    get_tickets_byUserID(uid): Observable<any> {
        return this.http.get(this.SharedService.baseUrl + `/api/Ticket/getbyuser/` + uid, {headers:this.setHeaders()});
    }

    get_ticket_byID(id): Observable<any> {
        return this.http.get(this.SharedService.baseUrl + `/api/Ticket/get/` + id, {headers:this.setHeaders()});
    }

    get_assigned_ticket(uid): Observable<any> {
        return this.http.get(this.SharedService.baseUrl + `/api/Ticket/getbyassignto/` + uid, {headers:this.setHeaders()});
    }

}