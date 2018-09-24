import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IRole } from '../user-role/IRole';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../organization/organization.service';




@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.css']
})
export class NewRoleComponent implements OnInit {
  public screensForAction: String[];
  public role: IRole = {
    'role': '',
    'organizationUuid': '',
    'allowedScreens': ''
  };
  public orgUUID;
  public allowedScreens = [];
  public test = [];
  public update = false;
  public duplicaterole = false;
  public adminrole = false;
  public organizationlist = [];
  public organizationRole: boolean;
  public Roles: string[]=['ROLE_ORGANIZATION_ADMIN','ROLE_USER']
  constructor(private userService: UserService, private router: Router,
    private route: ActivatedRoute, private organizationService: OrganizationService) {
    const organizationDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.organization;
    const authoritiesDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.Authorities;
    if (organizationDetails) {
      this.orgUUID = organizationDetails.uuid;
    }
    if (authoritiesDetails[0].role === 'ADMIN') {
      this.adminrole = true;
    }
    if (authoritiesDetails[0].role === 'ADMIN' || organizationDetails.PolypmCompanyCode === 'STAHLS') {

      // tslint:disable-next-line:max-line-length
      this.screensForAction = ['Dashboard', 'Orders', 'Purchase Orders', 'Tickets', 'Invoices', 'Shipments', 'Inventory', 'Organization', 'Users'];
    } else {
      this.screensForAction = ['Dashboard', 'Orders', 'Purchase Orders', 'Tickets', 'Invoices', 'Shipments', 'Inventory', 'Users'];

    }
  }

  ngOnInit() {
    this.getAllOrganization();
    this.currentUserDetails();
    this.route.queryParams.subscribe(params => {
      const uuid = params['uuid'];
      if (uuid !== undefined) {
        this.update = true;
        this.getUserRoleDetails(uuid);
      }
    });
  }

  currentUserDetails() {
    const userDetails = JSON.parse(sessionStorage.getItem('currentUser'));
    const authorities = userDetails.user.Authorities;
    if (authorities.length > 0) {
      if (authorities[0].role === 'ADMIN') {
        this.organizationRole = true;
      } else {
        this.organizationRole = false;
      }
    } else {
      this.organizationRole = false;
    }
  }

  getAllOrganization() {
    this.organizationService.getAllOrganization().subscribe(
      data => {
        this.organizationlist = data;
        // const nonorg = {
        //   orgImage: null,
        //   organizationname: 'None',
        //   uuid: null
        // };
        // this.organizationlist.push(nonorg);
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  organizationchanged() {
    // this.role.role = '';
    this.duplicaterole = false;
    this.organizationRole = false;
    // this.textChanged();
  }

  textChanged(role) {
    console.log('-----------------',role)
    this.role.role = role;
    let orgid;
    if (this.orgUUID) {
      orgid = this.orgUUID;
    } else if (this.role.organizationUuid) {
      orgid = this.role.organizationUuid;
    }
    if (orgid) {
      console.log('-----------------',role);
      this.userService.getRole(this.role.role, orgid).subscribe(
        data => {
          if (data === null || data.isDisabled) {
            this.duplicaterole = false;
          } else {
            this.duplicaterole = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      console.log('-----------------',role);
      console.log('else');
      this.userService.getRoleNoOrg(this.role.role).subscribe(
        data => {
          if (data === null || data[0].isDisabled) {
            this.duplicaterole = false;
          } else {
            this.duplicaterole = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getUserRoleDetails(uuid) {
    this.userService.getUserRoleDetails(uuid).subscribe(
      data => {
        this.role = data[0];
        this.test = this.role.allowedScreens.split(',');
        this.allowedScreens = this.test;
        console.log('----------check-------------', this.allowedScreens);

      },
      error => {
        console.log(error);
      }
    );
  }

  allowedScreenList(screens) {
    if (this.allowedScreens.indexOf(screens) < 0) {
      this.allowedScreens.push(screens);
      console.log('----------check-------------', screens);
    } else {
      this.allowedScreens.splice(this.allowedScreens.indexOf(screens), 1);
    }
  }

  createUserRole() {
    // this.role.organizationUuid = this.orgUUID;
    if (this.role.organizationUuid === '' || this.role.organizationUuid === null) {
      this.role.organizationUuid = this.orgUUID;
    }
    this.role.allowedScreens = this.allowedScreens.toString();
    this.userService.createUserRole(this.role).subscribe(
      data => {
        this.router.navigate(['/user-roles']);
      },
      error => {
        console.log(error);
      }
    );
  }

  updateUserRole() {
    // this.role.organizationUuid = this.orgUUID;
    if (this.role.organizationUuid === '' || this.role.organizationUuid === null) {
      this.role.organizationUuid = this.orgUUID;
    }
    this.role.allowedScreens = this.allowedScreens.toString();
    this.userService.updateUserRole(this.role).subscribe(
      data => {
        this.router.navigate(['/user-roles']);
      },
      error => {
        console.log(error);
      }
    );
  }

}
