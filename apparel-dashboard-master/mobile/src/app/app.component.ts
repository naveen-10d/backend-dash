import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SideMenuContentComponent } from '../pages/side-menu-content/side-menu-content.component';
import { MenuOptionModel } from '../pages/side-menu-content/models/menu-option-model';
import { SideMenuSettings } from '../pages/side-menu-content/models/side-menu-settings';
import { ReplaySubject } from 'rxjs';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TicketCreationPage } from '../pages/tickets/ticketcreation/ticketcreation';
import { TicketDashboardPage } from '../pages/tickets/ticketdashboard/ticketdashboard';
import { LoginPage } from '../pages/login/login';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	rootPage: any = LoginPage;

	public options: Array<MenuOptionModel>;

	constructor(private menuCtrl: MenuController, private alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {

			this.statusBar.styleLightContent();
			this.splashScreen.hide();
			this.initializeOptions();

		});
	}

	private initializeOptions(): void {
		this.options = new Array<MenuOptionModel>();

		// Load simple menu options
		// ------------------------------------------
		this.options.push({
			iconName: 'home',
			displayName: 'Home',
			component: DashboardPage,

			selected: true
		});

		this.options.push({
			displayName: 'Administrator',
			subItems: [
				{
					iconName: 'basket',
					displayName: 'Dashnboard',
					component: DashboardPage
				}
			]
		});

		this.options.push({
			displayName: 'Tickets',
			subItems: [
				{
					iconName: 'basket',
					displayName: 'Dashboard',
					component: TicketDashboardPage
				},
				{
					iconName: 'basket',
					displayName: 'Create Ticket',
					component: TicketCreationPage
				}
			]
		});

		/*   this.options.push({
				   displayName: 'Analytics',
				   subItems: [
					   {
						   iconName: 'basket',
						   displayName: 'Administrator',
						   component: HomePage
					   },
					   {
						   iconName: 'bookmark',
						   displayName: 'User Assignment',
						   component: HomePage
					   },
					   {
						   iconName: 'bookmark',
						   displayName: 'View Reports',
						   component: HomePage
					   }
				   ]
			   });*/

		this.options.push({
			iconName: 'log-out',
			displayName: 'Logout',
			custom: {
				isLogout: true
			}
		});
	}

	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option',
		subOptionIndentation: {
			md: '56px',
			ios: '64px',
			wp: '56px'
		}
	};


	public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {
			if (option.custom && option.custom.isLogout) {
				this.presentAlert('You\'ve clicked the logout option!');
			} else {
				this.nav.setRoot(option.component || LoginPage, { 'title': option.displayName });
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}

	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'Confirmation',
			message: message,
			enableBackdropDismiss: false,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'OK',
					handler: () => {
						this.nav.setRoot(HomePage);
						console.log('Buy clicked');
					}
				}
			]
		});
		alert.present();
	}
}
