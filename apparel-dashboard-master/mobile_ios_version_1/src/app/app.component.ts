import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
// import { OrderComponent } from '../pages/order/OrderComponent';
// import { DashboardPage } from '../pages/dashboard/dashboard';
// import { TicketDashboardPage } from '../pages/tickets/ticketdashboard';
// import { PurchaseOrderComponent } from '../pages/purchaseOrder/purchaseOrder.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // @ViewChild(NavBarComponent) sideMenu: NavBarComponent;
  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  private userDetails: any;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

  //   // used for an example of ngFor and navigation
  //   this.pages = [
  //     { title: 'Dashboard', component: DashboardPage },
  //     { title: 'Orders', component: OrderComponent },
  //     { title: 'Tickets', component: TicketDashboardPage },
  //     { title: 'Purchase Order', component: PurchaseOrderComponent }
  //   ];


  //   const json = JSON.parse(localStorage.getItem('currentuser'));
  //   console.log("user details in nav bar are ----- ", json);
  // if(json != null && json != undefined){
  //   console.log("user details only --- ", json.user);
  //   if(json.user.Authorities.length > 0){
  //   json.user.Authorities[0].role = json.user.Authorities[0].role.toLowerCase();
  //   this.userDetails = json.user;
  //   }
    
  // }
}

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
