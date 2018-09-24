import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatRadioChange } from '@angular/material';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IOrders } from './IOrder';
import { OrderService } from './orders.service';
import { setTimeout } from 'timers-browserify';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { OrderDataSource } from './orderDataSource';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DatePipe } from '@angular/common';


declare var jquery: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  @ViewChild('ExportCSV')
  ExportcsvModal: ModalComponent;
  displayedColumns = ['OrderNumber', 'CompanyCode', 'PONumber', 'Comments7',
    'OrderDate', 'RequiredDate', 'CustomerDueDate', 'Tickets', 'StatusName'];
  dataSource: OrderDataSource;
  companycode: string;
  public notificationDetails: any[] = [];
  locationSelectedValue: String[] = [];
  ticketSelectedValue: String[] = [];
  statusSelectedValue: String[] = [];
  styleOptionSelectedValue: String[] = [];
  filterValue: any;

  pageNo: number;

  filterLocation = new FormControl();
  filterTicket = new FormControl();
  filterStatus = new FormControl();
  filterStyleOption = new FormControl();

  // notificationValue
  InComplete: boolean;
  Complete: boolean;
  Processed: boolean;
  Shipped: boolean;
  Void: boolean;
  Released: boolean;
  Hold: boolean;
  Committed: boolean;
  Forecast: boolean;
  Quote: boolean;
  Available: boolean;
  CompleteOrders: number;
  InCompleteOrders: number;
  ProcessedOrders: number;
  ShippedOrders: number;
  VoidOrders: number;
  ReleasedOrders: number;
  HoldOrders: number;
  CommittedOrders: number;
  ForecastOrders: number;
  QuoteOrders: number;
  AvailableOrders: number;
  StatusName: String = '';
  public dateRange = {
    'startdate': '',
    'enddate': ''
  };
  public exportOption: String[] = ['SalesOrder'];
  public exportValue: String;
  constructor(private orderService: OrderService, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, private dailog: MatDialog, private datePipe: DatePipe) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization !== null) {
      if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode !== null) {
        this.companycode = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode;
      }
    }
  }


  ngOnInit() {
    this.spinnerService.show();
    this.locationSelectedValue = [];
    this.ticketSelectedValue = [];
    this.statusSelectedValue = [];
    this.styleOptionSelectedValue = [];
    this.pageNo = 1;
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.getCountByStatusName();
    } else {
      this.getStatusNameCountByCode();
    }
  }
  loadDataPage() {
    if (this.StatusName === '') {
      if (this.companycode === undefined || this.companycode === 'STAHLS') {
        this.pageNo = this.paginator.pageIndex + 1;
        this.dataSource.loadDatas(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.input.nativeElement.value,
          this.locationSelectedValue,
          this.ticketSelectedValue,
          this.statusSelectedValue,
          this.styleOptionSelectedValue
        );
      } else {
        this.pageNo = this.paginator.pageIndex + 1;
        this.dataSource.loadDatasByCompanyCode(
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.input.nativeElement.value,
          this.locationSelectedValue,
          this.ticketSelectedValue,
          this.statusSelectedValue,
          this.styleOptionSelectedValue,
          this.companycode
        );
      }
    } else {
      this.getSalesOrderByStatusName(this.StatusName);
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

  // without company code
  getCountByStatusName() {
    this.orderService.getCountByStatusName().subscribe(
      data => {
        this.notificationDetails = data;
        this.notificationDetails.forEach(element => {
          if (element.StatusName === 'Complete') {
            this.Complete = true;
            this.CompleteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Incomplete') {
            this.InComplete = true;
            this.InCompleteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Processed') {
            this.Processed = true;
            this.ProcessedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Shipped') {
            this.Shipped = true;
            this.ShippedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Void') {
            this.Void = true;
            this.VoidOrders = element.StatusCount;
          }
          if (element.StatusName === 'Released') {
            this.Released = true;
            this.ReleasedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Hold') {
            this.Hold = true;
            this.HoldOrders = element.StatusCount;
          }
          if (element.StatusName === 'Committed') {
            this.Committed = true;
            this.CommittedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Forecast') {
            this.Forecast = true;
            this.ForecastOrders = element.StatusCount;
          }
          if (element.StatusName === 'Quote') {
            this.Quote = true;
            this.QuoteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Available') {
            this.Available = true;
            this.AvailableOrders = element.StatusCount;
          }

        });
        this.getAllOrders();
      },
      error => {
        this.getAllOrders();
        console.log('something went wrong');
      }
    );
  }


  getAllOrders() {
    this.dataSource = new OrderDataSource(this.orderService);

    this.dataSource.loadDatas(0, 25, 'OrderDate', 'desc', '', this.locationSelectedValue,
      this.ticketSelectedValue,
      this.statusSelectedValue,
      this.styleOptionSelectedValue
    );
    console.log('entering into get all order', this.dataSource);
    this.getFilterValue();

  }

  getFilterValue() {
    console.log('entering into get filet value');
    this.orderService.getFilterValue().subscribe(
      data => {
        console.log('entering into get filet value---->>>>>>', data);
        this.filterValue = data;
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }

  getFilterValueData(filterValueData) {
    console.log('entering into get filet value Data');
    this.orderService.getFilterValueData(filterValueData).subscribe(
      data => {
        console.log('response-------------->>>>>>', data);
        this.filterValue = data;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }


  // with company code
  getStatusNameCountByCode() {
    this.orderService.getStatusNameCountByCode(this.companycode).subscribe(
      data => {
        this.notificationDetails = data;
        this.notificationDetails.forEach(element => {
          if (element.StatusName === 'Complete') {
            this.Complete = true;
            this.CompleteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Incomplete') {
            this.InComplete = true;
            this.InCompleteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Processed') {
            this.Processed = true;
            this.ProcessedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Shipped') {
            this.Shipped = true;
            this.ShippedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Void') {
            this.Void = true;
            this.VoidOrders = element.StatusCount;
          }
          if (element.StatusName === 'Released') {
            this.Released = true;
            this.ReleasedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Hold') {
            this.Hold = true;
            this.HoldOrders = element.StatusCount;
          }
          if (element.StatusName === 'Committed') {
            this.Committed = true;
            this.CommittedOrders = element.StatusCount;
          }
          if (element.StatusName === 'Forecast') {
            this.Forecast = true;
            this.ForecastOrders = element.StatusCount;
          }
          if (element.StatusName === 'Quote') {
            this.Quote = true;
            this.QuoteOrders = element.StatusCount;
          }
          if (element.StatusName === 'Available') {
            this.Available = true;
            this.AvailableOrders = element.StatusCount;
          }

        });
        this.getAllOrdersByCompanyCode();
      },
      error => {
        this.getAllOrdersByCompanyCode();
        console.log('something went wrong');

      }
    );
  }

  getAllOrdersByCompanyCode() {
    console.log('entering into get all order company code');
    this.dataSource = new OrderDataSource(this.orderService);

    this.dataSource.loadDatasByCompanyCode(0, 25, 'OrderDate', 'desc', '',
      this.locationSelectedValue, this.ticketSelectedValue,
      this.statusSelectedValue,
      this.styleOptionSelectedValue, this.companycode);
    this.getFilterValueByCompanyCode();
  }

  getFilterValueByCompanyCode() {
    this.orderService.getFilterValueByCompanyCode(this.companycode).subscribe(
      data => {
        this.filterValue = data;
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }

  getFilterValueDataByCompanyCode(filterData) {
    this.orderService.getFilterValueDataByCompanyCode(filterData, this.companycode).subscribe(
      data => {
        this.filterValue = data;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  radioChange(event: MatRadioChange) {
    this.exportValue = event.value;

  }

  Dismiss() {
    this.Complete = false;
    this.InComplete = false;
    this.Shipped = false;
    this.Processed = false;
    this.Void = false;
    this.Hold = false;
    this.Committed = false;
    this.Released = false;
    this.Forecast = false;
    this.Quote = false;
    this.Available = false;
    this.StatusName = '';
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  closeClick(statusName: String) {
    if (statusName === 'Complete') {
      this.Complete = false;
      this.loadInitialPage();
    } else if (statusName === 'Incomplete') {
      this.InComplete = false;
      this.loadInitialPage();
    } else if (statusName === 'Processed') {
      this.Processed = false;
      this.loadInitialPage();
    } else if (statusName === 'Shipped') {
      this.Shipped = false;
      this.loadInitialPage();
    } else if (statusName === 'Void') {
      this.Void = false;
      this.loadInitialPage();
    } else if (statusName === 'Released') {
      this.Released = false;
      this.loadInitialPage();
    } else if (statusName === 'Hold') {
      this.Hold = false;
      this.loadInitialPage();
    } else if (statusName === 'Committed') {
      this.Committed = false;
      this.loadInitialPage();
    } else if (statusName === 'Forecast') {
      this.Forecast = false;
      this.loadInitialPage();
    } else if (statusName === 'Quote') {
      this.Quote = false;
      this.loadInitialPage();
    } else if (statusName === 'Available') {
      this.Available = false;
      this.loadInitialPage();
    } else {
      this.Dismiss();
    }

  }
  loadInitialPage() {
    this.StatusName = '';
    this.loadDataPage();

  }
  exportCSV() {
    this.dateRange.startdate = '';
    this.dateRange.enddate = '';
    this.ExportcsvModal.open();
  }
  exportDetails() {
    const addDate = new Date(this.dateRange.enddate);
    const constructDate = new Date(addDate.getFullYear(), addDate.getMonth(), addDate.getDate() + 1);
    const endDate = this.datePipe.transform(constructDate, 'yyyy-MM-dd');
    const object = {
      startDate: this.dateRange.startdate,
      endDate: endDate
    };
    this.ExportcsvModal.close();
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.orderService.getExportOrders(object).subscribe(
        data => {
          this.exportData(data);
        },
        error => {

        }
      );
    } else {
      this.orderService.getExportOrdersByCode(object, this.companycode).subscribe(
        data => {
          this.exportData(data);
        },
        error => {

        }
      );
    }
  }
  exportData(data) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        'uuid', 'OrderID', 'DataExportID', 'DataExportDate', 'CompanyID', 'CompanyCode',
        'OrderNumber', 'StatusName', 'ShipDate', 'InvoiceDate', 'ShipCount', 'StatusID', 'CustomerID', 'PONumber',
        'OrderDate', 'RequiredDate', 'RequestCount', 'ActualCount', 'AllocateCount', 'CustomerCode', 'ForecastFinish', 'Tickets',
        'ShipperNumber', 'CustomerPODate', 'Comments9', 'AllocateDate', 'CustomerDueDate', 'Comments7'
      ],
      title: 'Order-Report'
    };

    // tslint:disable-next-line:no-unused-expression
    new Angular5Csv(data, 'Order-Report', options);
  }

  locationFilter() {


    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'Tickets', 'value': this.filterTicket.value },
      { 'filter': 'StatusName', 'value': this.filterStatus.value },
      { 'filter': 'Comments7', 'value': this.filterStyleOption.value }
    ];

    const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      if (getValue) {
        this.getFilterValueData(filterValueData);
      } else { this.getFilterValue(); }
    } else {
      if (getValue) {
        this.getFilterValueDataByCompanyCode(filterValueData);
      } else { this.getFilterValueByCompanyCode(); }
    }


    this.locationSelectedValue = this.filterLocation.value;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  ticketFilter() {
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'Tickets', 'value': this.filterTicket.value },
      { 'filter': 'StatusName', 'value': this.filterStatus.value },
      { 'filter': 'Comments7', 'value': this.filterStyleOption.value }
    ];
    const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      if (getValue) {
        this.getFilterValueData(filterValueData);
      } else { this.getFilterValue(); }
    } else {
      if (getValue) {
        this.getFilterValueDataByCompanyCode(filterValueData);
      } else { this.getFilterValueByCompanyCode(); }
    }

    // console.log("locationFilter2---------------->",filterValueData)
    // this.getFilterValueData(filterValueData)
    this.ticketSelectedValue = this.filterTicket.value;
    console.log('selected color filter are ---- ', this.ticketSelectedValue);
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  statusFilter() {
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'Tickets', 'value': this.filterTicket.value },
      { 'filter': 'StatusName', 'value': this.filterStatus.value },
      { 'filter': 'Comments7', 'value': this.filterStyleOption.value }
    ];

    const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      if (getValue) {
        this.getFilterValueData(filterValueData);
      } else { this.getFilterValue(); }
    } else {
      if (getValue) {
        this.getFilterValueDataByCompanyCode(filterValueData);
      } else { this.getFilterValueByCompanyCode(); }
    }

    // console.log("locationFilter3---------------->",filterValueData)
    // this.getFilterValueData(filterValueData)
    this.statusSelectedValue = this.filterStatus.value;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }

  styleOptionFilter() {
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'Tickets', 'value': this.filterTicket.value },
      { 'filter': 'StatusName', 'value': this.filterStatus.value },
      { 'filter': 'Comments7', 'value': this.filterStyleOption.value }
    ];

    const getValue = filterValueData.some(function (el) { return el.value !== null && el.value[0] !== undefined; });

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      if (getValue) {
        this.getFilterValueData(filterValueData);
      } else { this.getFilterValue(); }
    } else {
      if (getValue) {
        this.getFilterValueDataByCompanyCode(filterValueData);
      } else { this.getFilterValueByCompanyCode(); }
    }

    // console.log("locationFilter4---------------->",filterValueData)
    // this.getFilterValueData(filterValueData)
    this.styleOptionSelectedValue = this.filterStyleOption.value;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }


  getSalesOrderByStatusName(statusName: String) {
    if (this.StatusName !== statusName) {
      this.paginator.pageIndex = 0;
    }
    this.StatusName = statusName;
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.dataSource.loadDatasByStatusName(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.locationSelectedValue,
        this.ticketSelectedValue,
        this.statusSelectedValue,
        this.styleOptionSelectedValue,
        statusName
      );
    } else {
      this.dataSource.loadDatasByStatusNameCompanyCode(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.locationSelectedValue,
        this.ticketSelectedValue,
        this.statusSelectedValue,
        this.styleOptionSelectedValue,
        statusName,
        this.companycode
      );
    }
  }


  onRowSelected(row) {
    this.router.navigate(['/order-detail'], { queryParams: { orderId: row.OrderID } });
  }
}

