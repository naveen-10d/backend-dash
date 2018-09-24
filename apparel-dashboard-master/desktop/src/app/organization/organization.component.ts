import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { IOrganization } from './IOrganization';
import { OrganizationService } from './organization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';



@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public listOfOrganization: IOrganization[] = [];
  public showOrganizationButton: boolean;
  public testArray: any[];
  displayedColumns = ['Id', 'Organization', 'PolypmCompanyCode', 'Actions'];

  dataSource = new MatTableDataSource(this.listOfOrganization);
  constructor(private spinnerservice: Ng4LoadingSpinnerService, private organizationService: OrganizationService,
    private router: Router, private route: ActivatedRoute, private dailog: MatDialog) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.intializeCurrentUser();
    this.getAllOrganization();
  }

  adduser() {
    this.router.navigate(['/new-user']);
  }
  Updateorganization(row) {
    this.router.navigate(['/create-org'], { queryParams: { id: row.uuid } });
  }
  intializeCurrentUser() {
    const AuthoritiesDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.Authorities;
    const organizationDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.organization;
    if (AuthoritiesDetails[0].role === 'ADMIN' || organizationDetails.PolypmCompanyCode === 'STAHLS') {
      this.showOrganizationButton = true;
    } else {
      this.showOrganizationButton = false;
    }
  }
  getAllOrganization() {
    console.log('entering into organization page getallorg');
    this.spinnerservice.show();
    this.organizationService.getAllOrganization().subscribe(
      data => {
        if (data === 'There is no Organisation') {
          this.Popup();
          this.listOfOrganization = [];
          this.dataSource = new MatTableDataSource(this.listOfOrganization);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerservice.hide();
        } else {
          this.listOfOrganization = data;
          console.log('else part data ----- ', this.listOfOrganization);
          this.testArray = this.listOfOrganization;
          const organizationDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.organization;
          let details = [];
          if (organizationDetails !== null) {
            if (organizationDetails.PolypmCompanyCode !== null && organizationDetails.PolypmCompanyCode !== 'STAHLS') {
              //  this.getAllPurchaseOrderByOrg(organizationDetails.PolypmCompanyCode);
              this.listOfOrganization.forEach(element => {
                if (element.PolypmCompanyCode === organizationDetails.PolypmCompanyCode) {
                  details.push(element);
                }
              });
            } else {
              details = this.listOfOrganization;
            }
          } else {
            details = this.listOfOrganization;
          }
          this.dataSource = new MatTableDataSource(details);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'id': return item.id;
              case 'Organization': return item.organizationname.toLowerCase();
              default: return item[property];
            }
          };
          this.spinnerservice.hide();
        }
      },
      error => {
        console.log('something went wrong');
      }
    );
  }
  Popup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = 'No Data in Organization';
    const dialogRef = this.dailog.open(AlertDialogComponent, dialogConfig);
  }

  Opendialog(row) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = row;
    const dialogRef = this.dailog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => {
        if (val !== undefined) {
          this.deleteorganization(val);
        }
      }
    );

  }

  deleteorganization(row) {
    this.spinnerservice.show();
    this.organizationService.deleteOrganization(row.uuid).subscribe(data => {
      this.getAllOrganization();
    }, error => {
      this.spinnerservice.hide();
      console.log('something went wrong');
    });
    // this.getAllOrganization();
  }
}
