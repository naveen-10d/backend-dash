webpackJsonp([0],{

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_service__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoginPage = /** @class */ (function () {
    function LoginPage(alertCtrl, menu, 
        // public navCtrl: NavController,
        app, loginService, events) {
        this.alertCtrl = alertCtrl;
        this.menu = menu;
        this.app = app;
        this.loginService = loginService;
        this.events = events;
        this.username = "";
        this.password = "";
    }
    Object.defineProperty(LoginPage.prototype, "navCtrl", {
        get: function () {
            console.log(this.app.getRootNav());
            return this.app.getRootNav();
        },
        enumerable: true,
        configurable: true
    });
    LoginPage.prototype.ionViewDidEnter = function () {
        this.menu.swipeEnable(false);
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        this.menu.swipeEnable(true);
    };
    LoginPage.prototype.afterlogin = function () {
        var _this = this;
        var data = {
            "username": this.username,
            "password": this.password
        };
        // if(data.username !== "" && data.password !== "")
        this.loginService.login(data).subscribe(function (data) {
            console.log("------>>> ", data);
            _this.events.publish('user:created', data);
            sessionStorage.setItem('currentuser', JSON.stringify(data));
            sessionStorage.setItem('token', JSON.stringify(data.token));
            if (data.user.uuid !== "" || data.user.uuid !== null) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard__["a" /* DashboardPage */]);
            }
        }, function (error) {
            console.log("--error-->>", error);
            // this.presentAlert('Wrong Credentials Entered..!');
        });
        // this.navCtrl.setRoot(DashboardPage);
    };
    LoginPage.prototype.presentAlert = function (message) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Alert..!',
            message: message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function () {
                        _this.username = "",
                            _this.password = "";
                    }
                }
            ]
        });
        alert.present();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/login/login.html"*/' \n <ion-content padding>\n    <ion-grid style="height: 100%">\n        <ion-row justify-content-center align-items-center style="height: 100%">\n          <ion-card  class="loginCard">\n              <img class="login-logo" src="assets/img/logo.png">\n              <ion-input class="login-input" placeholder="Username" [(ngModel)]="username" type="text"></ion-input>\n              <ion-input class="login-input" placeholder="Password" [(ngModel)]="password" type="password"></ion-input>\n              <button (click)="afterlogin()" ion-button class="login-button">Login</button> <br/> <br/>\n              <a href="">Forgot Password?</a>\n            <!-- <form >\n              <ion-list>\n    \n                <ion-item>\n                  <ion-label fixed>Email</ion-label>\n                  <ion-input type="email"  name="email"></ion-input>\n                </ion-item>\n    \n                <ion-item>\n                  <ion-label fixed>Password</ion-label>\n                  <ion-input type="password"  name="password"></ion-input>\n                </ion-item>\n    \n    \n                <div padding>\n                  <button ion-button color="primary" block >Effettua il login</button>\n                </div>\n    \n              </ion-list>\n            </form> -->\n          </ion-card>\n        </ion-row>\n      </ion-grid>\n  <!-- <ion-grid class="loginCard">\n      <ion-card>\n      <ion-card-content >\n        <img class="login-logo" src="assets/imgs/logo.png"> -->\n        <!-- <ion-label class="login-label">Log In</ion-label> <br/> -->\n        <!-- <ion-input class="login-input" placeholder="Username" [(ngModel)]="username" type="text"></ion-input>\n        <ion-input class="login-input" placeholder="Password" [(ngModel)]="password" type="password"></ion-input>\n        <button (click)="afterlogin()" ion-button class="login-button">Login</button> <br/> <br/>\n        <a href="">Forgot Password?</a>\n      </ion-card-content>\n    </ion-card>\n  </ion-grid> -->\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_3__login_service__["a" /* LoginService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DashboardPage = /** @class */ (function () {
    function DashboardPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    DashboardPage.prototype.ionViewDidLoad = function () {
    };
    DashboardPage.prototype.ngOnInit = function () {
        // this.dashboardService.get_all_Lists().subscribe((data) => {
        var data = [{
                "reportname": "customer_product"
            },
            {
                "reportname": "Warehouse_Comparision"
            },
            {
                "reportname": "Forcastvsorders"
            }];
        this.allList = data;
        // });
    };
    DashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-dashboard',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/dashboard/dashboard.html"*/'<ion-header>\n  <ion-navbar class="header" hideBackButton>\n    <button ion-button menuToggle>\n      <ion-icon class="menu-icon" name="menu"></ion-icon>\n      <!-- <page-navbar></page-navbar> -->\n    </button>\n    <div class="logo-container">\n      <!-- <img height="40" class="nav-logo" src="assets/imgs/stahls.png"> -->\n      <span class="header-title">STAHLS</span>\n      <!-- <button ion-button> -->\n      <ion-icon class="noti-icon" name="notifications"></ion-icon>\n      <!-- </button>   -->\n    </div>\n\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content class="page-con">\n  <ion-card>\n    <ion-card-content class="dashCard">\n      <ion-card-title>\n        <span class="dash-title">Orders</span>\n        <ion-badge item-end>2 notifications</ion-badge>\n      </ion-card-title>\n      <ion-list>\n        <br/>\n        <button class="delayed">\n          <span> 04/04/2018 / Solved - Jhon Doe</span>\n        </button>\n        <button class="pending">\n          <span>04/04/2018 / Inprogress - Jhon Do</span>\n        </button>\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card>\n    <ion-card-content class="dashCard">\n      <ion-card-title class="card-title1">\n        <span>Purchase Order</span>\n      </ion-card-title>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card>\n    <ion-card-content class="dashCard">\n      <ion-card-title>\n        <span class="dash-title">Tickets</span>\n      </ion-card-title>\n      <ion-list>\n        <div class="track-badge">\n          <div class="div-badge b1"> 1 </div>\n          <div class="div-badge b2"> 2 </div>\n          <div class="div-badge b3"> 3 </div>\n          <div class="div-badge b4"> 4 </div>\n        </div>\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card>\n    <ion-card-content class="dashCard">\n      <ion-card-title class="card-title1">\n        <span>Inventory</span>\n      </ion-card-title>\n    </ion-card-content>\n  </ion-card>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/dashboard/dashboard.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], DashboardPage);
    return DashboardPage;
}());

//# sourceMappingURL=dashboard.js.map

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SharedService = /** @class */ (function () {
    function SharedService() {
        this.baseUrl = 'http://stahlstest.azurewebsites.net';
        // public baseUrl = 'http://localhost:8080';
        this.reporturl = '';
    }
    SharedService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], SharedService);
    return SharedService;
}());

//# sourceMappingURL=shared.service.js.map

/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderFilterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OrderFilterComponent = /** @class */ (function () {
    function OrderFilterComponent(navCtrl, viewCtrl, nav) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.nav = nav;
        this.selectedStatus = [];
    }
    OrderFilterComponent.prototype.ngOnInit = function () {
        this.getParamsValue();
    };
    OrderFilterComponent.prototype.addService = function (test) {
        console.log("$$$$$$", test);
    };
    OrderFilterComponent.prototype.statusCheckBox = function (index) {
        if (this.selectedStatus.indexOf(index) > -1) {
            this.selectedStatus.slice(this.selectedStatus.indexOf(index), 1);
        }
        else {
            this.selectedStatus.push(index);
        }
        console.log("----< index ---> ", index);
    };
    OrderFilterComponent.prototype.getParamsValue = function () {
        this.location = this.nav.get('location');
        this.status = this.nav.get('status');
        console.log("location and status are ----- ", this.location, "  ", this.status);
    };
    OrderFilterComponent.prototype.ionViewDidLoad = function () {
        this.viewCtrl.setBackButtonText('');
    };
    OrderFilterComponent.prototype.selectedoption = function () {
        console.log("selected option are ----", this.selectedLocation, " ", this.selectedStatus, " ", this.selectedSortValue);
    };
    OrderFilterComponent.prototype.getValue = function (value) {
        if (this.selectedStatus.indexOf(value) > -1) {
            this.selectedStatus.splice(this.selectedStatus.indexOf(value), 1);
        }
        else {
            this.selectedStatus.push(value);
        }
        console.log("value are checkbox ----- ", this.selectedStatus);
    };
    OrderFilterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-orderFilter',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderFilter/orderFilter.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-item class="filter-header">\n        Filter Orders By:\n    </ion-item>\n\n    <ion-item class="item-header">\n        Location\n    </ion-item>\n    <ion-item>\n        <ion-label>location</ion-label>\n        <ion-select [(ngModel)]="selectedLocation" multiple="true">\n            <ion-option *ngFor="let loc of location" [value]="loc">\n                {{loc}}\n            </ion-option>\n        </ion-select>\n    </ion-item>\n\n\n    <ion-item class="item-header">\n        Number of tickets\n    </ion-item>\n    <!-- <ion-item>\n        <ion-label>1</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>2</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item> -->\n    <ion-item>\n        <ion-range min="1" max="1000" [(ngModel)]="saturation" color="secondary">\n            <ion-label range-left>1</ion-label>\n            <ion-label range-right>1000</ion-label>\n        </ion-range>\n    </ion-item>\n    <ion-item class="item-header">\n        Status\n    </ion-item>\n    <ion-item *ngFor="let st of status; let i=index;">\n        <ion-label>{{st}}</ion-label>\n        <ion-checkbox (click)="getValue(st)"></ion-checkbox>\n    </ion-item>\n\n    <!-- <form [formGroup]="form">\n        <ion-list>\n            <ion-item *ngFor="let player of status">\n                <ion-label>{{player}}</ion-label>\n                <ion-checkbox [formControlName]="player"></ion-checkbox>\n            </ion-item>\n</ion-list>\n</form> -->\n\n    <!-- <ion-item class="item-header">\n                Sort by\n            </ion-item>\n            <div class="radio-box">\n                <ion-item>\n                    <input name="sortby" type="radio">\n                    <span>Status</span>\n                </ion-item>\n                <ion-item>\n                    <input name="sortby" type="radio">\n                    <span>ASC</span>\n                </ion-item>\n            </div>\n            <div class="radio-box">\n                <ion-item>\n                    <input name="sortby" type="radio">Number of tickets\n                </ion-item>\n                <ion-item>\n                    <input name="sortby" type="radio">DESC\n                </ion-item>\n            </div>\n            <ion-item>\n                <input name="sortby" type="radio">Location\n            </ion-item>\n            <ion-item>\n                <input name="sortby" type="radio">Date\n            </ion-item>\n -->\n    <ion-item class="item-header">Sort by</ion-item>\n    <ion-list radio-group [(ngModel)]="selectedSortValue">\n        <ion-item>\n            <ion-label>Status</ion-label>\n            <ion-radio value="status"></ion-radio>\n        </ion-item>\n        <ion-item>\n            <ion-label>Number of tickets</ion-label>\n            <ion-radio value="ticket"></ion-radio>\n        </ion-item>\n        <ion-item>\n            <ion-label>Location</ion-label>\n            <ion-radio value="location"></ion-radio>\n        </ion-item>\n        <ion-item>\n            <ion-label>Date</ion-label>\n            <ion-radio value="date"></ion-radio>\n        </ion-item>\n        <ion-item>\n            <ion-label>Ascending Order</ion-label>\n            <ion-radio value="ASC"></ion-radio>\n        </ion-item>\n        <ion-item>\n            <ion-label>Descending Order</ion-label>\n            <ion-radio value="DESC"></ion-radio>\n        </ion-item>\n    </ion-list>\n\n    <button ion-button class="btn-filter" outline (click)="selectedoption()">Filter and Sort </button>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderFilter/orderFilter.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], OrderFilterComponent);
    return OrderFilterComponent;
}());

//# sourceMappingURL=orderFilterComponent.js.map

/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewTicketComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__newTicket2_newTicket2Component__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__order_order_service__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NewTicketComponent = /** @class */ (function () {
    function NewTicketComponent(navCtrl, orderService) {
        this.navCtrl = navCtrl;
        this.orderService = orderService;
        this.searchQuery = '';
        this.selectedRowValue = [];
    }
    // filterOrder() {
    //   this.navCtrl.setRoot(OrderFilterComponent);
    // }
    NewTicketComponent.prototype.add_orderslist = function () {
        var _this = this;
        this.orderService.getallOrders().subscribe(function (data) {
            _this.orderslist = data;
        }, function (error) {
            console.log("something went wrong");
        });
    };
    NewTicketComponent.prototype.ionViewDidLoad = function () {
    };
    NewTicketComponent.prototype.ngOnInit = function () {
        this.add_orderslist();
    };
    NewTicketComponent.prototype.selectedRow = function (row) {
        if (this.selectedRowValue.indexOf(row) > -1) {
            this.selectedRowValue.splice(this.selectedRowValue.indexOf(row), 1);
        }
        else {
            this.selectedRowValue.push(row);
        }
    };
    NewTicketComponent.prototype.getItems = function (ev) {
        this.orderslist = this.allOrderssToFilter;
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.orderslist = Object(this.orderslist).filter(function (item) {
                return (item.Location.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    };
    NewTicketComponent.prototype.gotoNextStep = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__newTicket2_newTicket2Component__["a" /* NewTicket2Component */], {
            ticketType: this.ticketType,
            ticketOrder: this.selectedRowValue
        });
    };
    NewTicketComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-newTicket',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/newTicket/newTicket.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-item class="header-txt">\n        <span>\n            <h1>\n                <b>Add New Ticket</b> - Step 1</h1>\n        </span>\n    </ion-item>\n\n    <!-- <ion-item class="header-btn">\n      <button ion-button large>Regular</button><button color="light" class="urg-btn" ion-button large>Urgent</button>\n    </ion-item> -->\n\n\n\n    <ion-item class="header-btn">\n        <ion-segment [(ngModel)]="ticketType">\n            <ion-segment-button value="Regular" large>Regular</ion-segment-button>\n            <ion-segment-button value="Urgent" large>Urgent</ion-segment-button>\n        </ion-segment>\n    </ion-item>\n\n\n    <ion-item class="header-txt">\n        <h2>\n            <b>Select the orders that you want\n                <br> to include on this ticket. You can\n                <br> add as many as you need</b>\n        </h2>\n    </ion-item>\n\n    <div class="searchbar-top">\n        <ion-searchbar (ionInput)="getItems($event)"></ion-searchbar>\n        <a (click)="filterOrder()"> Filter/Sort by</a>\n    </div>\n    <ion-list>\n        <ion-item *ngFor="let item of orderslist">\n            <ion-card (click)="selectedRow(item)"  [ngClass]="selectedRowValue.indexOf(item) > -1 ? \'selectedCard\':\'unSelectedCard\'">\n                <ion-card-content>\n                    <ion-card-title>\n                            <h3><b>{{item.uuid}}</b></h3>\n                        <ion-badge item-end>{{item.status}}</ion-badge>\n                    </ion-card-title>\n                    <ion-list>\n                        <br/>\n                        <span>Location: {{item.location}}</span>\n                        <br/>\n                        <span>PO: {{item.po}}</span>\n                        <br/>\n                        <span>Date: {{item.date | date: \'dd/MM/yyyy\'}}</span>\n                        <br/>\n                        <span>Tickets: {{item.tickets}}</span>\n                    </ion-list>\n                </ion-card-content>\n            </ion-card>\n        </ion-item>\n    </ion-list>\n\n    <ion-item>\n        <button ion-button full large (click)="gotoNextStep()">Continue</button>\n    </ion-item>\n\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/newTicket/newTicket.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__order_order_service__["a" /* OrderService */]])
    ], NewTicketComponent);
    return NewTicketComponent;
}());

//# sourceMappingURL=newTicketComponent.js.map

/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config_service__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_api_service__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_Constant__ = __webpack_require__(212);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var OrderService = /** @class */ (function () {
    //public selected_id: number;
    function OrderService(_http, config, apiService) {
        this._http = _http;
        this.config = config;
        this.apiService = apiService;
    }
    OrderService.prototype.getallOrders = function () {
        return this.apiService.get(this.config.api_url + __WEBPACK_IMPORTED_MODULE_4__config_Constant__["a" /* Constants */].get_all_order);
    };
    OrderService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1__config_config_service__["a" /* ConfigService */], __WEBPACK_IMPORTED_MODULE_2__config_api_service__["a" /* ApiService */]])
    ], OrderService);
    return OrderService;
}());

//# sourceMappingURL=order.service.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseOrderFilterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PurchaseOrderFilterComponent = /** @class */ (function () {
    function PurchaseOrderFilterComponent(navCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
    }
    PurchaseOrderFilterComponent.prototype.ngOnInit = function () {
    };
    PurchaseOrderFilterComponent.prototype.ionViewDidLoad = function () {
        this.viewCtrl.setBackButtonText('');
    };
    PurchaseOrderFilterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-purchaseOrderFilter',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrderFilter/purchaseOrderFilter.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-item class="filter-header">\n        Filter Orders By:\n    </ion-item>\n\n    <ion-item class="item-header">\n        Location\n    </ion-item>\n    <ion-item>\n        <ion-label>DFC</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>DFC</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n\n\n    <ion-item class="item-header">\n        Number of tickets\n    </ion-item>\n    <ion-item>\n        <ion-label>1</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>2</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n\n    <ion-item class="item-header">\n        Status\n    </ion-item>\n    <ion-item>\n        <ion-label>New</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>In progress</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>Delayed</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n    <ion-item>\n        <ion-label>In progress</ion-label>\n        <ion-checkbox color="dark"></ion-checkbox>\n    </ion-item>\n\n\n    <ion-item class="item-header">\n        Sort by\n    </ion-item>\n    <div class="radio-box">\n        <ion-item>\n            <input name="sortby" type="radio">\n            <span>Status</span>\n        </ion-item>\n        <ion-item>\n            <input name="sortby" type="radio">\n            <span>ASC</span>\n        </ion-item>\n    </div>\n    <div class="radio-box">\n        <ion-item>\n            <input name="sortby" type="radio">Number of tickets\n        </ion-item>\n        <ion-item>\n            <input name="sortby" type="radio">DESC\n        </ion-item>\n    </div>\n    <ion-item>\n        <input name="sortby" type="radio">Location\n    </ion-item>\n    <ion-item>\n        <input name="sortby" type="radio">Date\n    </ion-item>\n\n\n    <button ion-button class="btn-filter" outline>Filter and Sort </button>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrderFilter/purchaseOrderFilter.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */]])
    ], PurchaseOrderFilterComponent);
    return PurchaseOrderFilterComponent;
}());

//# sourceMappingURL=purchaseOrderFilter.component.js.map

/***/ }),

/***/ 122:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 122;

/***/ }),

/***/ 163:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 163;

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_api_service__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_shared_service__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginService = /** @class */ (function () {
    function LoginService(apiService, SharedService) {
        this.apiService = apiService;
        this.SharedService = SharedService;
    }
    LoginService.prototype.login = function (data) {
        return this.apiService.post(this.SharedService.baseUrl + "/auth/login", data);
    };
    LoginService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__config_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_2__shared_shared_service__["a" /* SharedService */]])
    ], LoginService);
    return LoginService;
}());

//# sourceMappingURL=login.service.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__orderFilter_orderFilterComponent__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__orderDetails_orderDetailsComponent__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__order_service__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var OrderComponent = /** @class */ (function () {
    function OrderComponent(navCtrl, orderService) {
        this.navCtrl = navCtrl;
        this.orderService = orderService;
        this.location = [];
        this.status = [];
        this.searchQuery = '';
    }
    OrderComponent.prototype.ionViewDidLoad = function () {
    };
    OrderComponent.prototype.ngOnInit = function () {
        this.add_orderslist();
    };
    OrderComponent.prototype.filterOrder = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__orderFilter_orderFilterComponent__["a" /* OrderFilterComponent */], {
            location: this.location,
            status: this.status
        });
    };
    OrderComponent.prototype.displayOrderDetails = function (order) {
        console.log("----> order details--> ", order);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__orderDetails_orderDetailsComponent__["a" /* OrderDetailsComponent */], {
            orderDetails: order
        });
    };
    OrderComponent.prototype.add_orderslist = function () {
        var _this = this;
        this.orderService.getallOrders()
            .subscribe(function (data) {
            console.log('data--order----->', data);
            _this.listOfOrdersToFilter = data;
            _this.orderslist = data;
            console.log("data length ---- ", data.length);
            for (var i = 0; i < data.length; i++) {
                console.log("entering into for loop --- ", _this.location.indexOf(data[i].location));
                if (_this.location.indexOf(data[i].location) > -1) {
                }
                else {
                    _this.location.push(data[i].location);
                }
                if (_this.status.indexOf(data[i].status) > -1) {
                }
                else {
                    _this.status.push(data[i].status);
                }
            }
            console.log("list of location --- ", _this.location);
            console.log("list of status  --- ", _this.status);
        }, function (error) {
            console.log('error------->', error);
        });
    };
    OrderComponent.prototype.setFilteredItems = function () {
        // const filteredValue = this.dataService.filterItems(this.listOfTicketItems, this.searchTerm);
        var filteredValue = this.filterItems(this.listOfOrdersToFilter, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ");
            this.orderslist = this.listOfOrdersToFilter;
        }
        else {
            console.log("entering into else part");
            this.orderslist = filteredValue;
        }
    };
    OrderComponent.prototype.filterItems = function (items, searchTerm) {
        if (searchTerm === '') {
            return false;
        }
        else {
            return items.filter(function (item) {
                console.log("entering into -item ---- ", item);
                if (item.location.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.po.toString().search(searchTerm) > -1 ||
                    item.date.search(searchTerm) > -1 ||
                    item.uuid.search(searchTerm) > -1 ||
                    item.tickets.toString().search(searchTerm) > -1 ||
                    item.status.toLowerCase().search(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
            });
        }
    };
    OrderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-orderComponent',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderComponent.html"*/'<ion-header>\n    <ion-navbar class="header" hideBackButton>\n        <button ion-button menuToggle>\n          <ion-icon class="menu-icon" name="menu"></ion-icon> \n        </button>\n        <div class="logo-container">\n            <!-- <img height="40" class="nav-logo" src="assets/imgs/stahls.png"> -->\n            <span class="header-title">STAHLS</span>\n            <!-- <button ion-button> -->\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n            <!-- </button>   -->\n        </div>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content class="page-con">\n    <span class="dash-title">Orders</span>\n    <div class="searchbar-top">\n        <ion-searchbar [(ngModel)]="searchTerm" (ionInput)="setFilteredItems()"></ion-searchbar>\n        <a (click)="filterOrder()" > Filter/Sort by</a>\n    </div>\n    <ion-list>\n        <ion-item *ngFor="let item of orderslist">\n                <ion-card (click)="displayOrderDetails(item)">\n                        <ion-card-content class="dashCard">\n                            <ion-card-title>\n                                <h3><b>{{item.uuid}}</b></h3>\n                                <ion-badge item-end>{{item.status}}</ion-badge>\n                            </ion-card-title>\n                            <ion-list>\n                                <br/>\n                                <span>Location: {{item.location}}</span>\n                                <br/>\n                                <span>PO: {{item.po}}</span>\n                                <br/>\n                                <span>Date: {{item.date | date:\'yyyy-MM-dd\'}}</span>\n                                <br/>\n                                <span>Ticksts: {{item.tickets}}</span>\n                            </ion-list>\n                        </ion-card-content>\n                    </ion-card>\n        </ion-item>\n    </ion-list>\n\n   \n\n</ion-content> \n'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderComponent.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__order_service__["a" /* OrderService */]])
    ], OrderComponent);
    return OrderComponent;
}());

//# sourceMappingURL=OrderComponent.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderDetailsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tickets_newTicket_newTicketComponent__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__ = __webpack_require__(107);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrderDetailsComponent = /** @class */ (function () {
    function OrderDetailsComponent(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.expandindex = null;
    }
    OrderDetailsComponent.prototype.ngOnInit = function () {
        this.orderDetails = this.navParams.get('orderDetails');
    };
    OrderDetailsComponent.prototype.ionViewDidLoad = function () {
        this.viewCtrl.setBackButtonText('');
    };
    OrderDetailsComponent.prototype.filterOrder = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__["a" /* OrderFilterComponent */]);
    };
    OrderDetailsComponent.prototype.showDetails = function (index) {
        console.log("---->> ", index);
        this.expandindex = index;
    };
    OrderDetailsComponent.prototype.hideDetails = function () {
        this.expandindex = null;
    };
    OrderDetailsComponent.prototype.gotoNewTicket = function () {
        console.log("---->new ticket--> ");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__tickets_newTicket_newTicketComponent__["a" /* NewTicketComponent */], {});
    };
    OrderDetailsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-orderDetails',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderDetails/orderDetails.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n    <ion-card>\n        <ion-card-content class="">\n            <span class="orderid">23456776</span>\n            <ion-badge item-end>In progress</ion-badge>\n            <div class="details-box">\n                <span>Location: DFC</span>\n                <br/>\n                <span>PO: 43567679</span>\n                <br/>\n                <span>Date: 09/04/2017</span>\n                <br/>\n                <span>Ticket: 2</span>\n            </div>\n            <!-- <ion-item>\n                Tracking Info\n            </ion-item> -->\n        </ion-card-content>\n    </ion-card>\n    <ion-item class="title-divider">\n        Tracking Info\n    </ion-item>\n    <ion-card>\n        <ion-card-content class="">\n            <div class="details-box">\n                <span>Location: DFC</span>\n                <span>PO: 43567679</span>\n                <br/>\n                <span>Date: 09/04/2017</span>\n                <span>Ticket: 2</span>\n            </div>\n            <!-- <ion-item>\n                    Tracking Info\n                </ion-item> -->\n        </ion-card-content>\n    </ion-card>\n    <ion-item class="title-divider">\n        Customer\n    </ion-item>\n    <ion-card>\n        <ion-card-content class="">\n            <div class="details-box">\n                <span>Location: DFC</span>\n                <span>PO: 43567679</span>\n                <br/>\n                <span>Date: 09/04/2017</span>\n                <span>Ticket: 2</span>\n            </div>\n            <!-- <ion-item>\n                            Tracking Info\n                        </ion-item> -->\n        </ion-card-content>\n    </ion-card>\n    <ion-item class="title-divider">\n        Items included in this order\n    </ion-item>\n    <ion-item class="qty-header">\n        <span style="margin-left: 15px;">Qty.</span>\n        <a class="sort-filter" (click)="filterOrder()"> Sort/Filter by</a>\n    </ion-item>\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 1" class="details-badge" item-end (click)="showDetails(1)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 1" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 1">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 2" class="details-badge" item-end (click)="showDetails(2)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 2" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 2">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 3" class="details-badge" item-end (click)="showDetails(3)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 3" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 3">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 4" class="details-badge" item-end (click)="showDetails(4)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 4" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 4">\n                Color: TNV\n                <br/> Price: In progress\n                <br/> Shipping Method: UPS 2 days\n                <br/> Artwork Status: Waiting for approval\n            </ion-row>\n        </ion-grid>\n    </ion-item>\n    <ion-item class="title-divider">\n        Ticket associated with this order\n    </ion-item>\n    <ion-item>\n        <button class="delayed">\n            <span> 04/04/2018 / Solved - Jhon Doe</span>\n        </button>\n        <br/>\n        <br/>\n        <button class="pending">\n            <span>04/04/2018 / Inprogress - Jhon Do</span>\n        </button>\n        <br/>\n        <br/>\n\n        <button ion-button class="btn-filter" (click)="gotoNewTicket()" outline>New Ticket</button>\n    </ion-item>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/order/orderDetails/orderDetails.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */]])
    ], OrderDetailsComponent);
    return OrderDetailsComponent;
}());

//# sourceMappingURL=orderDetailsComponent.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewTicket2Component; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ticket_service__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NewTicket2Component = /** @class */ (function () {
    function NewTicket2Component(navCtrl, navParam, ticketService) {
        this.navCtrl = navCtrl;
        this.navParam = navParam;
        this.ticketService = ticketService;
        this.ticket = {
            Type: '',
            Status: '',
            assignedToUuid: '',
            createdByUuid: '',
            description: '',
            order: []
        };
    }
    NewTicket2Component.prototype.ngOnInit = function () {
        this.ticket.Type = this.navParam.get('ticketType');
        this.ticket.order = this.navParam.get('ticketOrder');
        var json = JSON.parse(sessionStorage.getItem('currentuser'));
        this.ticket.assignedToUuid = json.user.uuid;
        this.ticket.createdByUuid = json.user.uuid;
        // console.log("current user values are ---- -", json);
        console.log("ticket  values are ---- -", this.ticket);
    };
    NewTicket2Component.prototype.createTicket = function () {
        this.ticket.Status = "New";
        this.ticket.description = this.Description;
        console.log("before creating ticket are --- ", this.ticket);
        this.ticketService.saveTicket(this.ticket).subscribe(function (data) {
            console.log("success to save the data --- ", data);
        }, function (error) {
            console.log("something went wrong");
        });
    };
    NewTicket2Component = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-newTicket2',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/newTicket2/newTicket2.html"*/'<ion-header>\n        <ion-navbar class="header">\n            <button ion-button menuToggle>\n                <ion-icon class="menu-icon" name="menu"></ion-icon>\n            </button>\n            <div class="logo-container">\n                <span class="header-title">STAHLS</span>\n                <ion-icon class="noti-icon" name="notifications"></ion-icon>\n            </div>\n        </ion-navbar>\n    </ion-header>\n    \n    <ion-content>\n        <ion-item>\n           <span><h1> <b>Add New Ticket</b> - Step 2</h1></span>\n        </ion-item>\n\n        <ion-item>\n                <h2> <b>Orders associated to this ticket</b></h2>                \n        </ion-item>\n<br><br>\n        <ion-item class="badg-item">\n                <ion-badge class="badge" item-start color="secondary" *ngFor="let order of ticket.order">{{order.uuid}}</ion-badge>\n                <!-- <ion-badge class="badge" item-start color="secondary">67890</ion-badge> -->\n        </ion-item>\n    \n        <ion-item class="text-item">\n          <ion-textarea class="text-area" maxLength="3000" [(ngModel)]="Description" placeholder="Please describe with the details what is happening with this order/group of orders"></ion-textarea>\n        </ion-item>\n       \n        <!-- <ion-item class="file-up">\n                <ion-input class="text-area" type="file" placeholder="file Input"></ion-input>\n        </ion-item> -->\n\n        <ion-item >\n                <button ion-button full large (click)="createTicket()">Create Ticket</button>\n        </ion-item>\n    </ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/newTicket2/newTicket2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ticket_service__["a" /* TicketService */]])
    ], NewTicket2Component);
    return NewTicket2Component;
}());

//# sourceMappingURL=newTicket2Component.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Constants = /** @class */ (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "GetAll_Inventory", {
        // API
        // Inventory
        get: function () { return '/Inventory/getall/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "User_Create", {
        get: function () { return '/Inventory/create/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "User_Update", {
        get: function () { return '/Inventory/update/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "User_Delete", {
        get: function () { return '/Inventory/delete/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_All_User", {
        // User Management
        get: function () { return '/User/getall'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "create_User", {
        get: function () { return '/User/create'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "disable_User", {
        get: function () { return '/User/disableuser/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_All_User_By_Org", {
        get: function () { return '/User/getuserByOrganization/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_All_UserRole", {
        // User Authorities
        get: function () { return '/Authorities/getall'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_UserRole_Details", {
        get: function () { return '/Authorities/get/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_All_UserRole_By_Org", {
        get: function () { return '/Authorities/getallbyOrganization/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "create_User_Role", {
        get: function () { return '/Authorities/create'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "update_User_Role", {
        get: function () { return '/Authorities/update'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "disable_User_Role", {
        get: function () { return '/Authorities/disableuserrole/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_all_purchase_order", {
        // Purchase Order
        get: function () { return '/PurchaseOrders/getall'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "upload_file", {
        // Ticket Creation
        get: function () { return '/file/upload'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "get_all_order", {
        //Order
        get: function () { return '/Order/getall'; },
        enumerable: true,
        configurable: true
    });
    Constants = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], Constants);
    return Constants;
}());

//# sourceMappingURL=Constant.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavBarModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// import { NavBarComponent } from './navbarComponent';
var NavBarModule = /** @class */ (function () {
    function NavBarModule() {
    }
    NavBarModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* IonicPageModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* ReactiveFormsModule */]
            ],
            declarations: [],
            entryComponents: [],
            exports: [],
            providers: []
        })
    ], NavBarModule);
    return NavBarModule;
}());

//# sourceMappingURL=navbar.module.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TicketDashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ticket_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ticketDetails_ticketDetailsComponent__ = __webpack_require__(215);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TicketDashboardPage = /** @class */ (function () {
    function TicketDashboardPage(navCtrl, ticketService) {
        this.navCtrl = navCtrl;
        this.ticketService = ticketService;
        this.searchTerm = '';
        this.searchQuery = '';
    }
    TicketDashboardPage.prototype.add_Ticketlist = function () {
        var _this = this;
        this.ticketService.getAllTicket().subscribe(function (data) {
            _this.Ticketslist = data;
            _this.listOfTicketItems = data;
            console.log("list of tickets are --- ", _this.Ticketslist);
        }, function (error) {
            console.log('something went wrong');
        });
    };
    TicketDashboardPage.prototype.ionViewDidLoad = function () {
    };
    TicketDashboardPage.prototype.setFilteredItems = function () {
        // const filteredValue = this.dataService.filterItems(this.listOfTicketItems, this.searchTerm);
        var filteredValue = this.filterItems(this.listOfTicketItems, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ");
            this.Ticketslist = this.listOfTicketItems;
        }
        else {
            console.log("entering into else part");
            this.Ticketslist = filteredValue;
        }
    };
    TicketDashboardPage.prototype.filterItems = function (items, searchTerm) {
        if (searchTerm === '') {
            return false;
        }
        else {
            return items.filter(function (item) {
                if (item.assigned_to.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                    item.created_by.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                    item.Date.indexOf(searchTerm) > -1 ||
                    item.uuid.indexOf(searchTerm) > -1 ||
                    item.Status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
                for (var i = 0; i < item.order.length; i++) {
                    if (item.order[i].uuid.indexOf(searchTerm) > -1) {
                        return true;
                    }
                }
            });
        }
    };
    TicketDashboardPage.prototype.filterOrder = function () {
        console.log("---->Filter Clicked ------------ >  ");
        // this.navCtrl.setRoot(OrderFilterComponent);
    };
    TicketDashboardPage.prototype.displayTicketDetails = function (ticket) {
        console.log("----> ticket details--> ", ticket);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__ticketDetails_ticketDetailsComponent__["a" /* TicketDetailsComponent */], {
            ticketUuid: ticket.uuid
        });
        // this.navCtrl.setRoot(OrderDetailsComponent);
    };
    TicketDashboardPage.prototype.ngOnInit = function () {
        this.add_Ticketlist();
    };
    TicketDashboardPage.prototype.getItems = function (ev) {
        console.log("get selected itemsa reare ----- >>> ", ev);
        this.Ticketslist = this.Ticketslist;
        // console.log("allticket to be filtered are ----- ", this.allTicketsToFilter)
        console.log("list of tickets are ---- ", this.Ticketslist);
        var val = ev.target.value;
        if (val && val.trim() != '') {
            this.Ticketslist = Object(this.Ticketslist).filter(function (item) {
                return (item.assigned_to.firstname.toLowerCase().indexOf(val) > -1);
            });
        }
    };
    TicketDashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-ticketdashboard',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/ticketdashboard.html"*/'<ion-header>\n    <ion-navbar class="header" hideBackButton>\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <!-- <img height="40" class="nav-logo" src="assets/imgs/stahls.png"> -->\n            <span class="header-title">STAHLS</span>\n            <!-- <button ion-button> -->\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n            <!-- </button>   -->\n        </div>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content class="page-con">\n    <span class="dash-title">Tickets</span>\n    <div class="searchbar-top">\n        <ion-searchbar [(ngModel)]="searchTerm" (ionInput)="setFilteredItems()"></ion-searchbar>\n        <a (click)="filterOrder()"> Filter/Sort by</a>\n    </div>\n    <ion-list>\n        <ion-item *ngFor="let item of Ticketslist">\n            <ion-card (click)="displayTicketDetails(item)">\n                <ion-card-content class="dashCard">\n                    <ion-card-title>\n                        <h3><b>{{item.uuid}}</b></h3>\n                        <ion-badge item-end>{{item.Status}}</ion-badge>\n                    </ion-card-title>\n                    <ion-list>\n                        <br/>\n                        <span>Date: {{item.Date | date: \'yyyy-MM-dd\'}}</span>\n                        <br/>\n                        <span>OrderNumber:&nbsp;\n                            <span *ngIf="item.order.length === 0">none</span>\n                            <span *ngIf="item.order.length > 0">\n                                <div *ngFor="let orderItem of item.order">{{orderItem.uuid}}&nbsp;&nbsp;</div>\n                            </span>\n                        </span>\n                        <br/>\n                        <span>CreatedBy: {{item.created_by.firstname}}</span>\n                        <br/>\n                        <span>AssignedUser: {{item.assigned_to.firstname}}</span>\n                    </ion-list>\n                </ion-card-content>\n            </ion-card>\n        </ion-item>\n    </ion-list>\n\n\n\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/ticketdashboard.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ticket_service__["a" /* TicketService */]])
    ], TicketDashboardPage);
    return TicketDashboardPage;
}());

//# sourceMappingURL=ticketdashboard.js.map

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TicketDetailsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ticket_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__closeTicket_closeTicketComponent__ = __webpack_require__(216);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TicketDetailsComponent = /** @class */ (function () {
    function TicketDetailsComponent(navParam, navCtrl, ticketService) {
        this.navParam = navParam;
        this.navCtrl = navCtrl;
        this.ticketService = ticketService;
    }
    TicketDetailsComponent.prototype.ngOnInit = function () {
        var test = this.navParam.get('params');
        console.log('-----------test---------', test);
        this.check = test;
        this.getAllTicket();
    };
    TicketDetailsComponent.prototype.getAllTicket = function () {
        var _this = this;
        var uuid = this.navParam.get('ticketUuid');
        console.log("uuid of selected tickets are --- ", uuid);
        this.ticketService.getTicketByUuid(uuid).subscribe(function (data) {
            _this.ticket = data;
            console.log("list of ticket in details are ----- ", data);
        }, function (error) {
            console.log("something went wrong");
        });
    };
    TicketDetailsComponent.prototype.closeTicket = function () {
        console.log("uuid of selected tickets are --- ", this.ticket);
        console.log("opening close ticket modal are ");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__closeTicket_closeTicketComponent__["a" /* CloseTicketComponent */], { param1: this.ticket });
    };
    TicketDetailsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-ticketDetails',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/ticketDetails/ticketDetails.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row padding>\n            <ion-col>\n                <div>\n                    <h5>Ticket ID</h5>\n                </div>\n                <div>\n                    <h3>{{ticket?.uuid}}</h3>\n                </div>\n            </ion-col>\n            <ion-col end>\n                <button ion-button float-right>{{ticket?.Status}}</button>\n            </ion-col>\n        </ion-row>\n        <!-- <ion-row padding>\n            <button ion-button float-left ion-start>\n                <ion-icon name="download"></ion-icon>&nbsp; Download attachments\n            </button>\n        </ion-row> -->\n        <ion-row class="createdByRow" padding>\n            Created by: &nbsp;\n            <span>\n                <h5>{{ticket?.created_by.username}}</h5>\n            </span>\n        </ion-row>\n        <ion-row class="assignedToRow" padding>\n            Assigned to: &nbsp;\n            <span>\n                <h5>{{ticket?.assigned_to.username}}</h5>\n            </span>\n        </ion-row>\n        <ion-row padding>\n            <h5>{{ticket?.Date | date:\'dd/MM/yyyy\'}} - </h5>&nbsp;\n            <span *ngIf="ticket?.Type === \'Urgent\'" style="color:red"><strong>{{ticket?.Type}}</strong></span>\n            <span *ngIf="ticket?.Type === \'Regular\'" style="color:green"><strong>{{ticket?.Type}}</strong></span>\n        </ion-row>\n        <ion-item-divider></ion-item-divider>\n        <ion-row padding class="descriptionRow">\n            <span><strong>Description: </strong>{{ticket?.description}}</span>\n        </ion-row>\n        <ion-row padding class="descriptionRow">\n            <span><strong>**Closing Reason:</strong>{{check}}</span>\n        </ion-row>\n\n        <ion-item-divider></ion-item-divider>\n        <ion-row padding>\n            <ion-card class="infoCard">\n                <ion-card-content>\n                    <div>this is the information</div>\n                    <div>by: {{ticket?.created_by.username}} - {{ticket?.Date | date:\'dd/MM/yyyy\'}}</div>\n                </ion-card-content>\n            </ion-card>\n        </ion-row>\n        <ion-row padding>\n            <div>\n                <h4 class="orderText">Orders associated to this ticket</h4>\n             <ion-item>\n                    <ion-badge item-start color="secondary" *ngFor="let order of ticket?.order">{{order?.uuid}}</ion-badge>\n                </ion-item>\n            </div>\n        </ion-row>\n        <ion-row padding class="buttonRow">\n            <button class="sendButton" ion-button full>Send message</button>\n        </ion-row>\n        <ion-row padding class="buttonRow">\n            <button ion-button full (click)="closeTicket()">close Ticket</button>\n        </ion-row>\n        <ion-row padding class="buttonRow">\n            <button class="reopenButton" ion-button full>Reopen Ticket</button>\n        </ion-row>\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/ticketDetails/ticketDetails.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ticket_service__["a" /* TicketService */]])
    ], TicketDetailsComponent);
    return TicketDetailsComponent;
}());

//# sourceMappingURL=ticketDetailsComponent.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CloseTicketComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ticket_service__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CloseTicketComponent = /** @class */ (function () {
    function CloseTicketComponent(navCtrl, navParam, ticketService) {
        this.navCtrl = navCtrl;
        this.navParam = navParam;
        this.ticketService = ticketService;
    }
    CloseTicketComponent.prototype.ngOnInit = function () {
        var test = this.navParam.get('param1');
        this.closeTicketOption(test);
        console.log('----------test------------', test.uuid);
    };
    CloseTicketComponent.prototype.getReason = function () {
    };
    CloseTicketComponent.prototype.closeTicketOption = function (test) {
        var value = 'It was Solved';
        // this.navCtrl.push(TicketDetailsComponent,{params:value});
    };
    CloseTicketComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-closeTicket',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/closeTicket/closeTicket.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n<ion-content>\n    <ion-grid>\n        <ion-row padding>\n            <ion-col>\n                <div>\n                    <h5>Ticket ID</h5>\n                </div>\n                <div>\n                    <h3>2341234</h3>\n                </div>\n            </ion-col>\n            <ion-col end>\n                <button ion-button float-right>In progress</button>\n            </ion-col>\n        </ion-row>\n        <ion-row padding>\n            <h4>\n                <b>You are closing this ticket because:</b>\n            </h4>\n        </ion-row>\n        <ion-row>\n            <ion-item>\n                <ion-list>\n                    <button ion-button (click)="closeTicketOption()" full >It was solved</button>\n                    <button ion-button full >It is not important anymore</button> \n                <button ion-button full >It was included on another ticket</button> \n\n                </ion-list>\n            </ion-item>\n        </ion-row>\n    </ion-grid>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/tickets/closeTicket/closeTicket.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ticket_service__["a" /* TicketService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ticket_service__["a" /* TicketService */]) === "function" && _c || Object])
    ], CloseTicketComponent);
    return CloseTicketComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=closeTicketComponent.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseOrderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__purchaseOrderDetails_purchaseOrderDetails_component__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__purchaseOrderFilter_purchaseOrderFilter_component__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__purchaseOrder_service__ = __webpack_require__(220);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PurchaseOrderComponent = /** @class */ (function () {
    function PurchaseOrderComponent(navCtrl, orderService) {
        this.navCtrl = navCtrl;
        this.orderService = orderService;
    }
    PurchaseOrderComponent.prototype.ionViewDidLoad = function () {
    };
    PurchaseOrderComponent.prototype.ngOnInit = function () {
        this.getAllOrders();
        // this.add_orderslist();
    };
    PurchaseOrderComponent.prototype.getAllOrders = function () {
        var _this = this;
        this.orderService.getAllPurchaseOrdes().subscribe(function (data) {
            console.log("---purchased order are --->>> ", data);
            _this.allOrderssToFilter = data;
            _this.orderslist = data;
        }, function (error) {
            console.log("--error-->>", error);
        });
    };
    PurchaseOrderComponent.prototype.filterOrder = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__purchaseOrderFilter_purchaseOrderFilter_component__["a" /* PurchaseOrderFilterComponent */]);
    };
    PurchaseOrderComponent.prototype.displayOrderDetails = function (order) {
        console.log("----> order details--> ", order);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__purchaseOrderDetails_purchaseOrderDetails_component__["a" /* PurchaseOrderDetailsComponent */], {
            orderDetails: order
        });
    };
    PurchaseOrderComponent.prototype.add_orderslist = function () {
        // this.allOrderssToFilter = [
        //   {
        //     "orderId": "435678",
        //     "Location": "DFC",
        //     "PO": "123456789",
        //     "Date": "04/09/2018",
        //     "Tickets": 2,
        //     "status": "In Progress"
        //   },
        //   {
        //     "orderId": "09876",
        //     "Location": "NEW Balance",
        //     "PO": "5666",
        //     "Date": "02/03/2018",
        //     "Tickets": 7,
        //     "status": "Recieved"
        //   }
        // ]
        // this.orderslist = this.allOrderssToFilter;
    };
    PurchaseOrderComponent.prototype.setFilteredItems = function () {
        // const filteredValue = this.dataService.filterItems(this.listOfTicketItems, this.searchTerm);
        var filteredValue = this.filterItems(this.allOrderssToFilter, this.searchTerm);
        console.log("searched ticket are --- ", filteredValue);
        if (filteredValue === false) {
            console.log("entering into filteredd valeus ");
            this.orderslist = this.allOrderssToFilter;
        }
        else {
            console.log("entering into else part");
            this.orderslist = filteredValue;
        }
    };
    PurchaseOrderComponent.prototype.filterItems = function (items, searchTerm) {
        if (searchTerm === '') {
            return false;
        }
        else {
            return items.filter(function (item) {
                console.log("entering into -item ---- ", item);
                if (item.loc.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.customer.toLowerCase().search(searchTerm.toLowerCase()) > -1 ||
                    item.forcastedArrival.toString().search(searchTerm) > -1 ||
                    item.arrivalDate.search(searchTerm) > -1 ||
                    item.uuid.search(searchTerm) > -1 ||
                    item.tickets.toString().search(searchTerm) > -1 ||
                    item.order_status.toLowerCase().search(searchTerm.toLowerCase()) > -1) {
                    return true;
                }
            });
        }
    };
    PurchaseOrderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-purchaseOrder',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrder.html"*/'<ion-header>\n    <ion-navbar class="header" hideBackButton>\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content class="page-con">\n    <span class="dash-title">Purchase Orders</span>\n    <div class="searchbar-top">\n        <ion-searchbar [(ngModel)]="searchTerm" (ionInput)="setFilteredItems()"></ion-searchbar>\n        <a (click)="filterOrder()"> Filter/Sort by</a>\n    </div>\n    <ion-list>\n        <ion-item *ngFor="let item of orderslist">\n            <ion-card (click)="displayOrderDetails(item)">\n                <ion-card-content class="dashCard">\n                    <ion-card-title>\n                        <h3><b>{{item.uuid}}</b></h3>\n                        <ion-badge item-end>{{item.order_status}}</ion-badge>\n                    </ion-card-title>\n                    <ion-list>\n                        <br/>\n                        <span>Location: {{item.loc}}</span>\n                        <br/>\n                        <span>Customer: {{item.customer}}</span>\n                        <br/>\n                        <span>Date: {{item.arrivalDate | date: \'yyyy-MM-dd\'}}</span>\n                        <br/>\n                        <span>Ticksts: {{item.tickets}}</span>\n                        <br/>\n                        <span>Forcasted Arrival: {{item.forcastedArrival}}</span>\n                    </ion-list>\n                </ion-card-content>\n            </ion-card>\n        </ion-item>\n    </ion-list>\n\n\n\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrder.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__purchaseOrder_service__["a" /* PurchaseOrderService */]])
    ], PurchaseOrderComponent);
    return PurchaseOrderComponent;
}());

//# sourceMappingURL=purchaseOrder.component.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseOrderDetailsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tickets_newTicket_newTicketComponent__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__purchaseOrderFilter_purchaseOrderFilter_component__ = __webpack_require__(110);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PurchaseOrderDetailsComponent = /** @class */ (function () {
    function PurchaseOrderDetailsComponent(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.expandindex = null;
    }
    PurchaseOrderDetailsComponent.prototype.ngOnInit = function () {
        this.orderDetails = this.navParams.get('orderDetails');
        console.log("inside init-->> ", this.orderDetails);
    };
    PurchaseOrderDetailsComponent.prototype.ionViewDidLoad = function () {
        this.viewCtrl.setBackButtonText('');
    };
    PurchaseOrderDetailsComponent.prototype.filterOrder = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__purchaseOrderFilter_purchaseOrderFilter_component__["a" /* PurchaseOrderFilterComponent */]);
    };
    PurchaseOrderDetailsComponent.prototype.showDetails = function (index) {
        console.log("---->> ", index);
        this.expandindex = index;
    };
    PurchaseOrderDetailsComponent.prototype.hideDetails = function () {
        this.expandindex = null;
    };
    PurchaseOrderDetailsComponent.prototype.gotoNewTicket = function () {
        console.log("---->new ticket--> ");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__tickets_newTicket_newTicketComponent__["a" /* NewTicketComponent */], {});
    };
    PurchaseOrderDetailsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-purchaseOrderDetails',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrderDetails/purchaseOrderDetails.html"*/'<ion-header>\n    <ion-navbar class="header">\n        <button ion-button menuToggle>\n            <ion-icon class="menu-icon" name="menu"></ion-icon>\n        </button>\n        <div class="logo-container">\n            <span class="header-title">STAHLS</span>\n            <ion-icon class="noti-icon" name="notifications"></ion-icon>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n    <ion-card>\n        <ion-card-content class="">\n            <span class="orderid">{{orderDetails.uuid}}</span>\n            <ion-badge item-end>{{orderDetails.order_status}}</ion-badge>\n            <div class="details-box">\n                <span>Location: {{orderDetails.loc}}</span>\n                <br/>\n                <span>Date: {{orderDetails.date}}</span>\n                <br/>\n                <span>Forcasted Arrival:</span>\n                <br/>\n                <span>Arrival Date: {{orderDetails.arrivalDate}}</span>\n            </div>\n            <!-- <ion-item>\n                Tracking Info\n            </ion-item> -->\n        </ion-card-content>\n    </ion-card>\n    <ion-item class="title-divider">\n        Customer\n    </ion-item>\n    <ion-card>\n        <ion-card-content class="">\n            <div class="details-box">\n                <span>ID: {{orderDetails.uuid}}</span>\n                <br/>\n                <span>Name: {{orderDetails.customer}}</span>\n            </div>\n            <!-- <ion-item>\n                    Tracking Info\n                </ion-item> -->\n        </ion-card-content>\n    </ion-card>\n    <ion-item class="title-divider">\n        Items included in this PO\n    </ion-item>\n    <ion-item class="qty-header">\n        <span style="margin-left: 15px;">Qty.</span>\n        <a class="sort-filter" (click)="filterOrder()"> Sort/Filter by</a>\n    </ion-item>\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 1" class="details-badge" item-end (click)="showDetails(1)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 1" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 1">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <!-- <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 2" class="details-badge" item-end (click)="showDetails(2)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 2" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 2">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 3" class="details-badge" item-end (click)="showDetails(3)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 3" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 3">\n                    Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-row>\n        </ion-grid>\n    </ion-item>\n\n    <ion-item class="qty-details">\n        <ion-grid>\n            <ion-row>\n                <ion-col col-2 style="font-size: 65px;">\n                    3\n                </ion-col>\n                <ion-col col-10>\n                    Style: TMWK770\n                    <ion-badge *ngIf="expandindex == null || expandindex != 4" class="details-badge" item-end (click)="showDetails(4)">See more</ion-badge>\n                    <ion-badge *ngIf="expandindex == 4" class="details-badge" item-end (click)="hideDetails()">Hide details</ion-badge>\n                    <br/> Color: TNV\n                    <br/> Price: In progress\n                    <br/> Shipping Method: UPS 2 days\n                    <br/> Artwork Status: Waiting for approval\n                </ion-col>\n            </ion-row>\n            <ion-row *ngIf="expandindex == 4">\n                Color: TNV\n                <br/> Price: In progress\n                <br/> Shipping Method: UPS 2 days\n                <br/> Artwork Status: Waiting for approval\n            </ion-row>\n        </ion-grid>\n    </ion-item> -->\n    <ion-item class="title-divider">\n        Ticket associated with this PO\n    </ion-item>\n    <ion-item>\n        <button class="delayed">\n            <span> 04/04/2018 / Solved - Jhon Doe</span>\n        </button>\n        <br/>\n        <br/>\n        <button class="pending">\n            <span>04/04/2018 / Inprogress - Jhon Do</span>\n        </button>\n        <br/>\n        <br/>\n\n        <button ion-button class="btn-filter" (click)="gotoNewTicket()" outline>New Ticket</button>\n    </ion-item>\n</ion-content>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/purchaseOrder/purchaseOrderDetails/purchaseOrderDetails.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */]])
    ], PurchaseOrderDetailsComponent);
    return PurchaseOrderDetailsComponent;
}());

//# sourceMappingURL=purchaseOrderDetails.component.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseOrderService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config_service__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_api_service__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_Constant__ = __webpack_require__(212);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PurchaseOrderService = /** @class */ (function () {
    function PurchaseOrderService(_http, config, apiService) {
        this._http = _http;
        this.config = config;
        this.apiService = apiService;
    }
    PurchaseOrderService.prototype.getAllPurchaseOrdes = function () {
        console.log('____gInventory Services----- > ');
        return this.apiService.get(this.config.api_url + __WEBPACK_IMPORTED_MODULE_4__config_Constant__["a" /* Constants */].get_all_purchase_order);
    };
    PurchaseOrderService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1__config_config_service__["a" /* ConfigService */], __WEBPACK_IMPORTED_MODULE_2__config_api_service__["a" /* ApiService */]])
    ], PurchaseOrderService);
    return PurchaseOrderService;
}());

//# sourceMappingURL=purchaseOrder.service.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(242);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_order_order_module__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_dashboard_dashboard_module__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tickets_ticket_module__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ngx_avatar__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ngx_avatar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_ngx_avatar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_login_login_service__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__config_api_service__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_http__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_common_http__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__shared_shared_service__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_purchaseOrder_purchaseOrder_module__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__config_config_service__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_navbar_navbar_module__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__app_interceptor__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_navbar_navbarComponent__ = __webpack_require__(307);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_navbar_navbarComponent__["a" /* NavBarComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_13__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_10_ngx_avatar__["AvatarModule"],
                __WEBPACK_IMPORTED_MODULE_5__pages_order_order_module__["a" /* OrderModule */],
                __WEBPACK_IMPORTED_MODULE_6__pages_dashboard_dashboard_module__["a" /* DashboardModule */],
                __WEBPACK_IMPORTED_MODULE_7__pages_tickets_ticket_module__["a" /* TicketModule */],
                __WEBPACK_IMPORTED_MODULE_18__pages_navbar_navbar_module__["a" /* NavBarModule */],
                __WEBPACK_IMPORTED_MODULE_16__pages_purchaseOrder_purchaseOrder_module__["a" /* PurchaseOrderModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_navbar_navbarComponent__["a" /* NavBarComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_15__shared_shared_service__["a" /* SharedService */],
                __WEBPACK_IMPORTED_MODULE_11__pages_login_login_service__["a" /* LoginService */],
                __WEBPACK_IMPORTED_MODULE_12__config_api_service__["a" /* ApiService */],
                __WEBPACK_IMPORTED_MODULE_17__config_config_service__["a" /* ConfigService */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_19__app_interceptor__["a" /* AppInterceptor */],
                    multi: true
                }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(104);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import { OrderComponent } from '../pages/order/OrderComponent';
// import { DashboardPage } from '../pages/dashboard/dashboard';
// import { TicketDashboardPage } from '../pages/tickets/ticketdashboard';
// import { PurchaseOrderComponent } from '../pages/purchaseOrder/purchaseOrder.component';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        // @ViewChild(NavBarComponent) sideMenu: NavBarComponent;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
        //   // used for an example of ngFor and navigation
        //   this.pages = [
        //     { title: 'Dashboard', component: DashboardPage },
        //     { title: 'Orders', component: OrderComponent },
        //     { title: 'Tickets', component: TicketDashboardPage },
        //     { title: 'Purchase Order', component: PurchaseOrderComponent }
        //   ];
        //   const json = JSON.parse(sessionStorage.getItem('currentuser'));
        //   console.log("user details in nav bar are ----- ", json);
        // if(json != null && json != undefined){
        //   console.log("user details only --- ", json.user);
        //   if(json.user.Authorities.length > 0){
        //   json.user.Authorities[0].role = json.user.Authorities[0].role.toLowerCase();
        //   this.userDetails = json.user;
        //   }
        // }
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/app/app.html"*/'<ion-menu class="stahls-menu" [content]="content">\n\n<page-navbar></page-navbar>\n  \n  </ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false" class="mymenu"></ion-nav>'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OrderComponent__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__orderDetails_orderDetailsComponent__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__order_service__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var OrderModule = /** @class */ (function () {
    function OrderModule() {
    }
    OrderModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["g" /* IonicPageModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__OrderComponent__["a" /* OrderComponent */],
                __WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__["a" /* OrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_4__orderDetails_orderDetailsComponent__["a" /* OrderDetailsComponent */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__OrderComponent__["a" /* OrderComponent */],
                __WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__["a" /* OrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_4__orderDetails_orderDetailsComponent__["a" /* OrderDetailsComponent */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__OrderComponent__["a" /* OrderComponent */],
                __WEBPACK_IMPORTED_MODULE_3__orderFilter_orderFilterComponent__["a" /* OrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_4__orderDetails_orderDetailsComponent__["a" /* OrderDetailsComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__order_service__["a" /* OrderService */]
            ],
        })
    ], OrderModule);
    return OrderModule;
}());

//# sourceMappingURL=order.module.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dashboard__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_module__ = __webpack_require__(213);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var DashboardModule = /** @class */ (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* IonicPageModule */],
                __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_module__["a" /* NavBarModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__dashboard__["a" /* DashboardPage */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__dashboard__["a" /* DashboardPage */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_3__dashboard__["a" /* DashboardPage */]
            ]
        })
    ], DashboardModule);
    return DashboardModule;
}());

//# sourceMappingURL=dashboard.module.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TicketModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ticketdashboard__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__newTicket_newTicketComponent__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__newTicket2_newTicket2Component__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ticketDetails_ticketDetailsComponent__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__closeTicket_closeTicketComponent__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ticket_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_forms__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var TicketModule = /** @class */ (function () {
    function TicketModule() {
    }
    TicketModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* IonicPageModule */],
                __WEBPACK_IMPORTED_MODULE_9__angular_forms__["d" /* ReactiveFormsModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__ticketdashboard__["a" /* TicketDashboardPage */],
                __WEBPACK_IMPORTED_MODULE_4__newTicket_newTicketComponent__["a" /* NewTicketComponent */],
                __WEBPACK_IMPORTED_MODULE_5__newTicket2_newTicket2Component__["a" /* NewTicket2Component */],
                __WEBPACK_IMPORTED_MODULE_6__ticketDetails_ticketDetailsComponent__["a" /* TicketDetailsComponent */],
                __WEBPACK_IMPORTED_MODULE_7__closeTicket_closeTicketComponent__["a" /* CloseTicketComponent */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__ticketdashboard__["a" /* TicketDashboardPage */],
                __WEBPACK_IMPORTED_MODULE_4__newTicket_newTicketComponent__["a" /* NewTicketComponent */],
                __WEBPACK_IMPORTED_MODULE_5__newTicket2_newTicket2Component__["a" /* NewTicket2Component */],
                __WEBPACK_IMPORTED_MODULE_6__ticketDetails_ticketDetailsComponent__["a" /* TicketDetailsComponent */],
                __WEBPACK_IMPORTED_MODULE_7__closeTicket_closeTicketComponent__["a" /* CloseTicketComponent */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__ticketdashboard__["a" /* TicketDashboardPage */],
                __WEBPACK_IMPORTED_MODULE_4__newTicket_newTicketComponent__["a" /* NewTicketComponent */],
                __WEBPACK_IMPORTED_MODULE_5__newTicket2_newTicket2Component__["a" /* NewTicket2Component */],
                __WEBPACK_IMPORTED_MODULE_6__ticketDetails_ticketDetailsComponent__["a" /* TicketDetailsComponent */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_8__ticket_service__["a" /* TicketService */]]
        })
    ], TicketModule);
    return TicketModule;
}());

//# sourceMappingURL=ticket.module.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseOrderModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__purchaseOrder_component__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__purchaseOrderFilter_purchaseOrderFilter_component__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__purchaseOrderDetails_purchaseOrderDetails_component__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__purchaseOrder_service__ = __webpack_require__(220);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var PurchaseOrderModule = /** @class */ (function () {
    function PurchaseOrderModule() {
    }
    PurchaseOrderModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* IonicPageModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__purchaseOrder_component__["a" /* PurchaseOrderComponent */],
                __WEBPACK_IMPORTED_MODULE_4__purchaseOrderFilter_purchaseOrderFilter_component__["a" /* PurchaseOrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_5__purchaseOrderDetails_purchaseOrderDetails_component__["a" /* PurchaseOrderDetailsComponent */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__purchaseOrder_component__["a" /* PurchaseOrderComponent */],
                __WEBPACK_IMPORTED_MODULE_4__purchaseOrderFilter_purchaseOrderFilter_component__["a" /* PurchaseOrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_5__purchaseOrderDetails_purchaseOrderDetails_component__["a" /* PurchaseOrderDetailsComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__purchaseOrder_service__["a" /* PurchaseOrderService */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__purchaseOrder_component__["a" /* PurchaseOrderComponent */],
                __WEBPACK_IMPORTED_MODULE_4__purchaseOrderFilter_purchaseOrderFilter_component__["a" /* PurchaseOrderFilterComponent */],
                __WEBPACK_IMPORTED_MODULE_5__purchaseOrderDetails_purchaseOrderDetails_component__["a" /* PurchaseOrderDetailsComponent */]
            ]
        })
    ], PurchaseOrderModule);
    return PurchaseOrderModule;
}());

//# sourceMappingURL=purchaseOrder.module.js.map

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppInterceptor = /** @class */ (function () {
    function AppInterceptor() {
    }
    AppInterceptor.prototype.intercept = function (req, next) {
        var token = JSON.parse(sessionStorage.getItem('token'));
        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "bearer " + token
            }
        });
        return next.handle(req);
    };
    AppInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], AppInterceptor);
    return AppInterceptor;
}());

//# sourceMappingURL=app.interceptor.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__order_OrderComponent__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dashboard_dashboard__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tickets_ticketdashboard__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__purchaseOrder_purchaseOrder_component__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(104);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var NavBarComponent = /** @class */ (function () {
    function NavBarComponent(events, app, menuCtrl) {
        this.events = events;
        this.app = app;
        this.menuCtrl = menuCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */];
        this.pages = [];
    }
    NavBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Dashboard', component: __WEBPACK_IMPORTED_MODULE_3__dashboard_dashboard__["a" /* DashboardPage */] },
            { title: 'Orders', component: __WEBPACK_IMPORTED_MODULE_2__order_OrderComponent__["a" /* OrderComponent */] },
            { title: 'Tickets', component: __WEBPACK_IMPORTED_MODULE_4__tickets_ticketdashboard__["a" /* TicketDashboardPage */] },
            { title: 'Purchase Order', component: __WEBPACK_IMPORTED_MODULE_5__purchaseOrder_purchaseOrder_component__["a" /* PurchaseOrderComponent */] }
        ];
        this.events.subscribe('user:created', function (currentUser) {
            // user and time are the same arguments passed in `events.publish(user, time)`
            _this.userDetails = currentUser.user;
            console.log('@@@@@@@  Welcome', currentUser);
        });
    };
    NavBarComponent.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        console.log("page of data ----- ", page);
        // this.nav.push(page.component.name);
        this.app.getRootNav().setRoot(page.component);
    };
    NavBarComponent.prototype.logout = function () {
        sessionStorage.removeItem('currentuser');
        sessionStorage.removeItem('token');
        this.events.unsubscribe('user:created', function () {
            console.log('unsubscribed ----');
        });
        this.menuCtrl.close();
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
    };
    NavBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-navbar',template:/*ion-inline-start:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/navbar/navbar.html"*/'<!-- <ion-menu class="stahls-menu" [content]="content"> -->\n    <ion-header style="background: #030e2f;">\n      <!-- <div style="display: inline-flex;">\n        <ngx-avatar src="assets/imgs/New-Balance-logo.png" [round]="true"></ngx-avatar>\n        <div class="header-s-text">\n            <span>John Doe - </span><span class="s-user-role">Admin</span>\n        </div>\n      </div> -->\n      <div style="display: -webkit-inline-box;">\n        <ngx-avatar src={{userDetails?.organization?.orgImage}}  [round]="true">\n        </ngx-avatar>\n        <div class="avatar-text">\n          <span>{{userDetails?.firstname}}</span>\n          <!-- <i class="fa fa-caret-down" aria-hidden="true"></i> -->\n          <br>\n        </div>\n        </div>\n        <div class="avatar-role">\n          <span><b>{{userDetails?.Authorities[0]?.role}}</b></span>\n          <!-- <span *ngIf="userDetails?.Authorities[0]?.role != \'ROLE_ADMIN\'">User</span> -->\n        </div>\n      \n    </ion-header>\n  <br><br><br>\n    <ion-content class="navBarContent">\n        <button menuClose ion-item class="menulist" *ngFor="let p of pages" (click)="openPage(p)">\n          {{p.title}}\n        </button>\n    </ion-content>\n    \n    <ion-footer>\n      <div style="    text-align: -webkit-center !important;\n      margin-top: 5%">\n        <div class="logoutDiv" (click)="logout()"><u>logout</u></div>\n        <br>\n      <ngx-avatar *ngIf="userDetails?.organization?.organizationname !== \'Stahls\'" src="assets/img/logo.png"  [round]="false">\n      </ngx-avatar>\n      <br/>\n      </div>\n    </ion-footer>\n  \n  <!-- </ion-menu> -->'/*ion-inline-end:"/home/ten-decoders/Desktop/apparel-dashboard/mobile_ios_version_1/src/pages/navbar/navbar.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */]])
    ], NavBarComponent);
    return NavBarComponent;
}());

//# sourceMappingURL=navbarComponent.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_ErrorObservable__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_ErrorObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_observable_ErrorObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ApiService = /** @class */ (function () {
    function ApiService(http) {
        this.http = http;
        this.token = "";
    }
    ApiService.prototype.formatErrors = function (httpresponse) {
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_ErrorObservable__["ErrorObservable"](httpresponse);
    };
    ApiService.prototype.get = function (path, params) {
        if (params === void 0) { params = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpParams */](); }
        return this.http.get("" + path, { params: params })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__["catchError"])(this.formatErrors));
    };
    ApiService.prototype.put = function (path, body) {
        if (body === void 0) { body = {}; }
        return this.http.put("" + path, JSON.stringify(body)).pipe(Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__["catchError"])(this.formatErrors));
    };
    ApiService.prototype.post = function (path, body) {
        if (body === void 0) { body = {}; }
        return this.http.post("" + path, JSON.stringify(body)).pipe(Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__["catchError"])(this.formatErrors));
    };
    ApiService.prototype.delete = function (path) {
        return this.http.delete("" + path).pipe(Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_operators_catchError__["catchError"])(this.formatErrors));
    };
    ApiService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], ApiService);
    return ApiService;
}());

//# sourceMappingURL=api.service.js.map

/***/ }),

/***/ 43:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TicketService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_api_service__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_config_service__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// import { Constants } from "../../config/Constant";

var TicketService = /** @class */ (function () {
    function TicketService(_http, apiService, configService) {
        this._http = _http;
        this.apiService = apiService;
        this.configService = configService;
    }
    TicketService.prototype.getAllTicket = function () {
        return this.apiService.get(this.configService.api_url + '/Ticket/getall');
    };
    TicketService.prototype.saveTicket = function (ticket) {
        return this.apiService.post(this.configService.api_url + '/Ticket/create', ticket);
    };
    TicketService.prototype.getTicketByUuid = function (uuid) {
        return this.apiService.get(this.configService.api_url + ("/Ticket/get/" + uuid));
    };
    TicketService.prototype.getReason = function () {
        return this.apiService.get(this.configService.api_url + '/CloseReason/getreason');
    };
    TicketService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1__config_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_2__config_config_service__["a" /* ConfigService */]])
    ], TicketService);
    return TicketService;
}());

//# sourceMappingURL=ticket.service.js.map

/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_shared_service__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfigService = /** @class */ (function () {
    function ConfigService(restapi) {
        this.restapi = restapi;
        this._api_url = this.restapi.baseUrl + '/api'; // this.restapi.baseUrl+
        this._auth_url = this.restapi.baseUrl + '/auth'; // this.restapi.baseUrl+
        this._login_url = this._auth_url + '/login';
        this._logout_url = this._auth_url + '/logout';
    }
    Object.defineProperty(ConfigService.prototype, "api_url", {
        get: function () { return this._api_url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigService.prototype, "login_url", {
        get: function () { return this._login_url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigService.prototype, "logout_url", {
        get: function () { return this._logout_url; },
        enumerable: true,
        configurable: true
    });
    ConfigService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__shared_shared_service__["a" /* SharedService */]])
    ], ConfigService);
    return ConfigService;
}());

//# sourceMappingURL=config.service.js.map

/***/ })

},[221]);
//# sourceMappingURL=main.js.map