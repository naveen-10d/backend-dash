import { Injectable } from '@angular/core';
import { ApiService } from '../../config/api.service';
import { ConfigService } from '../../config/config.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../config/Constant';

@Injectable()
export class TicketDetailService {
    constructor(private apiService: ApiService, private config: ConfigService, private configService: ConfigService) {

    }
    getallOrders(): Observable<any> {
        return this.apiService.get(this.config.api_url + '/SalesOrder/getorder');
    }

    getTicketByUuid(uuid: any): Observable<any> {
        return this.apiService.get(this.configService.api_url + `/Ticket/get/${uuid}`);
    }
    getAllUserByOrg(uuid): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.get_All_User_By_Org + uuid);
    }
    update_Ticket(data): Observable<any> {
        // console.log('--------------check-------------------',data);
        return this.apiService.put(this.config.api_url + Constants.update_Ticket, data);
    }
    getAttachementbyTicketid(id): Observable<any> {
        return this.apiService.get(this.config.api_url + '/file/getbyid/' + id );
    }
    DeleteAttachementbyid(id): Observable<any> {
        return this.apiService.delete(this.config.api_url + '/file/delete/' + id );
    }

    Reopen_ticket(data): Observable<any>{
        return this.apiService.put(this.config.api_url + Constants.Reopen_ticket, data); 
    }

    sendMail(data): Observable<any> {
        return this.apiService.post(this.config.api_url + Constants.send_Mail, data);
    }
    getReason(): Observable<any> {
        return this.apiService.get(this.config.api_url + Constants.getcloseReason);
    }
    getAllUser(): Observable<any> {
        return this.apiService.get(this.configService.api_url + Constants.get_All_User);
    }
    getuserByid(id): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/User/get/' + id);
    }
    orgGetAll(): Observable<any> {
        return this.apiService.get(this.configService.api_url + Constants.orgGetAll);
    }
    createAssignedUserTicket(Object: any): Observable<any> {
        return this.apiService.post(this.configService.api_url + Constants.createAssignedUserTicket, Object);
    }
    saveFileUrl(file: any): Observable<any> {
        return this.apiService.post(this.configService.api_url + '/file/save', file);
    }
    createcomments(comments) {
        return this.apiService.post(this.configService.api_url + '/TicketComment/create', comments);
    }
    getCommentsByTicketID(ticketId: String): Observable<any> {
        return this.apiService.get(this.configService.api_url + '/TicketComment/getall/' + ticketId);
    }
    LogHistory(data): Observable<any> {
        return this.apiService.post(this.configService.api_url + Constants.LogHistory, data);
    }
    getHistory(id): Observable<any> {
        return this.apiService.get(this.configService.api_url + Constants.GetTickethistroy + '/' + id);
    }

}
