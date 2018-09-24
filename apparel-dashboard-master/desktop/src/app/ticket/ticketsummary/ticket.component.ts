import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ITickets } from './ITickets';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { TicketService } from './ticket.service';
import { FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../../dialog/alert-dialog/alert-dialog.component';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { TicketDataSource } from './TicketDataSource';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, AfterViewInit {

  public filter_ticketCreated_By: any = [];
  public filter_ticketAssigned_To: any = [];
  public filter_ticketStatus: any = [];
  public filter_ticketOrganization: any = [];
  public filterArr: any[];
  selectfilter = new FormControl();
  // tslint:disable-next-line:member-ordering
  public name: any[];
  // tslint:disable-next-line:member-ordering
  public failure: any;
  // tslint:disable-next-line:member-ordering
  public successmessage: any;
  // tslint:disable-next-line:member-ordering
  public failuremessage: any;
  public orgUUID;
  organizationname: String;
  // public showOrgFilter: boolean;
  // public singleObject: {
  //   uuid: '',
  //   Date: '',
  //   orderNumberList: any,
  //   createdByName; '',
  //   assignedToName: '',
  //   type: '',
  //   status: ''
  // };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  // public ticketDetails: ITickets[] = [];
  // // public selectedValue;
  // public organizationSelectedValue: String[] = [];
  // public createdBySelectedValue: String[] = [];
  // public statusSelectedValue: String[] = [];
  // public assignedToSelectedValue: String[] = [];
  // public listOfTickets = [];
  public ITickets: ITickets = {
    'id': 0,
    'Date': '',
    'Order_number': 0,
    'Created_By': '',
    'Assigned_To': '',
    'Type': '',
    'Status': ''
  };
  public Search: any = {
    'PONumber': '',
    'orderNumber': '',
    'createDate': '',
    'createdName': '',
    'assignedName': '',
    'comments': ''
  };
  public searchtext: any;
  public search: any;
  // public orgvalue: any;
  // public createdvalue: any;
  // public assignedvalue: any;
  // public statusvalue: any;
  // public filterassignedname: any;
  // public commentsearch: any[];
  displayedColumns = ['Id', 'PONumber', 'Date', 'Order_number', 'Created_By', 'organization', 'Assigned_To', 'Type', 'Status'];
  dataSource: TicketDataSource;

  filterdata: any = [];
  isClearFilter: boolean;
  pageNo: number;
  organizationSelectedValue: string[] = [];
  createdBySelectedValue: string[] = [];
  assignedToSelectedValue: string[] = [];
  statusSelectedValue: string[] = [];
  public showArrayObject: any[] = [];
  public filter: any = {};
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private ticketService: TicketService, private router: Router, private dialog: MatDialog) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization !== null) {
      this.orgUUID = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
      this.organizationname = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.organizationname;
    }
  }


  ngOnInit() {
    // this.statusSelectedValue = [];
    // this.createdBySelectedValue = [];
    // this.assignedToSelectedValue = [];
    // this.spinnerlogo = false;
    this.spinnerService.show();
    this.pageNo = 1;
    console.log('organization name and id are---- ', this.organizationname, this.orgUUID);
    if ((this.organizationname === 'Stahls' || this.organizationname === undefined)) {
      this.getAllTickets();
    } else {
      this.getTicketByOrgId();
    }
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadDataPage();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDataPage())
      )
      .subscribe();

  }

  loadDataPage() {
    console.log('entering into load data pages are ----- ', this.input.nativeElement.value);
    // const searchValue = '%'+
    if (Object.keys(this.Search).filter(x => this.Search[x] !== '').length !== 0) {
      this.searchFilter();
    } else if ((this.organizationname === 'Stahls' || this.organizationname === undefined)) {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatas(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.createdBySelectedValue,
        this.assignedToSelectedValue,
        this.statusSelectedValue,
        this.organizationSelectedValue
      );
    } else {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatasByCompanyCode(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.createdBySelectedValue,
        this.assignedToSelectedValue,
        this.statusSelectedValue,
        this.orgUUID
      );
    }
  }


  getAllTickets() {
    console.log('entering into get all ticket valeus are ---- ');
    this.dataSource = new TicketDataSource(this.ticketService, this.dialog);

    this.dataSource.loadDatas(0, 25, 'date', 'desc', '',
      this.createdBySelectedValue, this.assignedToSelectedValue,
      this.statusSelectedValue, this.organizationSelectedValue);
    this.getFilterValues();
  }

  getTicketByOrgId() {
    console.log('get ticket by org id ');
    this.dataSource = new TicketDataSource(this.ticketService, this.dialog);

    this.dataSource.loadDatasByCompanyCode(0, 25, 'date', 'desc', '',
      this.createdBySelectedValue, this.assignedToSelectedValue,
      this.statusSelectedValue, this.orgUUID);
    this.getFilterValueByOrgId();
  }

  getFilterValues() {
    this.ticketService.getFilterValue().subscribe(
      data => {
        this.filter = data;
        this.spinnerService.hide();
        console.log('get all filter values are ------ ', this.filter);
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }

  getFilterValueByOrgId() {
    this.ticketService.getFilterValueByOrgId(this.orgUUID).subscribe(
      data => {
        console.log('@@@@@ get filter values by org id are --- ', data);
        this.spinnerService.hide();
        this.filter = data;
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }
  FilterDetails() {
    console.log('entering into filter details values are ---- ', this.createdBySelectedValue, this.assignedToSelectedValue,
      this.statusSelectedValue);
  }

  organizationFilter() {
    this.organizationSelectedValue = this.selectfilter.value;
    this.paginator.pageIndex = 0;
    // this.FilterDetails();
    this.loadDataPage();
  }
  createByFilter() {
    this.createdBySelectedValue = this.selectfilter.value;
    // this.FilterDetails();
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  assignedToFilter() {
    this.assignedToSelectedValue = this.selectfilter.value;
    this.FilterDetails();
    this.paginator.pageIndex = 0;
    this.loadDataPage();

  }
  statusFilter() {
    this.statusSelectedValue = this.selectfilter.value;
    this.FilterDetails();
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }

  onRowSelected(row) {
    this.router.navigate(['/ticketdetails'], { queryParams: { uuid: row.uuid } });
    // this.router.navigate(['/tickets-details'], { queryParams: { uuid: id } });
  }
  searchmodel() {
    this.search = !this.search;
    if (Object.keys(this.Search).filter(x => this.Search[x] !== '').length === 0) {
      this.isClearFilter = true;
    } else {
      this.isClearFilter = false;
    }
  }

  cancelFilter() {
    this.search = false;
  }
  clearFilterValue() {
    this.Search = {
      'PONumber': '',
      'orderNumber': '',
      'createDate': '',
      'createdName': '',
      'assignedName': '',
      'comments': ''
    };
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }

  searchFilter() {
    console.log('search filter values are ----page index are -- ', this.paginator.pageIndex);
    if (Object.keys(this.Search).filter(x => this.Search[x] !== '').length === 0) {
      this.loadDataPage();
    } else {
      if ((this.organizationname === 'Stahls' || this.organizationname === undefined)) {

        this.dataSource.getSearchResult(this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction, this.Search);
      } else {
        this.dataSource.getSearchResultByOrgId(this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction, this.Search, this.orgUUID);
      }
    }
  }

  // searchFilter() {
  //     console.log('entering into search filter values are ---- ', this.Search);
  //     console.log('length of key are --- ', Object.keys(this.search).filter(x => this.search[x] !== ''),
  //       Object.keys(this.Search).filter(x => this.Search[x] !== '').length);
  //     if (Object.keys(this.Search).filter(x => this.Search[x] !== '').length === 0) {
  //       this.getAllTicket();
  //     } else {
  //       if (this.organizationname !== 'Stahls' && this.orgUUID !== undefined) {
  //         this.ticketService.getSearchResultByOrgId(this.Search, this.orgUUID).subscribe(
  //           data => {
  //             this.search = false;
  //             this.showTableData(data);
  //           },
  //           error => {
  //             console.log('something went wrong');
  //           }
  //         );
  //       } else {
  //         this.ticketService.getSearchResult(this.Search).subscribe(
  //           data => {
  //             this.search = false;
  //             this.showTableData(data);
  //           },
  //           error => {
  //             console.log('something went wrong');
  //           }
  //         );
  //       }
  //     }
  //   }



  // showTableData(data) {
  //   console.log('ticket shows are ------>>>>> ', data);
  //   this.showArrayObject = [];
  //   data.forEach(element => {
  //     const singleObject = {
  //       uuid: '',
  //       id: element.id,
  //       Date: '',
  //       orderNumberList: [],
  //       Company: '',
  //       createdByName: '',
  //       assignedToName: [],
  //       type: '',
  //       status: '',
  //       PONumberList: [],
  //       Description: ''
  //     };
  //     singleObject.uuid = element.uuid;
  //     singleObject.Date = element.Date;
  //     singleObject.Description = element.description;
  //     if (element.salesorder.length === 0) {
  //       singleObject.orderNumberList = [];
  //     } else {
  //       for (let i = 0; i < element.salesorder.length; i++) {
  //         // singleObject.orderNumberList = element.salesorder[i].uuid;
  //         singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
  //       }
  //     }
  //     if (element.salesorder.length === 0) {
  //       singleObject.PONumberList = [];
  //     } else {
  //       for (let i = 0; i < element.salesorder.length; i++) {
  //         singleObject.PONumberList.push(element.salesorder[i].PONumber);
  //       }
  //     }
  //     singleObject.createdByName = element.created_by.firstname;
  //     if (element.assigned_to.length > 0) {
  //       for (let i = 0; i < element.assigned_to.length; i++) {
  //         singleObject.assignedToName.push(element.assigned_to[i].firstname);
  //       }
  //       // singleObject.assignedToName = element.assigned_to.firstname;
  //     }
  //     if (element.organizationUuid != null) {
  //       singleObject.Company = element.organization.organizationname;
  //     }
  //     singleObject.type = element.Type;
  //     singleObject.status = element.Status;
  //     this.showArrayObject.push(singleObject);
  //   });
  //   console.log('show array object are --- ', this.showArrayObject);
  //   if (this.showArrayObject.length === 0) {
  //     this.dataSource = new MatTableDataSource([]);
  //   } else {
  //     this.dataSource = new MatTableDataSource(this.showArrayObject);
  //   }
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'Id': return item.id;
  //       case 'Date': return item.Date;
  //       case 'Order_number': return item.orderNumberList;
  //       case 'Created_By': return item.createdByName.toLowerCase();
  //       case 'organization': return item.Company.toLowerCase();
  //       case 'Assigned_To': return item.assignedToName;
  //       case 'Type': return item.type.toLowerCase();
  //       case 'Status': return item.status.toLowerCase();
  //       case 'PONumber': return item.PONumberList;
  //       default: return item[property];
  //     }
  //   };
  // }

  // ngOnInit() {
  //   this.search = false;
  //   this.spinnerservice.show();
  //   console.log('org name------->', this.organizationname);
  //   // if (this.organizationname === undefined) {
  //   //   this.getAllAdminTicket();
  //   // } else {
  //   //   this.getAllTicket();
  //   // }
  //   this.getAllTicket();
  // }
  // ngAfterViewInit(): void {
  // }



  // getAllTicket() {
  //   this.name = [];
  //   console.log('org uuid are --- ', this.orgUUID);
  //   if (this.organizationname !== 'Stahls' && this.orgUUID !== undefined) {
  //     this.ticketService.getAllTicketByOrg(this.orgUUID).subscribe(
  //       data => {
  //         if (data === 'There is no Tickets') {
  //           this.listOfTickets = [];
  //           this.OpenDialog();
  //         } else {
  //           console.log('get all ticket data are 1---- ', data);
  //           this.spinnerservice.hide();
  //           // this.success = true;
  //           this.successmessage = '   Your List Of Tickets is Displayed';
  //           this.listOfTickets = data;
  //           this.filter_ticketCreated_By = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  // itemInArray.created_by.firstname)));
  //           // tslint:disable-next-line:max-line-length
  //           // this.filter_ticketAssigned_To = Array.from(new Set(this.listOfTickets.map((itemInArray)
  //  => itemInArray.assigned_to ? itemInArray.assigned_to.firstname : '')));
  //           // tslint:disable-next-line:max-line-length
  //           this.listOfTickets.forEach(element => {
  //             element.assigned_to.forEach(element1 => {
  //               this.name.push(element1.firstname);
  //             });
  //             // tslint:disable-next-line:max-line-length
  //             this.filter_ticketAssigned_To = Array.from(new Set(this.name.map((itemInArray) => itemInArray)));
  //           });
  //           console.log('---------------Name--------------', this.listOfTickets.map((itemInArray) => itemInArray.assigned_to));
  //           this.filter_ticketStatus = Array.from(new Set(this.listOfTickets.map((customerArray => customerArray.Status))));
  //           this.filter_ticketOrganization = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  //             itemInArray.organization.organizationname)));
  //           // filter
  //           // this.filter_ticketAssigned_To = this.filter_ticketAssigned_To.filter((obj) => obj.length > 0);
  //           this.filter_ticketCreated_By = this.filter_ticketCreated_By.filter((obj) => obj.length > 0);
  //           this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);
  //           this.filter_ticketOrganization = this.filter_ticketOrganization.filter((obj) => obj.length > 0);
  //           this.showOrgFilter = false;
  //           this.showTableData(this.listOfTickets);
  //         }
  //       },
  //       error => {
  //         this.failure = true;
  //         this.failuremessage = 'This Tickets  is now delayed';
  //         console.log('something went wrong');
  //       }
  //     );
  //   } else {
  //     this.ticketService.getAllTicket().subscribe(
  //       data => {
  //         if (data === 'There is no Tickets') {
  //           this.listOfTickets = [];
  //           this.OpenDialog();
  //         } else {
  //           // this.success = true;
  //           this.successmessage = '   Your List Of Tickets is Displayed';
  //           // this.listOfTickets = data;

  //           data.forEach(element => {
  //             if (element.organization !== null) {
  //               this.listOfTickets.push(element);
  //             }
  //           });
  //           this.spinnerservice.hide();
  //           console.log('get all tick---->', data);
  //           this.filter_ticketCreated_By = Array.from(new Set(this.listOfTickets.map((itemInArray)
  //  => itemInArray.created_by.firstname)));
  //           const arrayOfAssignedUser = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  //             itemInArray.assigned_to.map((InsideArray) => InsideArray.firstname))));
  //           const listOfNames = [];
  //           arrayOfAssignedUser.forEach(element => {
  //             // console.log('entering into filter ------- ', element.length);
  //             for (let i = 0; i < element.length; i++) {
  //               if (listOfNames.indexOf(element[i]) > -1) {

  //               } else {
  //                 listOfNames.push(element[i]);
  //               }
  //             }
  //           });
  //           this.filter_ticketOrganization = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  //             itemInArray.organization.organizationname)));
  //           this.filter_ticketAssigned_To = listOfNames;
  //           console.log('testing filter in ticket assigned are --------- ', this.filter_ticketAssigned_To);
  //           this.filter_ticketStatus = Array.from(new Set(this.listOfTickets.map((customerArray => customerArray.Status))));
  //           // filter
  //           this.filter_ticketAssigned_To = this.filter_ticketAssigned_To.filter((obj) => obj.length > 0);
  //           this.filter_ticketCreated_By = this.filter_ticketCreated_By.filter((obj) => obj.length > 0);
  //           this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);
  //           this.filter_ticketOrganization = this.filter_ticketOrganization.filter((obj) => obj.length > 0);
  //           this.showTableData(this.listOfTickets);
  //           this.showOrgFilter = true;
  //         }
  //       },
  //       error => {
  //         this.failure = true;
  //         this.failuremessage = 'This Tickets  is now delayed';
  //         console.log('something went wrong');
  //       }
  //     );
  //   }
  // }

  // showTableData(data) {
  //   console.log('ticket shows are ------>>>>> ', data);
  //   this.showArrayObject = [];
  //   data.forEach(element => {
  //     const singleObject = {
  //       uuid: '',
  //       id: element.id,
  //       Date: '',
  //       orderNumberList: [],
  //       Company: '',
  //       createdByName: '',
  //       assignedToName: [],
  //       type: '',
  //       status: '',
  //       PONumberList: [],
  //       Description: ''
  //     };
  //     singleObject.uuid = element.uuid;
  //     singleObject.Date = element.Date;
  //     singleObject.Description = element.description;
  //     if (element.salesorder.length === 0) {
  //       singleObject.orderNumberList = [];
  //     } else {
  //       for (let i = 0; i < element.salesorder.length; i++) {
  //         // singleObject.orderNumberList = element.salesorder[i].uuid;
  //         singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
  //       }
  //     }
  //     if (element.salesorder.length === 0) {
  //       singleObject.PONumberList = [];
  //     } else {
  //       for (let i = 0; i < element.salesorder.length; i++) {
  //         singleObject.PONumberList.push(element.salesorder[i].PONumber);
  //       }
  //     }
  //     singleObject.createdByName = element.created_by.firstname;
  //     if (element.assigned_to.length > 0) {
  //       for (let i = 0; i < element.assigned_to.length; i++) {
  //         singleObject.assignedToName.push(element.assigned_to[i].firstname);
  //       }
  //       // singleObject.assignedToName = element.assigned_to.firstname;
  //     }
  //     if (element.organizationUuid != null) {
  //       singleObject.Company = element.organization.organizationname;
  //     }
  //     singleObject.type = element.Type;
  //     singleObject.status = element.Status;
  //     this.showArrayObject.push(singleObject);
  //   });
  //   console.log('show array object are --- ', this.showArrayObject);
  //   if (this.showArrayObject.length === 0) {
  //     this.dataSource = new MatTableDataSource([]);
  //   } else {
  //     this.dataSource = new MatTableDataSource(this.showArrayObject);
  //   }
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'Id': return item.id;
  //       case 'Date': return item.Date;
  //       case 'Order_number': return item.orderNumberList;
  //       case 'Created_By': return item.createdByName.toLowerCase();
  //       case 'organization': return item.Company.toLowerCase();
  //       case 'Assigned_To': return item.assignedToName;
  //       case 'Type': return item.type.toLowerCase();
  //       case 'Status': return item.status.toLowerCase();
  //       case 'PONumber': return item.PONumberList;
  //       default: return item[property];
  //     }
  //   };
  // }

  // // FilterTableData(data) {
  // //   console.log('filter ticket shows are ------>>>>> ', data.length);
  // //   this.showArrayObject = [];
  // //   data.forEach(element => {
  // //     const singleObject = {
  // //       uuid: '',
  // //       id: element.id,
  // //       Date: '',
  // //       orderNumberList: [],
  // //       Company: '',
  // //       createdByName: '',
  // //       assignedToName: [],
  // //       type: '',
  // //       status: '',
  // //       PONumberList: [],
  // //       Description: ''
  // //     };
  // //     singleObject.uuid = element.uuid;
  // //     singleObject.Date = element.Date;
  // //     singleObject.Description = element.description;
  // //     if (element.salesorder.length === 0) {
  // //       singleObject.orderNumberList = [];
  // //     } else {
  // //       for (let i = 0; i < element.salesorder.length; i++) {
  // //         // singleObject.orderNumberList = element.salesorder[i].uuid;
  // //         singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
  // //       }
  // //     }
  // //     if (element.salesorder.length === 0) {
  // //       singleObject.PONumberList = [];
  // //     } else {
  // //       for (let i = 0; i < element.salesorder.length; i++) {
  // //         singleObject.PONumberList.push(element.salesorder[i].PONumber);
  // //       }
  // //     }
  // //     console.log('filter table data in middles are ---- ', singleObject);
  // //     singleObject.createdByName = element.created_by.firstname;
  // //     if (element.assigned_to.length > 0) {
  // //       for (let i = 0; i < element.assigned_to.length; i++) {
  // //         singleObject.assignedToName.push(element.assigned_to[i].firstname);
  // //       }
  // //       // singleObject.assignedToName = element.assigned_to.firstname;
  // //     }
  // //     if (element.organizationUuid != null) {
  // //       singleObject.Company = element.organization.organizationname;
  // //     }
  // //     singleObject.type = element.Type;
  // //     singleObject.status = element.Status;
  // //     this.showArrayObject.push(singleObject);
  // //   console.log('filter values in showArray object length single are ---- ', this.showArrayObject.length);
  // //   });
  // //   console.log('ffffffilter show array object are --- ', this.showArrayObject);
  // //   this.dataSource = new MatTableDataSource(this.showArrayObject);
  // //   this.dataSource.paginator = this.paginator;
  // //   this.dataSource.sort = this.sort;
  // //   this.dataSource.sortingDataAccessor = (item, property) => {
  // //     switch (property) {
  // //       case 'Id': return item.id;
  // //       case 'Date': return item.Date;
  // //       case 'Order_number': return item.orderNumberList;
  // //       case 'Created_By': return item.createdByName.toLowerCase();
  // //       case 'organization': return item.Company.toLowerCase();
  // //       case 'Assigned_To': return item.assignedToName;
  // //       case 'Type': return item.type.toLowerCase();
  // //       case 'Status': return item.status.toLowerCase();
  // //       case 'PONumber': return item.PONumberList;
  // //       default: return item[property];
  // //     }
  // //   };
  // // }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }

  // OpenDialog() {
  //   this.spinnerservice.hide();
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '35%';
  //   dialogConfig.position = {
  //     bottom: '18%',
  //   };
  //   dialogConfig.direction = 'rtl';
  //   dialogConfig.data = 'No Data in Tickets';
  //   const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
  // }

  // organizationFilter() {
  //   this.organizationSelectedValue = this.selectfilter.value;
  //   this.FilterDetails();
  // }
  // createByFilter() {
  //   this.createdBySelectedValue = this.selectfilter.value;
  //   this.FilterDetails();
  // }
  // assignedToFilter() {
  //   this.assignedToSelectedValue = this.selectfilter.value;
  //   this.FilterDetails();

  // }
  // statusFilter() {
  //   this.statusSelectedValue = this.selectfilter.value;
  //   this.FilterDetails();
  // }

  // // PONumberSearch() {

  // // }
  // // orderNumberSearch() {

  // // }

  // // createdDateSearch() {

  // // }

  // // createdNameSearch() {

  // // }

  // // assignedNameSearch() {

  // // }

  // // commentSearch() {

  // // }

  // searchFilter() {
  //   console.log('entering into search filter values are ---- ', this.Search);
  //   console.log('length of key are --- ', Object.keys(this.search).filter(x => this.search[x] !== ''),
  //     Object.keys(this.Search).filter(x => this.Search[x] !== '').length);
  //   if (Object.keys(this.Search).filter(x => this.Search[x] !== '').length === 0) {
  //     this.getAllTicket();
  //   } else {
  //     if (this.organizationname !== 'Stahls' && this.orgUUID !== undefined) {
  //       this.ticketService.getSearchResultByOrgId(this.Search, this.orgUUID).subscribe(
  //         data => {
  //           this.search = false;
  //           this.showTableData(data);
  //         },
  //         error => {
  //           console.log('something went wrong');
  //         }
  //       );
  //     } else {
  //       this.ticketService.getSearchResult(this.Search).subscribe(
  //         data => {
  //           this.search = false;
  //           this.showTableData(data);
  //         },
  //         error => {
  //           console.log('something went wrong');
  //         }
  //       );
  //     }
  //   }
  // }

  // cancelFilter() {
  //   this.search = false;
  // }
  // clearFilterValue() {
  //   this.Search = {
  //     'PONumber': '',
  //     'orderNumber': '',
  //     'createDate': '',
  //     'createdName': '',
  //     'assignedName': '',
  //     'comments': ''
  //   };
  //   this.getAllTicket();
  // }

  // // Descriptionsearch(value: String) {
  // //   this.searchtext = value;
  // //   this.filterArr = [];
  // //   value = value.toLowerCase();
  // //   this.showArrayObject.forEach(one => {
  // //     const descriptiontext = one.Description.toLowerCase();
  // //     if (descriptiontext.includes(value)) {
  // //       this.filterArr.push(one);
  // //       console.log('-------filter----------', this.filterArr);
  // //     }
  // //     const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  // //     this.dataSource = new MatTableDataSource(filterdata);
  // //     this.dataSource.paginator = this.paginator;
  // //     this.dataSource.sort = this.sort;
  // //   });
  // // }
  // // Ponumbersearch(value: String) {
  // //   this.searchtext = value;
  // //   this.filterArr = [];
  // //   value = value.toString();
  // //   console.log('--------------', value);
  // //   if (value === '') {
  // //     this.initializeValue();
  // //   }
  // //   if (value !== '') {
  // //     this.showArrayObject.forEach(one => {
  // //       one.PONumberList.forEach(number => {
  // //         if (number.toString() === value) {
  // //           this.filterArr.push(one);
  // //           console.log('-------filter----------', this.filterArr);
  // //         }
  // //       });
  // //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  // //       this.dataSource = new MatTableDataSource(filterdata);
  // //       this.dataSource.paginator = this.paginator;
  // //       this.dataSource.sort = this.sort;
  // //     });
  // //   }
  // // }
  // // Ordernumbersearch(value: String) {
  // //   this.searchtext = value;
  // //   this.filterArr = [];
  // //   value = value;
  // //   console.log('--------------', value);
  // //   if (value === '') {
  // //     this.initializeValue();
  // //   }
  // //   if (value !== '') {
  // //     this.showArrayObject.forEach(one => {
  // //       one.orderNumberList.forEach(number => {
  // //         const ordernumber = number;
  // //         if (ordernumber.toString() === value.toString()) {
  // //           this.filterArr.push(one);
  // //           console.log('-------filter----------', this.filterArr);
  // //         }
  // //       });
  // //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  // //       this.dataSource = new MatTableDataSource(filterdata);
  // //       this.dataSource.paginator = this.paginator;
  // //       this.dataSource.sort = this.sort;
  // //     });

  // //   }
  // // }
  // // datesearch(filterValue: String) {
  // //   this.searchtext = filterValue;
  // //   filterValue = filterValue.trim();
  // //   filterValue = filterValue.toLowerCase();
  // //   this.dataSource.filter = filterValue;
  // //   console.log('-----------------------', this.dataSource.filter);
  // // }

  // // createdbysearch(value: String) {
  // //   this.searchtext = value;
  // //   this.filterArr = [];
  // //   value = value.toLowerCase();
  // //   console.log('--------------', value);
  // //   if (value === '') {
  // //     this.initializeValue();
  // //   }
  // //   if (value !== '') {
  // //     this.showArrayObject.forEach(one => {
  // //       const name = one.createdByName.toLowerCase();
  // //       console.log('--------date----------', name);
  // //       if (name.includes(value)) {
  // //         this.filterArr.push(one);
  // //         console.log('-------filter----------', this.filterArr);
  // //       }
  // //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  // //       this.dataSource = new MatTableDataSource(filterdata);
  // //       this.dataSource.paginator = this.paginator;
  // //       this.dataSource.sort = this.sort;
  // //     });
  // //   }
  // // }
  // // assignedtosearch(value: String) {
  // //   this.searchtext = value;
  // //   this.filterArr = [];
  // //   value = value.toLowerCase();
  // //   console.log('--------------', value);
  // //   if (value === '') {
  // //     this.initializeValue();
  // //   }
  // //   if (value !== '') {
  // //     this.showArrayObject.forEach(one => {
  // //       one.assignedToName.forEach(name => {
  // //         const assigned_to = name.toLowerCase();
  // //         if (assigned_to.includes(value)) {
  // //           this.filterArr.push(one);
  // //           console.log('-------filter----------', this.filterArr);
  // //         }
  // //       });
  // //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  // //       this.dataSource = new MatTableDataSource(filterdata);
  // //       this.dataSource.paginator = this.paginator;
  // //       this.dataSource.sort = this.sort;
  // //     });

  // //   }
  // // }

  // // CommentsSearch(value: String) {
  // //   this.searchtext = value;
  // //   // console.log('CommentsSearchvalue----------->>>', this.searchtext.length);
  // //   if (this.searchtext.length === 0) {
  // //     this.initializeValue();
  // //   } else {
  // //     if (this.organizationname === undefined && this.organizationname !== 'Stahls') {
  // //       this.ticketService.searchcomments(this.searchtext).subscribe(data => {
  // //         if (data === 'There is no Tickets') {
  // //           this.initializeValue();
  // //         } else {
  // //           this.filterArr = data;
  // //           // console.log('-------filter----------', this.filterArr);
  // //           this.commentsearch = [];
  // //           if (this.filterArr.length === 0) {
  // //             this.initializeValue();
  // //           } else {
  // //             this.filterArr.forEach(element => {
  // //               const singleObject = {
  // //                 uuid: '',
  // //                 id: element.id,
  // //                 Date: '',
  // //                 orderNumberList: [],
  // //                 Company: '',
  // //                 createdByName: '',
  // //                 assignedToName: [],
  // //                 type: '',
  // //                 status: '',
  // //                 PONumberList: [],
  // //                 Description: ''
  // //               };
  // //               singleObject.uuid = element.uuid;
  // //               singleObject.Date = element.Date;
  // //               singleObject.Description = element.description;
  // //               if (element.salesorder.length === 0) {
  // //                 singleObject.orderNumberList = [];
  // //               } else {
  // //                 for (let i = 0; i < element.salesorder.length; i++) {
  // //                   singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
  // //                 }
  // //               }
  // //               if (element.salesorder.length === 0) {
  // //                 singleObject.PONumberList = [];
  // //               } else {
  // //                 for (let i = 0; i < element.salesorder.length; i++) {
  // //                   singleObject.PONumberList.push(element.salesorder[i].PONumber);
  // //                 }
  // //               }
  // //               singleObject.createdByName = element.created_by.firstname;
  // //               if (element.assigned_to.length > 0) {
  // //                 for (let i = 0; i < element.assigned_to.length; i++) {
  // //                   singleObject.assignedToName.push(element.assigned_to[i].firstname);
  // //                 }
  // //               }
  // //               if (element.organizationUuid != null) {
  // //                 singleObject.Company = element.organization.organizationname;
  // //               }
  // //               singleObject.type = element.Type;
  // //               singleObject.status = element.Status;
  // //               this.commentsearch.push(singleObject);
  // //             });
  // //           }
  // //           // console.log('--------Searchoutput------>>>>>', this.commentsearch);
  // //           this.dataSource = new MatTableDataSource(this.commentsearch);
  // //           this.dataSource.paginator = this.paginator;
  // //           this.dataSource.sort = this.sort;
  // //           this.dataSource.sortingDataAccessor = (item, property) => {
  // //             switch (property) {
  // //               case 'Id': return item.id;
  // //               case 'Date': return item.Date;
  // //               case 'Order_number': return item.orderNumberList;
  // //               case 'Created_By': return item.createdByName.toLowerCase();
  // //               case 'organization': return item.Company.toLowerCase();
  // //               case 'Assigned_To': return item.assignedToName;
  // //               case 'Type': return item.type.toLowerCase();
  // //               case 'Status': return item.status.toLowerCase();
  // //               case 'PONumber': return item.PONumberList;
  // //               default: return item[property];
  // //             }
  // //           };

  // //         }
  // //       }, error => {
  // //         console.log('-----------Error--->>>', error);
  // //       });
  // //     } else {
  // //       this.ticketService.Orgsearchcomments(this.searchtext, this.orgUUID).subscribe(data => {
  // //         if (data === 'There is no Tickets') {
  // //           this.initializeValue();
  // //         } else {
  // //           this.filterArr = data;
  // //           // console.log('-------filter----------', this.filterArr);
  // //           this.commentsearch = [];
  // //           if (this.filterArr.length === 0) {
  // //             this.initializeValue();
  // //           } else {
  // //             this.filterArr.forEach(element => {
  // //               const singleObject = {
  // //                 uuid: '',
  // //                 id: element.id,
  // //                 Date: '',
  // //                 orderNumberList: [],
  // //                 Company: '',
  // //                 createdByName: '',
  // //                 assignedToName: [],
  // //                 type: '',
  // //                 status: '',
  // //                 PONumberList: [],
  // //                 Description: ''
  // //               };
  // //               singleObject.uuid = element.uuid;
  // //               singleObject.Date = element.Date;
  // //               singleObject.Description = element.description;
  // //               if (element.salesorder.length === 0) {
  // //                 singleObject.orderNumberList = [];
  // //               } else {
  // //                 for (let i = 0; i < element.salesorder.length; i++) {
  // //                   singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
  // //                 }
  // //               }
  // //               if (element.salesorder.length === 0) {
  // //                 singleObject.PONumberList = [];
  // //               } else {
  // //                 for (let i = 0; i < element.salesorder.length; i++) {
  // //                   singleObject.PONumberList.push(element.salesorder[i].PONumber);
  // //                 }
  // //               }
  // //               singleObject.createdByName = element.created_by.firstname;
  // //               if (element.assigned_to.length > 0) {
  // //                 for (let i = 0; i < element.assigned_to.length; i++) {
  // //                   singleObject.assignedToName.push(element.assigned_to[i].firstname);
  // //                 }
  // //               }
  // //               if (element.organizationUuid != null) {
  // //                 singleObject.Company = element.organization.organizationname;
  // //               }
  // //               singleObject.type = element.Type;
  // //               singleObject.status = element.Status;
  // //               this.commentsearch.push(singleObject);
  // //             });
  // //           }
  // //           // console.log('--------Searchoutput------>>>>>', this.commentsearch);
  // //           this.dataSource = new MatTableDataSource(this.commentsearch);
  // //           this.dataSource.paginator = this.paginator;
  // //           this.dataSource.sort = this.sort;
  // //           this.dataSource.sortingDataAccessor = (item, property) => {
  // //             switch (property) {
  // //               case 'Id': return item.id;
  // //               case 'Date': return item.Date;
  // //               case 'Order_number': return item.orderNumberList;
  // //               case 'Created_By': return item.createdByName.toLowerCase();
  // //               case 'organization': return item.Company.toLowerCase();
  // //               case 'Assigned_To': return item.assignedToName;
  // //               case 'Type': return item.type.toLowerCase();
  // //               case 'Status': return item.status.toLowerCase();
  // //               case 'PONumber': return item.PONumberList;
  // //               default: return item[property];
  // //             }
  // //           };

  // //         }
  // //       }, error => {
  // //         console.log('------Error-------->>>', error);
  // //       });
  // //     }

  // //   }
  // // }

  // FilterDetails() {
  //   this.filterArr = [];
  //   this.assignedvalue = [];
  //   this.createdvalue = [];
  //   this.statusvalue = [];
  //   this.orgvalue = [];
  //   if (this.organizationSelectedValue.length === 0 && this.createdBySelectedValue.length === 0 &&
  //     this.assignedToSelectedValue.length === 0 && this.statusSelectedValue.length === 0) {
  //     this.initializeValue();
  //   }
  //   /* The below condition is for filter two value which is organization and created by */
  //   if (this.organizationSelectedValue.length !== 0 && this.createdBySelectedValue.length !== 0 &&
  //     this.assignedToSelectedValue.length === 0 && this.statusSelectedValue.length === 0) {
  //     this.organizationSelectedValue.forEach(element => {
  //       this.orgvalue.push(element);
  //     });
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       this.orgvalue.forEach(organize => {
  //         this.createdvalue.forEach(created => {
  //           if (one.Company === organize && one.createdByName === created) {
  //             this.filterArr.push(one);
  //             console.log('---------twovalue---------', this.filterArr);
  //           }
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);

  //       console.log('');

  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below condition is for filtering three value organization,created by,assigned to */
  //   if (this.organizationSelectedValue.length !== 0 && this.createdBySelectedValue.length !== 0 &&
  //     this.assignedToSelectedValue.length !== 0 && this.statusSelectedValue.length === 0) {
  //     this.organizationSelectedValue.forEach(element => {
  //       this.orgvalue.push(element);
  //     });
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.orgvalue.forEach(organize => {
  //           this.createdvalue.forEach(created => {
  //             this.assignedvalue.forEach(name => {
  //               if (one.Company === organize && one.createdByName === created && element2 === name) {
  //                 this.filterArr.push(one);
  //                 console.log('---------threevalue---------', this.filterArr);
  //               }
  //             });
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below condition is for filtering three value status,created by,assigned to */
  //   if (this.statusSelectedValue.length !== 0 && this.createdBySelectedValue.length !== 0 &&
  //     this.assignedToSelectedValue.length !== 0 && this.organizationSelectedValue.length === 0) {
  //     this.statusSelectedValue.forEach(element => {
  //       this.statusvalue.push(element);
  //     });
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.statusvalue.forEach(status => {
  //           this.createdvalue.forEach(created => {
  //             this.assignedvalue.forEach(name => {
  //               if (one.status === status && one.createdByName === created && element2 === name) {
  //                 this.filterArr.push(one);
  //                 console.log('---------threevalue---------', this.filterArr);
  //               }
  //             });
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting two value which is Organization and assigned to  */
  //   if (this.organizationSelectedValue.length !== 0 && this.assignedToSelectedValue.length !== 0 &&
  //     this.createdBySelectedValue.length === 0 && this.statusSelectedValue.length === 0) {
  //     this.organizationSelectedValue.forEach(element => {
  //       this.orgvalue.push(element);
  //     });
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.orgvalue.forEach(organize => {
  //           this.assignedvalue.forEach(name => {
  //             if (one.Company === organize && element2 === name) {
  //               this.filterArr.push(one);
  //               console.log('---------twovalue1---------', this.filterArr);
  //             }
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting two value which is created by and assigned to  */
  //   if (this.createdBySelectedValue.length !== 0 && this.assignedToSelectedValue.length !== 0 &&
  //     this.statusSelectedValue.length === 0 && this.organizationSelectedValue.length === 0) {
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.createdvalue.forEach(create => {
  //           this.assignedvalue.forEach(name => {
  //             if (one.createdByName === create && element2 === name) {
  //               this.filterArr.push(one);
  //               console.log('---------twovalue2---------', this.filterArr);
  //             }
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting two value which is created by and status  */
  //   if (this.createdBySelectedValue.length !== 0 && this.statusSelectedValue.length !== 0 &&
  //     this.assignedToSelectedValue.length === 0 && this.organizationSelectedValue.length === 0) {
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.statusSelectedValue.forEach(element => {
  //       this.statusvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       this.createdvalue.forEach(created => {
  //         this.statusvalue.forEach(status => {
  //           if (one.createdByName === created && one.status === status) {
  //             this.filterArr.push(one);
  //             console.log('---------towvalue3---------', this.filterArr);
  //           }
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting two value which is assigned to and status  */
  //   if (this.assignedToSelectedValue.length !== 0 && this.statusSelectedValue.length !== 0
  //     && this.organizationSelectedValue.length === 0 && this.createdBySelectedValue.length === 0) {
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.statusSelectedValue.forEach(element => {
  //       this.statusvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.assignedvalue.forEach(name => {
  //           this.statusvalue.forEach(status => {
  //             if (element2 === name && one.status === status) {
  //               this.filterArr.push(one);
  //               console.log('---------twovalue4---------', this.filterArr);
  //             }
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting two value which is organization and status  */
  //   if (this.statusSelectedValue.length !== 0 && this.organizationSelectedValue.length !== 0 &&
  //     this.createdBySelectedValue.length === 0 && this.assignedToSelectedValue.length === 0) {
  //     this.statusSelectedValue.forEach(element => {
  //       this.statusvalue.push(element);
  //     });
  //     this.organizationSelectedValue.forEach(element => {
  //       this.orgvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       this.statusvalue.forEach(status => {
  //         this.orgvalue.forEach(organize => {
  //           if (one.status === status && one.Company === organize) {
  //             this.filterArr.push(one);
  //             console.log('---------twovalue5---------', this.filterArr);
  //           }
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting four value which is organization,created by,assigned to and status  */
  //   if (this.organizationSelectedValue.length !== 0 && this.createdBySelectedValue.length !== 0 &&
  //     this.assignedToSelectedValue.length !== 0 && this.statusSelectedValue.length !== 0) {
  //     this.organizationSelectedValue.forEach(element => {
  //       this.orgvalue.push(element);
  //     });
  //     this.createdBySelectedValue.forEach(element => {
  //       this.createdvalue.push(element);
  //     });
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.assignedvalue.push(element);
  //     });
  //     this.statusSelectedValue.forEach(element => {
  //       this.statusvalue.push(element);
  //     });
  //     this.showArrayObject.forEach(one => {
  //       one.assignedToName.forEach(element2 => {
  //         this.orgvalue.forEach(organize => {
  //           this.createdvalue.forEach(created => {
  //             this.assignedvalue.forEach(name => {
  //               this.statusvalue.forEach(status => {
  //                 if (one.Company === organize && one.createdByName === created && element2 === name && one.status === status) {
  //                   this.filterArr.push(one);
  //                   console.log('---------fourvalue---------', this.filterArr);
  //                 }
  //               });
  //             });
  //           });
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.filterdata = filterdata;
  //       this.filterValueChange();
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     });
  //     this.Tablesort();
  //   }
  //   /* The below filter is for filerting single value which is organization,created by,assigned to and status  */
  //   if (this.organizationSelectedValue.length !== 0 && this.createdBySelectedValue.length === 0 &&
  //     this.assignedToSelectedValue.length === 0 && this.statusSelectedValue.length === 0) {
  //     this.organizationSelectedValue.forEach(element => {
  //       this.showArrayObject.forEach(one => {
  //         if (one.Company === element) {
  //           this.filterArr.push(one);
  //           console.log('---------signle---------', this.filterArr);
  //         }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.filterdata = filterdata;
  //         this.filterValueChange();
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //     });
  //     this.Tablesort();
  //   }
  //   if (this.createdBySelectedValue.length !== 0 && this.organizationSelectedValue.length === 0 &&
  //     this.assignedToSelectedValue.length === 0 && this.statusSelectedValue.length === 0) {
  //     this.createdBySelectedValue.forEach(element => {
  //       this.showArrayObject.forEach(one => {
  //         if (one.createdByName === element) {
  //           this.filterArr.push(one);
  //           console.log('---------single1---------', this.filterArr);
  //         }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.filterdata = filterdata;
  //         this.filterValueChange();
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //     });
  //     this.Tablesort();
  //   }
  //   if (this.statusSelectedValue.length !== 0 && this.createdBySelectedValue.length === 0 &&
  //     this.organizationSelectedValue.length === 0 && this.assignedToSelectedValue.length === 0) {
  //     this.statusSelectedValue.forEach(element => {
  //       this.showArrayObject.forEach(one => {
  //         if (one.status === element) {
  //           this.filterArr.push(one);
  //           console.log('---------single2---------', this.filterArr);
  //         }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.filterdata = filterdata;
  //         this.filterValueChange();
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //     });
  //     this.Tablesort();
  //   }
  //   if (this.assignedToSelectedValue.length !== 0 && this.statusSelectedValue.length === 0 &&
  //     this.createdBySelectedValue.length === 0 && this.organizationSelectedValue.length === 0) {
  //     this.assignedToSelectedValue.forEach(element => {
  //       this.showArrayObject.forEach(one => {
  //         one.assignedToName.forEach(element2 => {
  //           // this.filterassignedname.push(element2);
  //           if (element2 === element) {
  //             this.filterArr.push(one);
  //             console.log('---------single3---------', this.filterArr);
  //           }

  //         });
  //         // if (this.filterassignedname === element) {
  //         //   this.filterArr.push(one);
  //         //   console.log('---------single3---------', this.filterArr);
  //         // }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.filterdata = filterdata;
  //         this.filterValueChange();
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //     });
  //     this.Tablesort();
  //   }


  //   // if (this.organizationSelectedValue.length !== 0) {
  //   //   this.organizationSelectedValue.forEach(element => {

  //   //     this.showArrayObject.forEach(one => {
  //   //       if (one.Company === element) {
  //   //         this.filterArr.push(one);
  //   //       }
  //   //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //   //       this.dataSource = new MatTableDataSource(filterdata);
  //   //       this.dataSource.paginator = this.paginator;
  //   //       this.dataSource.sort = this.sort;
  //   //     });

  //   //   });
  //   // }
  //   // if (this.createdBySelectedValue.length !== 0) {
  //   //   this.createdBySelectedValue.forEach(element => {

  //   //     this.showArrayObject.forEach(one => {
  //   //       if (one.createdByName === element) {
  //   //         this.filterArr.push(one);
  //   //       }
  //   //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //   //       this.dataSource = new MatTableDataSource(filterdata);
  //   //       this.dataSource.paginator = this.paginator;
  //   //       this.dataSource.sort = this.sort;
  //   //     });

  //   //   });
  //   // }
  //   // if (this.assignedToSelectedValue.length !== 0) {
  //   //   this.assignedToSelectedValue.forEach(element => {

  //   //     this.showArrayObject.forEach(one => {
  //   //       if (one.assignedToName.indexOf(element) > -1) {
  //   //         this.filterArr.push(one);
  //   //       }
  //   //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //   //       this.dataSource = new MatTableDataSource(filterdata);
  //   //       this.dataSource.paginator = this.paginator;
  //   //       this.dataSource.sort = this.sort;
  //   //     });

  //   //   });
  //   // }
  //   // if (this.statusSelectedValue.length !== 0) {
  //   //   this.statusSelectedValue.forEach(element => {

  //   //     this.showArrayObject.forEach(one => {
  //   //       if (one.status === element) {
  //   //         this.filterArr.push(one);
  //   //       }
  //   //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //   //       this.dataSource = new MatTableDataSource(filterdata);
  //   //       this.dataSource.paginator = this.paginator;
  //   //       this.dataSource.sort = this.sort;
  //   //     });

  //   //   });
  //   // }

  // }


  // filterValueChange() {

  //   //  console.log("filterData------------------------->",this.filterdata)

  //   this.filter_ticketOrganization = Array.from(new Set(this.filterdata.map((itemInArray) =>
  //     itemInArray.Company)));
  //   this.filter_ticketOrganization = this.filter_ticketOrganization.filter((obj) => obj.length > 0);

  //   this.filter_ticketCreated_By = Array.from(new Set(this.filterdata.map((itemInArray) => itemInArray.createdByName)));
  //   this.filter_ticketCreated_By = this.filter_ticketCreated_By.filter((obj) => obj.length > 0);


  //   this.filter_ticketStatus = Array.from(new Set(this.filterdata.map((customerArray => customerArray.status))));
  //   this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);


  //   this.filter_ticketAssigned_To = Array.from(new Set(this.filterdata.map((customerArray => customerArray.assignedToName[0]))));
  //   this.filter_ticketAssigned_To = this.filter_ticketAssigned_To.filter((obj) => obj !== undefined);



  // }


  // Tablesort() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'Id': return item.id;
  //       case 'Date': return item.Date;
  //       case 'Order_number': return item.orderNumberList;
  //       case 'Created_By': return item.createdByName.toLowerCase();
  //       case 'organization': return item.Company.toLowerCase();
  //       case 'Assigned_To': return item.assignedToName;
  //       case 'Type': return item.type.toLowerCase();
  //       case 'Status': return item.status.toLowerCase();
  //       case 'PONumber': return item.PONumberList;
  //       default: return item[property];
  //     }
  //   };
  // }
  // initializeValue() {
  //   this.dataSource = new MatTableDataSource(this.showArrayObject);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'Id': return item.id;
  //       case 'Date': return item.Date;
  //       case 'Order_number': return item.orderNumberList;
  //       case 'Created_By': return item.createdByName.toLowerCase();
  //       case 'organization': return item.Company.toLowerCase();
  //       case 'Assigned_To': return item.assignedToName;
  //       case 'Type': return item.type.toLowerCase();
  //       case 'Status': return item.status.toLowerCase();
  //       case 'PONumber': return item.PONumberList;
  //       default: return item[property];
  //     }
  //   };
  //   this.initilizeFilter();
  // }

  // initilizeFilter() {

  //   this.filter_ticketCreated_By = Array.from(new Set(this.listOfTickets.map((itemInArray) => itemInArray.created_by.firstname)));
  //   const arrayOfAssignedUser = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  //     itemInArray.assigned_to.map((InsideArray) => InsideArray.firstname))));
  //   const listOfNames = [];
  //   arrayOfAssignedUser.forEach(element => {
  //     // console.log('entering into filter ------- ', element.length);
  //     for (let i = 0; i < element.length; i++) {
  //       if (listOfNames.indexOf(element[i]) > -1) {

  //       } else {
  //         listOfNames.push(element[i]);
  //       }
  //     }
  //   });
  //   this.filter_ticketAssigned_To = listOfNames;
  //   // console.log('testing filter in ticket assigned are --------- ', this.filter_ticketAssigned_To);
  //   this.filter_ticketStatus = Array.from(new Set(this.listOfTickets.map((customerArray => customerArray.Status))));
  //   this.filter_ticketOrganization = Array.from(new Set(this.listOfTickets.map((itemInArray) =>
  //     itemInArray.organization.organizationname)));
  //   // filter
  //   this.filter_ticketAssigned_To = this.filter_ticketAssigned_To.filter((obj) => obj.length > 0);
  //   this.filter_ticketCreated_By = this.filter_ticketCreated_By.filter((obj) => obj.length > 0);
  //   this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);
  //   this.filter_ticketOrganization = this.filter_ticketOrganization.filter((obj) => obj.length > 0);

  // }
}
