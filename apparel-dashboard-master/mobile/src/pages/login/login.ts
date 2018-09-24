import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { LoginService } from '../../shared';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  public username: String = "";
  public password: String = "";

  constructor(
    private alertCtrl: AlertController,
    private menu: MenuController,
    public navCtrl: NavController,
    public loginService: LoginService) {

  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  afterlogin() {
    this.navCtrl.push(DashboardPage);
    // var data = {
    //   "username": this.username,
    //   "password": this.password
    // }
    // // if(data.username !== "" && data.password !== "")
    // this.loginService.login(data).subscribe((data) => {
    //   console.log("------>>> ", data)
    //   sessionStorage.setItem('currentuser', JSON.stringify(data))
    //   if (data.user.uuid !== "" || data.user.uuid !== null) {
    //     this.navCtrl.push(DashboardPage);
    //   }
    // },
    //   (error) => {
    //     console.log("--error-->>", error);
    //     this.navCtrl.push(DashboardPage);
    //     // this.presentAlert('Wrong Credentials Entered..!');
    //   });
  }

  public presentAlert(message: string): void {
    let alert = this.alertCtrl.create({
      title: 'Alert..!',
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
            this.username = "",
              this.password = ""
          }
        }
      ]
    });
    alert.present();
  }
}