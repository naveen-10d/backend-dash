import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from './ForgotPassword.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app-ForgotPassword',
    templateUrl: './ForgotPassword.component.html',
    styleUrls: ['./ForgotPassword.component.css']
  })
  
  export class ForgotPasswordComponent implements OnInit {
    data: any = {};
    spinnerlogo = false;
    errorDiagnostic: String;
    urlDirect: String;
    submitted = false;
    public token: any;
    public users:any ;
    public updateduser: any;
    @ViewChild('ForgotPassword')
    ForgotPassword: ModalComponent;
  
    constructor(private route: ActivatedRoute,private forgotservice: ForgotPasswordService,private router: Router){}
    ngOnInit() {
      this.users = [];
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        this.token = params['token'];
        console.log('----------Token------>>>>', token);
      });
      this.forgotservice.updatepassword(this.token).subscribe(data=>{
        // console.log('----------Data----->>>', data);
        this.users.push(data);
        console.log('-------User----->>>>', this.users);
      },error=>{
        console.log('------error-------',error);
      });
    }
    OpenDialog() {
      this.ForgotPassword.open();
    }
    closeOption() {
      this.ForgotPassword.close();
      this.router.navigate([''])
    }

      onSubmit(){
        this.spinnerlogo = true;
        this.submitted = true;
        this.errorDiagnostic = null;
        console.log('----------NewPassword------>>>>', this.data.password);
        console.log('----------ConfirmPassword------>>>>', this.data.confirmpassword);
        // console.log('-------User----->>>>', this.users);
        this.users.forEach(element => {
          // console.log('----------Users----->>>>',element);
          element.forEach(user => {
            console.log('-------Password-------->>>',user.password);
            user.password = this.data.confirmpassword;
          });
        });
        this.users.forEach(test => {
          this.updateduser = test;
        });
        console.log('-------User----->>>>', this.updateduser);
        this.forgotservice.updateUser(this.updateduser).subscribe(data=>{
          console.log('-----------Updateddata---->>>>>',data);
          this.router.navigate([''])
        },error=>{
          console.log('------Error----->>>>>>',error);
        })
      }
  }
