import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../config/api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Constants } from '../config/Constant';

@Injectable()
export class DashboardService {
    // public orderId: String;
    private subject: Subject<any>;
    constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private configService: ConfigService) {
    }

    get_priority(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_priority+days);
    }

    get_ordersReceived() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersReceived);
    }

    get_ordersOnTime() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTime);
    }

    get_ordersOnTimeToday() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeToday);
    }

    get_ordersOnTimeShipped(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeShipped + days );
    }

    get_ordersOnTimeForecast(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeForecast + days );
    }

    get_ordersTopSelling(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersTopSelling + days);
    }

    get_ordersReceivedToday() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersReceivedToday);
    }

    get_orderShipped() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersShipped);
    }

    get_orderShippedToday() {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersShippedToday);
    }

    get_barGraphData(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_barGraphData + days );
    }

    get_timeGraphData(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_timeGraphData + days );
    }

    get_barGraphDataShipped(days) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_barGraphDataShipped + days );
    }








    get_priorityOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_priorityOrg+days+"/"+code);
    }

    get_ordersReceivedOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersReceivedOrg+code);
    }

    get_ordersOnTimeOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeOrg+code);
    }

    get_ordersOnTimeTodayOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeTodayOrg+code);
    }

    get_ordersOnTimeShippedOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeShippedOrg + days+"/"+code );
    }

    get_ordersOnTimeForecastOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersOnTimeForecastOrg + days +"/"+code );
    }


    get_ordersTopSellingOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersTopSellingOrg + days +"/"+code);
    }

    get_ordersReceivedTodayOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersReceivedTodayOrg+code);
    }

    get_orderShippedOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersShippedOrg+code);
    }

    get_orderShippedTodayOrg(code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_ordersShippedTodayOrg+code);
    }

    get_barGraphDataOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_barGraphDataOrg + days+"/"+code );
    }

    get_timeGraphDataOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_timeGraphDataOrg + days+"/"+code );
    }

    get_barGraphDataShippedOrg(days,code) {
        return this.apiService.get(this.configService.analytics_url + Constants.get_barGraphDataShippedOrg + days+"/"+code );
    }

}

