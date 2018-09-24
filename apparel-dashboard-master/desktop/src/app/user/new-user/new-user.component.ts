import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IRole } from '../user-role/IRole';
import { UserService } from '../user.service';
import { Iuser } from '../Iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrganization } from '../../organization/IOrganization';
import { OrganizationService } from '../../organization/organization.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  screensForAction = ['Dashboard', 'Orders', 'Purchase Orders', 'Tickets', 'Invoices', 'Shipments', 'Inventory', 'Users'];

  public roles: IRole[] = [];
  public usrerole: IRole;
  public users: Iuser = {
    'uuid': '',
    'firstname': '',
    'lastname': '',
    'email': '',
    'rol': '',
    'position': '',
    'userimage': '',
    'username': '',
    'password': '',
    'organization': [],
    'Authorities': []
  };

  public orgUUID = '';
  public updateorganization: any;
  public allowedScreens = [];
  public duplicateuser = false;
  public organizationlist;
  public adminrole = false;
  public organization: IOrganization = {
    'id': 0,
    'uuid': '',
    'organizationname': '',
    'orgImage': '',
    'PolypmCompanyCode': ''
  };
  public assignedRole: {
    role: '',
    uuid: ''
  };
  public Role = {
    'role': '',
    'uuid': ''
  }
  public updaterole: any;
  public userrole: any;
  public userroleuuid: any;
  public filterrole: String [];
  public update = false;
  public orgid: any;
  public orgName: any;
  public selected2 = {
    'id': 0,
    'uuid': '',
    'organizationname': '',
    'orgImage': '',
    'PolypmCompanyCode': ''
  };
  constructor(private userService: UserService, private router: Router,
    private route: ActivatedRoute, private organizationService: OrganizationService) {

  }
  public email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  ngOnInit() {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization) {
      this.orgUUID = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
    }
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.Authorities[0].role === 'ADMIN') {
      this.adminrole = true;
    }
    if (this.orgUUID) {
      this.getUserRoleList();
    }
    this.getUserRoleList();
    this.getAllOrganization();
    this.route.queryParams.subscribe(params => {
      const uuid = params['uuid'];
      if (uuid !== undefined) {
        this.update = true;
        this.getUserDetails(uuid);
      }
    });
    console.log('--------------organization-----------', this.organization);
  }

  getAllOrganization() {
    this.organizationService.getAllOrganization().subscribe(
      data => {
        console.log('success to get all organization --- ', data);
        this.organizationlist = data;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  organizationchanged(event) {
    console.log('-------------test-----------', event);
    console.log('---------------->>>>>>>>>>>>>>>', this.organizationlist.organizationname);
    this.organizationlist.forEach(element => {
      if (event.value === element.organizationname){
        this.updateorganization = element.uuid;
        console.log('----organization-------', element);
      }
    });
    // if (event.value === this.organizationlist.organizationname){
    //   console.log('----organization-------', this.organization);
    // }
    // this.getUserRoleList();
  }

  getUserRoleList() {
    this.roles = [];
    console.log('-------------', this.orgUUID);
    if (this.orgUUID) {
      this.userService.getAllUserRoleByOrg(this.orgUUID).subscribe(
        data => {
          this.roles = data;
          this.filterrole = Array.from(new Set(this.roles.map((itemInArray=>itemInArray.role))));
          console.log('---------role--------', this.roles);
          // for (let i = 0; i < data.length; i++) {
          //   if (data[i].role !== 'ROLE_ADMIN' && data[i].role !== 'ROLE_ORGANIZATION_ADMIN') {
          //     this.roles.push(data[i]);
          //   }
          // }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.userService.getAllUserRole().subscribe(
        result => {
          this.usrerole = result;
          // for (let j = 0; j < result.length; j++) {
          //   if (result[j].role === 'ROLE_ORGANIZATION_ADMIN') {
          //     this.usrerole = (result[j]);
          //   }
          // }
          this.roles = result;
          this.filterrole = Array.from(new Set(this.roles.map((itemInArray=>itemInArray.role))));
          console.log('---------role--------', this.filterrole);
        }
      );
      //       this.userService.getAllUserRole().subscribe(
      //         data => {
      //           for (var i = 0; i < data.length; i++) {
      //             if (data[i].role !== "ROLE_ORGANIZATION_ADMIN") {
      //               this.role.push(data[i]);
      //             }
      //           }
      //           console.log("roles --->",this.role)
      //         },
      //         error => {
      //           console.log(error);
      //         }
      //       );
      // }

    }
  }

  textChanged() {
    this.userService.getUser(this.users.username).subscribe(
      data => {
        if (data === null) {
          this.duplicateuser = false;
        } else {
          this.duplicateuser = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  omit_special_char(event) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32);
  }

  emailvalidate() {

  }

  getUserDetails(uuid) {
    this.orgName = [];
    this.userService.getUserDetails(uuid).subscribe(
      data => {
        this.users = data;
        console.log('----------users----------', this.users);
        this.selected2 = data.organization;
        console.log('--------selected--------', this.selected2);
        this.assignedRole = data.Authorities[0];
        this.Role = data.Authorities[0];
        console.log('----------Role--------', this.Role);
      },
      error => {
        console.log(error);
      }
    );
  }

  createUser() {
    if(this.updaterole !== undefined){
      this.userrole = this.updaterole.role;
      this.userroleuuid = this.updaterole.uuid;
    }
    if (!this.orgUUID) {
      // tslint:disable-next-line:no-shadowed-variable
      var userDataToSave = {
        'email': this.users.email,
        'username': this.users.username,
        'password': this.users.password,
        'firstname': this.users.firstname,
        'lastname': this.users.lastname,
        'Authorities': [{
          'uuid':  this.userroleuuid,
          'role': this.userrole
        }],
        'organizationUuid': this.organization.uuid
      };
    } else {
      // tslint:disable-next-line:prefer-const
      var userDataToSave = {
        'email': this.users.email,
        'username': this.users.username,
        'password': this.users.password,
        'firstname': this.users.firstname,
        'lastname': this.users.lastname,
        'Authorities': [{
          'uuid':  this.userroleuuid,
          'role': this.userrole
        }],
        'organizationUuid': this.orgUUID
      };
    }
console.log('-----------userdata----------->', userDataToSave);
    this.userService.createUser(userDataToSave).subscribe(
      data => {
        this.router.navigate(['/users']);
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  getRole(event) {
    console.log('--------event--------->',event.value);
    console.log('------organizationvalue------>>', this.selected2.uuid);
    this.roles.forEach(element=>{
      if (event.value === element.role){
        console.log('element-------------->>',element);
        this.updaterole = element;
      }
    })
    // this.userService.getRole(event.value, this.selected2.uuid).subscribe(data => {
    //   this.updaterole = data;
    //   console.log('-------------data--------->', data);
    // }, error => {
    //   console.log('--error----', error);
    // })
  }

  updateUser() {
    console.log('-------------data--------->', this.updaterole);
    // if (!this.orgUUID) {
    //   var userDataToSave = {
    //     'uuid': this.users.uuid,
    //     'email': this.users.email,
    //     'username': this.users.username,
    //     'password': this.users.password,
    //     'firstname': this.users.firstname,
    //     'lastname': this.users.lastname,
    //     'Authorities': [{
    //       'uuid': this.Role.uuid,
    //       'role': this.Role.role
    //     }],
    //     'organizationUuid': this.selected2.uuid
    //   };
    // } else {
    //   // tslint:disable-next-line:prefer-const
    //   var userDataToSave = {
    //     'uuid': this.users.uuid,
    //     'email': this.users.email,
    //     'username': this.users.username,
    //     'password': this.users.password,
    //     'firstname': this.users.firstname,
    //     'lastname': this.users.lastname,
    //     'Authorities': [{
    //       'uuid': this.Role.uuid,
    //       'role': this.Role.role
    //     }],
    //     'organizationUuid': this.orgUUID
    //   };

    // }
    if(this.updaterole !== undefined){
      this.userrole = this.updaterole.role;
      this.userroleuuid = this.updaterole.uuid;
    }
    var userDataToSave = {
      'uuid': this.users.uuid,
      'email': this.users.email,
      'username': this.users.username,
      'password': this.users.password,
      'firstname': this.users.firstname,
      'lastname': this.users.lastname,
      'Authorities': [{
        'uuid': this.userroleuuid,
        'role': this.userrole
      }],
      'organizationUuid': this.updateorganization
    };

    console.log('--->> ', userDataToSave);
    this.userService.updateUser(userDataToSave).subscribe(
      data => {
        this.router.navigate(['/users']);
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
