import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../config/api.service';
import {SharedService} from '../../shared/shared.service'

@Injectable()
export class LoginService {
    public selected_id: number;
    constructor(private apiService: ApiService, private SharedService:SharedService) { }

    login(data: any): Observable<any> {
        return this.apiService.post(this.SharedService.baseUrl+`/auth/login`, data);
    }
}