import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { IRole } from './IRole';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public UsersList: IRole[] = [];
  public selectedValue;
  public IRole: IRole = {
    'role': '',
    'organizationUuid': '',
    'allowedScreens': ''
  };
  public users: any;
  public userrole: any[] = [];
  public orgUUID;
  displayedColumns = ['Name', 'Organisation', 'Actions'];
  dataSource: any = [];
  constructor(private userService: UserService, private router: Router, private dialog: MatDialog) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization) {
      this.orgUUID = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
    }
  }

  ngOnInit() {
    this.getUserRoleList();
  }

  getUserRoleList() {
    this.userrole = [];
    if (this.orgUUID) {
      this.userService.getAllUserRoleByOrg(this.orgUUID).subscribe(
        data => {
          this.UsersList = data;
          this.users = this.UsersList;
          this.users.forEach(element => {
            const test = element.isDisabled;
            if (test === false) {
              this.userrole.push(element);
            }
          });
          this.userrole = this.userrole.filter((array) => array.organization != null);
          this.dataSource = new MatTableDataSource(this.userrole);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'Name': return item.role.toLowerCase();
              case 'Organisation': return item.organization.organizationname.toLowerCase();
              default: return item[property];
            }
          };
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.userService.getAllUserRole().subscribe(
        data => {
          this.UsersList = data;
          this.users = this.UsersList;
          this.users.forEach(element => {
            const test = element.isDisabled;
            if (test === false) {
              this.userrole.push(element);
            }
          });
          this.userrole = this.userrole.filter((array) => array.organization != null);
          this.dataSource = new MatTableDataSource(this.userrole);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'Name': return item.role.toLowerCase();
              case 'Organisation': return item.organization.organizationname.toLowerCase();
              default: return item[property];
            }
          };
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngAfterViewInit() {
  }

  editUserRole(role) {
    this.router.navigate(['/new-role'], { queryParams: { uuid: role.uuid } });
  }

  openDialog(userData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = userData;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val !== undefined) {
          this.handleUserRoleDisable(val);
        }
      }
    );
  }

  handleUserRoleDisable(userData) {
    console.log('-->', userData);
    this.userService.disableUserRole(userData.uuid).subscribe(
      data => {
        this.getUserRoleList();
      },
      error => {
        console.log(error);
      }
    );
    // this.getUserRoleList();
  }

}
