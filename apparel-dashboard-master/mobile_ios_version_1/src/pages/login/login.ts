import { Component } from '@angular/core';
import { NavController, App, MenuController, AlertController, Events, Button } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginService } from './login.service';
import { AuthService } from '../../providers/auth-service/auth-service';

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
    // public navCtrl: NavController,
    protected app: App,
    public loginService: LoginService,
    public events: Events,
    public authService: AuthService,
  ) {

  }
  get navCtrl(): NavController {
    console.log(this.app.getRootNav());
    return this.app.getRootNav();
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewCanEnter() {
    if(localStorage.getItem('currentuser')!==null){
      this.authService.login();
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  afterlogin() {

    var data = {
      "username": this.username,
      "password": this.password
    }
    // if(data.username !== "" && data.password !== "")
    this.loginService.login(data).subscribe((data) => {
      console.log("------>>> ", data)
      this.events.publish('user:created', data);
      localStorage.setItem('currentuser', JSON.stringify(data))
      localStorage.setItem('token', JSON.stringify(data.token))
      //this.authService.login();
      // console.log("-localStorage----->>> ",  localStorage.getItem('currentuser'))

      if (data.user.uuid !== "" || data.user.uuid !== null) {
        this.navCtrl.setRoot(DashboardPage);
      } else {
        console.log("Do NOTHING")
      }
    },
      (error) => {
        console.log("--error-->>", error.status);
        if (error.status === 400) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message:'Username or Password is Incorrect',
            buttons:['Dismiss']
          });
          alert.present();
        }
        if (error.status === 503) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message:'Currenlty this Service is Unavailable',
            buttons:['Dismiss']
          });
          alert.present();
        }

        // this.presentAlert('Wrong Credentials Entered..!');
      });
    // this.navCtrl.setRoot(DashboardPage);

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