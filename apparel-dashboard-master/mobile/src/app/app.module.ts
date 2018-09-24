import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CKEditorModule } from 'ngx-ckeditor';
import { ApiService, DashboardService, LoginService, TicketCreationService } from '../shared';
import { AvatarModule } from 'ngx-avatar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ChartPage } from '../pages/chart/chart';
import { TicketCreationPage } from '../pages/tickets/ticketcreation/ticketcreation';
import { TicketDashboardPage } from '../pages/tickets/ticketdashboard/ticketdashboard';
import { TicketDetailsPage } from '../pages/tickets/ticketdetails/ticketdetails';
import { PurchaseOrdersComponent } from '../pages/purchase-orders/purchase-orders.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SharedService } from '../shared.service';
import { SidenavModule} from '../pages/side-menu-content/side_nav_menu.module';
import { OrderModule } from '../pages/order/order.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DashboardPage,
    ChartPage,
    TicketCreationPage,
    TicketDashboardPage,
    TicketDetailsPage,
    PurchaseOrdersComponent
  ],
  imports: [
    AvatarModule,
    BrowserModule,
    CKEditorModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    MaterialModule,
    SidenavModule,
    OrderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ChartPage,
    DashboardPage,
    TicketCreationPage,
    TicketDashboardPage,
    TicketDetailsPage,
    PurchaseOrdersComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    DashboardService,
    LoginService,
    TicketCreationService,
    SharedService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
