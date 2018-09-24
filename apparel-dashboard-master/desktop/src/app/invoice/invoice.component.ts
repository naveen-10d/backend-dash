import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, AfterViewInit } from '@angular/core';

import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IInvoices } from './Iinvoices';
import { InvoiceService } from './invoice.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { InvoiceDataSource } from './invoiceDataSource';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  animations: [
    trigger('detailExpand', [
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  public filter_invoiceItems: any = [];
  public filter_invoiceStatus: any = [];
  public filterArr: any[];
  filterItems = new FormControl();
  filterStatus = new FormControl();
  public listOfInvoices: IInvoices[] = [];
  public status = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  public IInvoices: IInvoices = {
    uuid: '',
    date: '',
    status: '',
    items: 0,
    orderId: '',
    total: 0,
    SalesOrder: [],
    InvoiceDetails: []
  };
  public itemSelectedValue: String[] = [];
  public statusSelectedValue: String[] = [];
  filterValue: any;
  ItemsValue: any[] = [];
  dataSource: InvoiceDataSource;
  filterdata: any = [];
  companycode: String;
  pageNo: number;
  displayedColumns = ['InvoiceNumber', 'InvoiceDate', 'OrderID', 'Items', 'TotalPrice', 'StatusName'];
  // displayedColumns = ['InvoiceNumber', 'Date', 'OrderID', 'Items', 'Total', 'Status'];
  itemArrays: String[] = [];
  statusArrays: String[] = [];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private invoiceService: InvoiceService, private spinnerService: Ng4LoadingSpinnerService, private dailog: MatDialog) { }

  ngOnInit() {
    this.spinnerService.show();
    this.pageNo = 1;
    this.intializeCurrentUser();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }




  loadDataPage() {
    console.log('test--------->');

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatas(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.itemSelectedValue,
        this.statusSelectedValue
      );
    } else {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatasByCompanyCode(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.itemSelectedValue,
        this.statusSelectedValue,
        this.companycode
      );
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





  intializeCurrentUser() {
    console.log('purchase order current user are ----- ', JSON.parse(sessionStorage.getItem('currentUser')).user.organization);
    const organizationDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.organization;
    if (organizationDetails !== null) {
      if (organizationDetails.PolypmCompanyCode !== null && organizationDetails.PolypmCompanyCode !== 'STAHLS') {
        // this.getAllInvoicesByOrg(organizationDetails.PolypmCompanyCode);
        this.companycode = organizationDetails.PolypmCompanyCode;
        this.getAllInvoicesByCode();
      } else {
        this.getAllInvoices();
      }
    } else {
      this.getAllInvoices();
    }
  }

  getAllInvoices() {
    console.log('entering into get all invoices are ----- ');
    this.dataSource = new InvoiceDataSource(this.invoiceService, this.dailog);

    this.dataSource.loadDatas(0, 25, 'InvoiceNumber', 'desc', '', this.itemSelectedValue,
      this.statusSelectedValue
    );
    console.log('entering into get all invoice', this.dataSource);
    this.getFilterValue();

  }

  getFilterValue() {
    console.log('entering into get filet value');
    this.invoiceService.getFilterValue().subscribe(
      data => {
        // console.log('@@@@@ entering into get filet value---->>>>>>', data);
        this.filterValue = data;
        this.ItemsValue = Array.from(new Set(this.filterValue.item.map((itemArray) => itemArray.count)));
        // console.log('after response fo filter values are ----- ', this.ItemsValue);
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }


  // getFilterValueData(filterValueData) {
  //   console.log('entering into get filet value Data');
  //   this.invoiceService.getFilterValueData(filterValueData).subscribe(
  //     data => {
  //       console.log('response-------------->>>>>>', data);
  //       this.filterValue = data;
  //       // const filter_items = Array.from(new Set(this.filterValue.item.map((itemArray) => itemArray.count)));
  //       // console.log("after response fo filter values are ----- ", filter_items);
  //     },
  //     error => {
  //       console.log('something went wrong');
  //     }
  //   );
  // }


  getAllInvoicesByCode() {
    console.log('entering into get all order company code');
    this.dataSource = new InvoiceDataSource(this.invoiceService, this.dailog);

    this.dataSource.loadDatasByCompanyCode(0, 25, 'InvoiceNumber', 'desc', '',
      this.itemSelectedValue,
      this.statusSelectedValue, this.companycode);
    this.getFilterValueByCompanyCode();
  }

  getFilterValueByCompanyCode() {
    this.invoiceService.getFilterValueByCompanyCode(this.companycode).subscribe(
      data => {
        this.filterValue = data;
        this.ItemsValue = Array.from(new Set(this.filterValue.item.map((itemArray) => itemArray.count)));
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }

  ItemsFilter() {
    this.itemSelectedValue = [];
    this.paginator.pageIndex = 0;
    console.log('filter valeus in item filter are ---- -', this.filterItems.value, this.filterValue);
    this.filterItems.value.forEach(countValue => {
      this.filterValue.item.forEach(item => {
        if (item.count === countValue) {
          this.itemSelectedValue.push(item.ShipmentID);
        }
      });
    });
    this.loadDataPage();
  }

  StatusFilter() {
    this.statusSelectedValue = [];
    this.paginator.pageIndex = 0;
    console.log('filter valeus in status filter are ---- -', this.filterStatus.value);
    this.statusSelectedValue = this.filterStatus.value;
    this.loadDataPage();
  }

  // getFilterValueDataByCompanyCode(filterData) {
  //   this.invoiceService.getFilterValueDataByCompanyCode(filterData, this.companycode).subscribe(
  //     data => {
  //       this.filterValue = data;
  //     },
  //     error => {
  //       console.log('something went wrong');
  //     }
  //   );
  // }


  // ItemsFilter() {


  //   const filterValueData = [
  //     { 'filter': 'Items', 'value': this.filterItems.value },
  //     { 'filter': 'StatusName', 'value': this.filterStatus.value }
  //   ];

  //   const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

  //   if (this.companycode === undefined || this.companycode === 'STAHLS') {
  //     if (getValue) {
  //       this.getFilterValueData(filterValueData);
  //     } else { this.getFilterValue(); }
  //   } else {
  //     if (getValue) {
  //       this.getFilterValueDataByCompanyCode(filterValueData);
  //     } else { this.getFilterValueByCompanyCode(); }
  //   }


  //   this.itemSelectedValue = this.filterItems.value;
  //   this.paginator.pageIndex = 0;
  //   this.loadDataPage();
  // }
  // StatusFilter() {
  //   const filterValueData = [
  //     { 'filter': 'Items', 'value': this.filterItems.value },
  //     { 'filter': 'StatusName', 'value': this.filterStatus.value }
  //   ];
  //   const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

  //   if (this.companycode === undefined || this.companycode === 'STAHLS') {
  //     if (getValue) {
  //       this.getFilterValueData(filterValueData);
  //     } else { this.getFilterValue(); }
  //   } else {
  //     if (getValue) {
  //       this.getFilterValueDataByCompanyCode(filterValueData);
  //     } else { this.getFilterValueByCompanyCode(); }
  //   }

  //   // console.log("locationFilter2---------------->",filterValueData)
  //   // this.getFilterValueData(filterValueData)
  //   this.statusSelectedValue = this.filterStatus.value;
  //   this.paginator.pageIndex = 0;
  //   this.loadDataPage();
  // }

  OpenDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = ' No Data in Invoice';
    const dialogRef = this.dailog.open(AlertDialogComponent, dialogConfig);
  }

  // getAllInvoices() {
  //   this.invoiceService.getallInvoice()
  //     .subscribe(data => {
  //       if (data === 'There is no Invoice') {
  //         this.OpenDialog();
  //         this.listOfInvoices = [];
  //         this.spinnerService.hide();
  //         this.dataSource = new MatTableDataSource(this.listOfInvoices);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       } else {
  //         this.listOfInvoices = data;
  //         this.spinnerService.hide();
  //         this.dataSource = new MatTableDataSource(this.listOfInvoices);
  //         this.sortPage();
  //         this.filterOptions();
  //       }
  //     },
  //       error => {
  //         this.spinnerService.hide();
  //         console.log('error------->', error);
  //       });
  // }
  // getAllInvoicesByOrg(orgName) {
  //   this.invoiceService.getAllInvoiceByOrg(orgName).subscribe(
  //     data => {
  //       if (data === 'There is no Invoice') {
  //         this.OpenDialog();
  //         this.spinnerService.hide();
  //         this.listOfInvoices = [];
  //         this.dataSource = new MatTableDataSource(this.listOfInvoices);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       } else {
  //         this.listOfInvoices = data;
  //         this.spinnerService.hide();
  //         this.dataSource = new MatTableDataSource(this.listOfInvoices);
  //         this.sortPage();
  //         this.filterOptions();
  //       }
  //     },
  //     error => {
  //       this.spinnerService.hide();
  //       console.log('something went wrong');
  //     }
  //   );
  // }


  // filterOptions() {
  //   this.filter_invoiceItems = Array.from(new Set(this.listOfInvoices.map((itemInArray) => itemInArray.InvoiceDetails.length)));
  //   // this.filter_invoiceStatus = Array.from(new Set(this.listOfInvoices.map((customerArray => customerArray.status))));
  //   this.filter_invoiceStatus = Array.from(new Set(this.listOfInvoices.map((customerArray) => customerArray.SalesOrder.StatusName)));
  //   this.filter_invoiceStatus = this.filter_invoiceStatus.filter((obj) => obj !== null && obj !== undefined);
  //   this.filter_invoiceItems = this.filter_invoiceItems.sort((a: any, b: any) => a - b);
  //   this.filter_invoiceStatus = this.filter_invoiceStatus.sort();
  // }



  //   applyFilter(filterValue: string) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource.filter = filterValue;
  //   }


  //   ItemsFilter() {
  //     this.itemfilter = this.selectfilter.value;
  //     //this.filter();
  //   }

  //   StatusFilter() {
  //     this.statusfilter = this.selectfilter.value;
  //     //this.filter();
  //   }

  // filter() {
  //   this.filterArr = [];
  //   this.itemvalue = [];
  //   this.statusvalue = [];
  //   if (this.itemfilter.length === 0 && this.statusfilter.length === 0) {
  //     this.initializeValue();
  //   }
  //   if (this.itemfilter.length !== 0 && this.statusfilter.length === 0) {
  //     this.itemfilter.forEach(element => {

  //       this.listOfInvoices.forEach(one => {
  //         if (one.InvoiceDetails.length === element) {
  //           this.filterArr.push(one);
  //         }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.filterdata=filterdata
  //         this.sortPage();
  //       });

  //     });

  //    this.filter_invoiceStatus = Array.from(new Set(this.filterdata.map((customerArray) => customerArray.SalesOrder.StatusName)));
  //    this.filter_invoiceStatus = this.filter_invoiceStatus.filter((obj) => obj !== null && obj !== undefined);
  //    this.filter_invoiceStatus = this.filter_invoiceStatus.sort();
  //   }
  //   if (this.statusfilter.length !== 0 && this.itemfilter.length === 0) {
  //     this.statusfilter.forEach(element => {

  //       this.listOfInvoices.forEach(one => {
  //         if (one.SalesOrder.StatusName === element) {
  //           this.filterArr.push(one);
  //         }
  //         const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //         this.filterdata=filterdata
  //         this.dataSource = new MatTableDataSource(filterdata);
  //         this.sortPage();
  //       });

  //     });

  //     this.filter_invoiceItems = Array.from(new Set(this.filterdata.map((itemInArray) => itemInArray.InvoiceDetails.length)));
  //     this.filter_invoiceItems = this.filter_invoiceItems.sort((a: any, b: any) => a - b);
  //   }
  //   if (this.itemfilter.length !== 0 && this.statusfilter.length !== 0) {
  //     this.itemfilter.forEach(element => {
  //       this.itemvalue.push(element);
  //     });
  //     this.statusfilter.forEach(element2 => {
  //       this.statusvalue.push(element2);
  //     });
  //     this.listOfInvoices.forEach(one => {
  //       this.itemvalue.forEach(number => {
  //         this.statusvalue.forEach(status => {
  //           if (one.InvoiceDetails.length === number && one.SalesOrder.StatusName === status) {
  //             this.filterArr.push(one);
  //           }
  //         });
  //       });
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(filterdata);
  //       this.sortPage();
  //     });

  //   }

  // }

  // initializeValue() {
  //   this.dataSource = new MatTableDataSource(this.listOfInvoices);
  //   this.filterOptions();
  //   this.sortPage();
  // }

  // sortPage() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     switch (property) {
  //       case 'Number': return item.InvoiceNumber;
  //       case 'Date': return item.InvoiceDate;
  //       case 'OrderID': return item.SalesOrder.OrderID;
  //       case 'Items': return item.InvoiceDetails.length;
  //       case 'Total': return item.TotalPrice;
  //       case 'Status': return item.StatusName;
  //       default: return item[property];
  //     }
  //   };
  // }

}
