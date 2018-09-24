import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public userDetails: any;
  public allowedScreensList = '';
  public allowedScreens = [];
  public imageUrl;
  public organizationname: any;
  public companyCode: any;
  public showSettings:any
  constructor(private loginService: LoginService, private sharedService: SharedService) { 
    
  }

  ngOnInit() {
    console.log("settings---------->",this.showSettings)
    if(JSON.parse(sessionStorage.getItem('showSettings'))!=undefined){
    if(JSON.parse(sessionStorage.getItem('showSettings'))==true){
    this.showSettings=true;
     }else{ this.showSettings=false;}
    }
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization) {
      this.organizationname = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.organizationname;
      this.companyCode = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode;
    }
    this.getCurrentUserDetails();
  }

  Settings(){

    if(this.showSettings){
    this.showSettings=false
    sessionStorage.setItem('showSettings', JSON.stringify(false));
    }else{
      this.showSettings=true;
      sessionStorage.setItem('showSettings', JSON.stringify(true));}
  }

  getCurrentUserDetails() {
    const json = JSON.parse(sessionStorage.getItem('currentUser'));
    json.user.Authorities[0].role = json.user.Authorities[0].role.toLowerCase();
    this.userDetails = json.user;
    if (this.userDetails.organization != null) {
      this.imageUrl = this.sharedService.baseUrl + '/' + this.userDetails.organization.orgImage;
    }
    this.allowedScreensList = this.userDetails.Authorities[0].allowedScreens;
    this.allowedScreens = this.allowedScreensList.split(',');
    console.log('sidenav user details are ----- ', this.allowedScreens);
  }

  logout() {
    this.loginService.logout(this.userDetails).subscribe(
      data => {

      },
      error => {

      }
    );
  }
}
