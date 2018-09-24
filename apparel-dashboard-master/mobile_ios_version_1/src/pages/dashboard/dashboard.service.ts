import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { ApiService } from '../../config/api.service';
import { Constants } from '../../config/Constant';

@Injectable()

export class DashboardService {

    constructor(private _http: HttpClient, private config: ConfigService, private apiService: ApiService) { }

    get_priority(days) {
        return this.apiService.get(this.config.analytics_url + Constants.get_priority+days);
    }

    get_ordersReceived() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersReceived);
    }

    get_ordersReceivedToday() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersReceivedToday);
    }

    get_orderShipped() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersShipped);
    }

    get_orderShippedToday() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersShippedToday);
    }

    get_ordersOnTime() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersOnTime);
    }

    get_ordersOnTimeToday() {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersOnTimeToday);
    }

    /* API with company code */

    get_priorityOrg(days,code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_priorityOrg+days+"/"+code);
    }

    get_ordersReceivedOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersReceivedOrg+code);
    }

    get_ordersReceivedTodayOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersReceivedTodayOrg+code);
    }

    get_ordersOnTimeOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersOnTimeOrg+code);
    }

    get_ordersOnTimeTodayOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersOnTimeTodayOrg+code);
    }

    get_orderShippedOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersShippedOrg+code);
    }

    get_orderShippedTodayOrg(code) {
        return this.apiService.get(this.config.analytics_url + Constants.get_ordersShippedTodayOrg+code);
    }

}
