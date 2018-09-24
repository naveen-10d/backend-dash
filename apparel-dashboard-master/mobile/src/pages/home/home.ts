import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private menu: MenuController, public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  login() {
    console.log("--------------")
    this.navCtrl.push(LoginPage);
  }

}
