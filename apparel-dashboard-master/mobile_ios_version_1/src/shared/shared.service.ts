import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    public baseUrl = 'https://stahlsportalstage.azurewebsites.net';
    // public baseUrl = 'http://localhost:8080';
    public analyticsUrl = 'https://stahlsportalanalyticsstage.azurewebsites.net';
    //public analyticsUrl = 'http://localhost:5000';
    public reporturl = '';
    public browser_language: string;
}
