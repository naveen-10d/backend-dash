import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../config/api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()

export class ForgotPasswordService {
    private subject: Subject<any>;
    constructor(private http: HttpClient, private router: Router, private api: ApiService, private config: ConfigService) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.subject = new BehaviorSubject<any>(currentUser);
    }

    updatepassword(token): Observable<any> {
        const object = {
            token:token,
        }
        return this.api.post(this.config.update + `/User/UpdatePassword`, object );
    }

    updateUser(user): Observable<any> {
        return this.api.put(this.config.passwordupdate + '/User/update', user);
    }


}