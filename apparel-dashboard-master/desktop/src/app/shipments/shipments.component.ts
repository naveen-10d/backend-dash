import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatRadioChange } from '@angular/material';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IShipments } from './IShipments';
declare var jquery: any;
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { ShipmentDataSource } from './ShipmentsDataSource';
import { ShipmentsService } from './shipments.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';


@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css']
})
export class ShipmentsComponent implements OnInit {
  //  docDate = 'Jun 15, 2015, 21:43:11 UTC';
  date = new FormControl(new Date());
  serializedDate = new FormControl();
  public filter_PONumber: any = [];
  public filter_shipmentMethod: any[];
  public filter_Style: String[] = [];
  public filter_Customer: any[];
  public beforeFilter_shipmentStatus: any[];
  public filter_shipmentStatus: string[];
  public selectedValue: any[];
  public filterArr: any[];
  public listOfShipments: any[] = [];
  public startDate: String;
  public endDate: String;
  public startDateMin: Date = new Date(2000, 0, 1);
  public startDateMax: Date = new Date();
  public endDateMin: Date = new Date(2000, 0, 1);
  public endDateMax: Date = new Date();
  public endDateDisable: boolean;
  public exportValue: String;
  pageNo: number;
  public filterValue: any;

  filterdata: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  @ViewChild('ExportCSV')
  ExportcsvModal: ModalComponent;

  selectfilter = new FormControl();
  public IShipments: IShipments = {
    uuid: '',
    OrderUuid: '',
    item: 0,
    shipmentinfo: '',
    date: [],
    time: [],
    location: [],
    activity: []
  };
  public listOfShipment;
  public povalue: any;
  public customervalue: any;
  selectedLocation: any;
  public companyCode: String;
  public startdate: String = '';
  public enddate: String = '';
  displayedColumns = ['PONumber', 'ShipToName', 'ShipCity', 'State', 'Waybill', 'ShipDate', 'ShipMethod'];
  // dataSource: MatTableDataSource<IOrders>;
  dataSource: ShipmentDataSource;

  public shipmentdata = [];
  public ponfilter: String[] = [];
  public customerfilter: String[] = [];
  constructor(private spinnerservice: Ng4LoadingSpinnerService, private shipmentsService: ShipmentsService, private router: Router,
    private dailog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit() {
    this.endDateDisable = true;
    this.spinnerservice.show();
    this.intializeCurrentUser();
    // this.getAllShipments();

  }

  // tslint:disable-next-line:use-life-cycle-interface
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
    if (this.companyCode === undefined || this.companyCode === 'STAHLS') {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatas(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.ponfilter,
        this.startDate,
        this.endDate
      );
    } else {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatasByCompanyCode(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.ponfilter,
        this.companyCode,
        this.startDate,
        this.endDate
      );
    }
  }

  intializeCurrentUser() {
    console.log('purchase order current user are ----- ', JSON.parse(sessionStorage.getItem('currentUser')).user.organization);
    const organizationDetails = JSON.parse(sessionStorage.getItem('currentUser')).user.organization;
    if (organizationDetails !== null) {
      if (organizationDetails.PolypmCompanyCode !== null && organizationDetails.PolypmCompanyCode !== 'STAHLS') {
        this.companyCode = organizationDetails.PolypmCompanyCode;
        this.getAllShipmentsByOrg(organizationDetails.PolypmCompanyCode);
      } else {
        this.getAllShipments();
      }
      // this.orgUUID = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
      // this.organizationname = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.organizationname;
    } else {
      this.getAllShipments();
    }
  }

  getAllShipments() {
    this.dataSource = new ShipmentDataSource(this.shipmentsService, this.dailog);

    this.dataSource.loadDatas(0, 25, 'PONumber', 'desc', '', this.ponfilter, this.startDate, this.endDate);
    this.spinnerservice.hide();
    if (this.dataSource.countValue === 0) {
      // this.OpenDialog();
    } else {
      this.getFilterValue();
    }

  }
  getAllShipmentsByOrg(orgName) {

    this.dataSource = new ShipmentDataSource(this.shipmentsService, this.dailog);

    this.dataSource.loadDatasByCompanyCode(0, 25, 'PONumber', 'desc', '', this.ponfilter, this.companyCode, this.startDate, this.endDate);
    this.spinnerservice.hide();
    if (this.dataSource.countValue === 0) {
      // this.OpenDialog();
    } else {
      this.getFilterValueByCompanyCode();
    }

  }
  getFilterValue() {
    this.shipmentsService.getFilterValue().subscribe(
      data => {
        console.log('filter data---------->', data);
        this.filterValue = data;
        this.spinnerservice.hide();
      },
      error => {
        this.spinnerservice.hide();
        console.log('something went wrong');
      }
    );
  }

  getFilterValueByCompanyCode() {
    this.shipmentsService.getFilterValueByCompanyCode(this.companyCode).subscribe(
      data => {
        this.filterValue = data;
        console.log('filter values are ----- ', this.filterValue);
        this.spinnerservice.hide();
      },
      error => {
        this.spinnerservice.hide();
        console.log('something went wrong');
      }
    );
  }




  PONumberFilter() {
    this.ponfilter = this.selectfilter.value;
    this.paginator.pageIndex = 0;
    this.loadDataPage();
    // this.filter();
  }
  startDateCalcs(event) {
    this.convert(event, 'startDate');
  }
  endDateCalcs(event) {
    this.convert(event, 'endDate');
  }
  startDataInput() {
    this.convert(this.startDate, 'startDate');
  }
  endDataInput() {
    this.convert(this.endDate, 'endDate');
  }
  convert(str, methodName) {
    const mnths = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    },
      date = str.toString().split(' ');
    if (methodName === 'startDate') {
      this.startDate = [date[3], mnths[date[1]], date[2]].join('-');
      // console.log('start date valeus in order are ---- ', date[3] , date[2] , mnths[date[1]]);
      this.endDateDisable = false;

    }
    if (methodName === 'endDate') {
      this.endDate = [date[3], mnths[date[1]], date[2]].join('-');
    }
    // console.log('current date are ------ ' , [date[3], mnths[date[1]], date[2]].join("-"))
    this.filterDate();
  }

  filterDate() {
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.loadDataPage();
    } else {
      this.loadDataPage();
    }
    this.shipmentsService.getPonumberbyDate(this.startDate, this.endDate).subscribe(data => {
      this.filterValue = data;
      // this.dataSource.loadDatas(0, 25, 'PONumber', 'desc', '', this.ponfilter, this.startDate, this.endDate);
      this.spinnerservice.hide();
      if (this.dataSource.countValue === 0) {
        // this.OpenDialog();
      }
    }, error => {
      console.log('--------Error-------->>>>', error);
    });
  }
  onRowSelected(row) {
    this.router.navigate(['/shipments-tems'], { queryParams: { shipmentId: row.ShipmentID } });
  }
  openExportcsvModal() {
    this.startdate = '';
    this.enddate = '';
    this.exportValue = '';
    this.ExportcsvModal.open();
  }
  closemodel() {
    this.ExportcsvModal.close();
  }
  radioChange(event: MatRadioChange) {
    this.exportValue = event.value;
    console.log(event);
  }

  exportCSV() {
    // console.log('-------Startdate--->>>', this.startdate);
    const addDate = new Date(this.enddate.toString());
    const constructDate = new Date(addDate.getFullYear(), addDate.getMonth(), addDate.getDate() + 1);
    const endDate = this.datePipe.transform(constructDate, 'yyyy-MM-dd');
    // console.log('-------EndDate------>>>>', endDate);
    this.ExportcsvModal.close();
    // console.log('entering into export csv company code are --- ', this.companyCode);
    if (this.companyCode === undefined || this.companyCode === 'STAHLS') {
      this.shipmentsService.getShipmentByDate(this.startdate, this.enddate).subscribe(
        data => {
          console.log('Export Data------>>>>', data);
          this.exportShipment(data);
          // this.ExportcsvModal.close();
        },
        error => {
          console.log('something went wrong', error);
        });
    } else {
      this.shipmentsService.getShipmentByDateCode(this.companyCode, this.startdate, this.enddate).subscribe(
        data => {
          console.log('Export Data------>>>>', data);
          this.exportShipment(data);
          // this.ExportcsvModal.close();
        },
        error => {
          console.log('something went wrong', error);
        });
    }
  }

  exportShipment(data) {
    console.log('Export Data------>>>>', data);
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        'uuid', 'ShipmentID', 'BillToName', 'BillToNumber',
        'CompanyCode', 'CompanyID', 'ContainerNumber', 'CustomerCode',
        'ShipToCity', 'ShipToState', 'CustomerID', 'DataExportDate',
        'DataExportID', 'Discount', 'DueDate', 'EdiTransportationMethod',
        'Freight', 'InvoiceDate', 'InvoiceNumber', 'IsReturn', 'OrderComments10',
        'OrderComments11', 'OrderComments12', 'OrderComments13', 'OrderComments14',
        'OrderDiscount', 'OrderFreight', 'OrderID', 'OrderNumber', 'OrderSalesTax',
        'OrderStatusID', 'OrderStatusName', 'PONumber', 'POProductGroup',
        'RequiredDate', 'RetailerPONumber', 'SalesPerson', 'SalesTax', 'ShipCount',
        'ShipDate', 'ShipNumber', 'ShipperNumber', 'ShipToName', 'ShipToNumber',
        'Subtotal', 'Terms',
        'TotalPrice', 'WayBill', 'StatusName', 'EdiCarrierSCAC'
      ],
      title: 'shipment-Report'
    };

    // tslint:disable-next-line:no-unused-expression
    new Angular5Csv(data, 'shipment-Report', options);
  }

}
