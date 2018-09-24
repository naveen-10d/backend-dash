import { Component, OnInit } from "@angular/core";
import { Events, App, MenuController } from 'ionic-angular';
import { OrderComponent } from '../order/OrderComponent';
import { DashboardPage } from '../dashboard/dashboard';
import { TicketDashboardPage } from '../tickets/ticketdashboard';
import { PurchaseOrderComponent } from '../purchaseOrder/purchaseOrder.component';
import { InventoryComponent } from '../Inventory/Inventory.Component';
import { InvoiceComponent } from '../Invoice/InvoiceComponent';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ShipmentComponent } from "../shipment/shipment.component";
import { SharedService } from '../../shared/shared.service';

@Component({
    selector: 'page-navbar',
    templateUrl: 'navbar.html',
})

export class NavBarComponent implements OnInit {
    rootPage: any = LoginPage;


    private pages: any[] = [];
    private baseurl: any;
    private login: any;
    private orgimage: any;
    private userDetails: any;
    private details: any;
    private test: any[] = [];
    constructor(public events: Events, public app: App, private menuCtrl: MenuController, public authService: AuthService,
        private sharedservice: SharedService) {
    }
    ngOnInit() {

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Dashboard', component: DashboardPage },
            { title: 'Orders', component: OrderComponent },
            { title: 'Tickets', component: TicketDashboardPage },
            { title: 'Purchase Order', component: PurchaseOrderComponent },
            { title: 'Inventory', component: InventoryComponent },
            { title: 'Shipment', component: ShipmentComponent },
            { title: 'Invoice', component: InvoiceComponent }
        ];
        this.baseurl = this.sharedservice.baseUrl;
        if (localStorage.getItem('currentuser') != null) {
            this.userDetails = JSON.parse(localStorage.getItem('currentuser')).user
            if (JSON.parse(localStorage.getItem('currentuser')).user.organization !=null){
                this.login = JSON.parse(localStorage.getItem('currentuser')).user.organization.orgImage;
                this.orgimage = this.baseurl + '/' + this.login;
                console.log('-------test--------', this.login);    
            }
        }
        this.events.subscribe('user:created', (currentuser) => {
            this.userDetails = currentuser.user;
            this.test.push(this.userDetails);
            this.test.forEach(element => {
                if (element.organization !== null) {
                    this.details = element.organization.orgImage
                }
            })
            this.orgimage = this.baseurl + '/' + this.details;
            console.log('@@@@@@@  Welcome', this.userDetails);
            console.log('--------test--------', this.orgimage);

        });

        // this.events.subscribe('user:created', (currentuser) => {
        //     this.userDetails = currentuser.user;
        //     this.test.push(this.userDetails);
        //     this.test.forEach(element => {
        //         this.details = element.organization.orgImage
        //     })
        //     this.orgimage = this.baseurl + '/' + this.details;
        //     console.log('@@@@@@@  Welcome', this.userDetails);
        //     console.log('--------test--------', this.orgimage);

        // });


    }


    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        console.log("page of data ----- ", page)
        // this.nav.push(page.component.name);
        this.app.getRootNav().setRoot(page.component)
    }

    logout() {
        localStorage.removeItem('currentuser');
        localStorage.removeItem('token');
        this.authService.logout();
        this.events.unsubscribe('user:created', () => {
            console.log('unsubscribed ----')
        })
        this.menuCtrl.close();
        this.app.getRootNav().setRoot(LoginPage);
    }
}