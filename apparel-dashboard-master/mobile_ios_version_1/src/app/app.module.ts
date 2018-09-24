import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { OrderModule } from '../pages/order/order.module';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { TicketModule } from '../pages/tickets/ticket.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AvatarModule } from 'ngx-avatar';
import { LoginService } from '../pages/login/login.service';
import { ApiService } from '../config/api.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { PurchaseOrderModule } from '../pages/purchaseOrder/purchaseOrder.module';
import {Inventorymodule} from '../pages/Inventory/Inventory.module';
import { Invoicemodule } from '../pages/Invoice/Invoice.module';
import { ConfigService } from '../config/config.service';
import { NavBarModule } from '../pages/navbar/navbar.module';
import { AppInterceptor } from './app.interceptor';
import { NavBarComponent } from '../pages/navbar/navbarComponent';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AuthService } from '../providers/auth-service/auth-service';
import { ShipmentModule } from '../pages/shipment/shipment.module';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AvatarModule,
    OrderModule,
    DashboardModule,
    TicketModule,
    NavBarModule,
    PurchaseOrderModule,
    Inventorymodule,
    Invoicemodule,
    ShipmentModule,
    Ng4LoadingSpinnerModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    NavBarComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SharedService,
    LoginService,
    ApiService,
    ConfigService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    AuthService
  ]
})
export class AppModule { }
