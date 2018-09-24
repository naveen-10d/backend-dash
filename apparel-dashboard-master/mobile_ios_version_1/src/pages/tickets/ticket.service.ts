import { Injectable } from "@angular/core";
import { ApiService } from "../../config/api.service";
import { ConfigService } from "../../config/config.service";
import { Observable } from "rxjs";


@Injectable()
export class TicketService {
    constructor( private apiService: ApiService, private configService: ConfigService
        ) { }
    getAllTicket(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getall');
    }
    saveTicket(ticket: any): Observable<any> {
        return this.apiService.post(this.configService.api_url + '/Ticket/create', ticket);
    }
    getTicketByUuid(uuid: any): Observable<any> {
        return this.apiService.get(this.configService.api_url + `/Ticket/get/${uuid}`);
    }
    getcloseReason(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/CloseReason/getreason');
    }
    updateticket(data):Observable<any> {
        return this.apiService.put(this.configService.api_url + '/Ticket/update' , data);
    }
    getAllTicketByOrg(uuid): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Ticket/getbyorg/' + uuid);
    }
    ReopenTicket(data): Observable<any> {
        return this.apiService.put(this.configService.api_url + '/Ticket/Reopenticket', data);
    }
    orgGetAll(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/Organization/getall' );
    }
    getAllUserByOrg(uuid): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/User/getuserByOrganization/' + uuid);
    }
    getAllUser(): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/User/getall');
    }
    sendMail(data): Observable<any> {
        return this.apiService.post(this.configService.api_url + '/Mail/send', data);
    }
    createAssignedUserTicket(Object: any): Observable<any> {
        return this.apiService.post(this.configService.api_url + '/assignedUserTicket/create', Object);
    }

}