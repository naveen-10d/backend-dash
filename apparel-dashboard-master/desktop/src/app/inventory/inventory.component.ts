import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatRadioChange } from '@angular/material';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Inventory } from './Inventory';
import { InventoryService } from './inventory.service';
declare var jquery: any;
import { ApiService } from '../config/api.service';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/observable/of';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { DatePipe } from '@angular/common';
import { inventoryDataSource } from './inventoryDataSource';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';


@Component({
  selector: 'app-orders',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('detailExpand', [
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InventoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  @ViewChild('ExportCSV')
  ExportcsvModal: ModalComponent;

  public selectfilter = new FormControl();
  public selectexport = new FormControl();
  public listOfInventory: Inventory[] = [];
  public filter_listOfInventorycolor: any[] = [];
  public filter_listOfInventorysize: any[] = [];
  public filter_listOfInventorystyle: any[] = [];
  public filterArr: any[];
  public inventory: any;
  public inventoryitemrecord: any;
  public filterdata: any[] = [];
  public styleSelectedValue: String[] = [];
  public colorSelectedValue: String[] = [];
  public sizeSelectedValues: String[] = [];
  public codeSelectedValues: String[] = [];
  public stylevalue: any;
  public colorvalue: any;
  public sizevalue: any;
  public Stylenumber: any;
  public companycode: any;
  public dateRange = {
    'startdate': '',
    'enddate': ''
  };
  public pullRight: boolean;
  public pullRightCode: boolean;
  dataSource: inventoryDataSource;
  public count;
  public filterValue: any;
  public exportValue: String;
  public exportOption: String[] = ['Inventory', 'Inventory Transaction'];
  public spinnerlogo: Boolean;

  pageNo: number;

  filterLocation = new FormControl();
  filterStyle = new FormControl();
  filterColor = new FormControl();
  filterSize = new FormControl();

  displayedColumns = ['StyleNumber', 'StyleColor', 'GarmentSize',
    'StyleOption', 'StyleName', 'QuantityOnHand', 'QuantityAllocated', 'AdjustedQuantityOnHand', 'QuantitySeconds', 'QuantityThirds'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  constructor(private inventoryService: InventoryService, private apiService: ApiService,
    private router: Router, private spinnerService: Ng4LoadingSpinnerService, private dialog: MatDialog, private datePipe: DatePipe) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization !== null) {
      if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode !== null) {
        this.pullRight = true;
        this.pullRightCode = false;
        this.companycode = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode;
      }
    } else {
      console.log('entering into else part');
      this.pullRight = false;
      this.pullRightCode = true;
    }

  }

  ngOnInit() {
    this.sizeSelectedValues = [];
    this.styleSelectedValue = [];
    this.colorSelectedValue = [];
    this.spinnerlogo = false;
    this.spinnerService.show();
    this.pageNo = 1;
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.getAllActiveInventories();
    } else {
      this.getInventorybyCompanycode();
    }
  }
  loadDataPage() {
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatas(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.styleSelectedValue,
        this.colorSelectedValue,
        this.sizeSelectedValues,
        this.codeSelectedValues
      );
    } else {
      this.pageNo = this.paginator.pageIndex + 1;
      this.dataSource.loadDatasByCompanyCode(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.sort.active,
        this.sort.direction,
        this.input.nativeElement.value,
        this.styleSelectedValue,
        this.colorSelectedValue,
        this.sizeSelectedValues,
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

  getAllActiveInventories() {
    this.dataSource = new inventoryDataSource(this.inventoryService, this.dialog);

    this.dataSource.loadDatas(0, 25, 'StyleNumber', 'desc', '', this.styleSelectedValue,
      this.colorSelectedValue,
      this.sizeSelectedValues,
      this.codeSelectedValues
    );
    // this.count = this.dataSource.pageCount();
    if (this.dataSource.countValue === 0) {
      this.OpenDialog();
    } else {
      this.getFilterValue();
    }
    // console.log('count value are ------ ', this.dataSource.countValue);
    // this.getFilterValue();

  }

  getInventorybyCompanycode() {
    this.dataSource = new inventoryDataSource(this.inventoryService, this.dialog);

    this.dataSource.loadDatasByCompanyCode(0, 25, 'StyleNumber', 'desc', '',
      this.styleSelectedValue, this.colorSelectedValue,
      this.sizeSelectedValues, this.companycode);
    // this.count = this.dataSource.pageCount();
    // console.log("sales data source  ----- length ---- ", this.dataSource.countValue);
    if (this.dataSource.countValue === 0) {
      this.OpenDialog();
    } else {
      this.getFilterValueByCompanyCode();
    }
    // console.log('count value are ------ ', this.dataSource.countValue);
    // this.getFilterValueByCompanyCode();


  }

  onRowSelected(row) {
    console.log('-------Row-------->>>>', row);
    if (row.FinishedGoodsAdjustments.length !== 0) {
      this.router.navigate(['/inventoryitem'], { queryParams: { FinishedgoodsId: row.FinishedGoodsID } });
    } else {
this.noDataDialog();
    }
  }

  noDataDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = 'No Inventory Transaction ';
    const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);
  }

  openExportcsvModal() {
    this.dateRange.startdate = '';
    this.dateRange.enddate = '';
    this.Stylenumber = '';
    this.ExportcsvModal.open();
  }
  closemodel() {
    this.ExportcsvModal.close();
  }

  getFilterValue() {
    this.inventoryService.getFilterValue().subscribe(
      data => {
        console.log('filter data---------->', data);
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
    this.inventoryService.getFilterValueData(filterValueData).subscribe(
      data => {
        console.log('response-------------->>>>>>', data);
        this.filterValue = data;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  getFilterValueDataByCompanyCode(filterData) {
    this.inventoryService.getFilterValueDataByCompanyCode(filterData, this.companycode).subscribe(
      data => {
        this.filterValue = data;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  getFilterValueByCompanyCode() {
    this.inventoryService.getFilterValueByCompanyCode(this.companycode).subscribe(
      data => {
        this.filterValue = data;
        console.log('filter values are ----- ', this.filterValue);
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }


  styleFilter() {
    this.styleSelectedValue = this.filterStyle.value;
    // this.filterDetails();
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'StyleNumber', 'value': this.filterStyle.value },
      { 'filter': 'StyleColor', 'value': this.filterColor.value },
      { 'filter': 'GarmentSize', 'value': this.filterSize.value }
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
    console.log('selected style filter are ----- ', this.styleSelectedValue);
    this.paginator.pageIndex = 0;
    this.loadDataPage();
    // this.test();
  }
  colorFilter() {
    this.colorSelectedValue = this.filterColor.value;
    // this.filterDetails();
    console.log('selected color filter are ---- ', this.colorSelectedValue);
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'StyleNumber', 'value': this.filterStyle.value },
      { 'filter': 'StyleColor', 'value': this.filterColor.value },
      { 'filter': 'GarmentSize', 'value': this.filterSize.value }
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

    this.paginator.pageIndex = 0;
    this.loadDataPage();
    // this.test();
  }
  sizeFilter() {
    this.sizeSelectedValues = this.filterSize.value;
    // this.filterDetails();
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'StyleNumber', 'value': this.filterStyle.value },
      { 'filter': 'StyleColor', 'value': this.filterColor.value },
      { 'filter': 'GarmentSize', 'value': this.filterSize.value }
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

    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  codeFilter() {
    this.codeSelectedValues = this.filterLocation.value;
    const filterValueData = [
      { 'filter': 'CompanyCode', 'value': this.filterLocation.value },
      { 'filter': 'StyleNumber', 'value': this.filterStyle.value },
      { 'filter': 'StyleColor', 'value': this.filterColor.value },
      { 'filter': 'GarmentSize', 'value': this.filterSize.value }
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

    this.paginator.pageIndex = 0;
    this.loadDataPage();
  }
  radioChange(event: MatRadioChange) {
    // this.filter['property'] = event.value;
    this.exportValue = event.value;
    console.log(event.value);
  }
  styleselect() {
    this.Stylenumber = this.selectexport.value;
  }
  exportDetails() {
    if (this.exportValue === 'Inventory') {
      console.log('Selectedvalue-------->>>>', this.Stylenumber);
      this.exportInventory();
    } else if (this.exportValue === 'Inventory Transaction') {
      this.exportInventoryItems();
    }
  }
  exportInventory() {
    this.ExportcsvModal.close();
    this.spinnerlogo = true;

    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.inventoryService.exportAllInventory().subscribe(
        data => {
          this.spinnerlogo = false;
          this.exportCSV(data);
          // this.ExportcsvModal.close();
        },
        error => {
          this.spinnerlogo = false;
          console.log('something went wrong');
        });
    } else {
      this.inventoryService.exportAllInventoryByCode(this.companycode).subscribe(
        data => {
          this.spinnerlogo = false;
          this.exportCSV(data);
          // this.ExportcsvModal.close();
        },
        error => {
          this.spinnerlogo = false;
          console.log('something went wrong');
        }
      );
    }
    // this.spinnerlogo = false;
  }
  exportInventoryItems() {
    this.ExportcsvModal.close();
    this.spinnerlogo = true;
    const addDate = new Date(this.dateRange.enddate);
    const constructDate = new Date(addDate.getFullYear(), addDate.getMonth(), addDate.getDate() + 1);
    const endDate = this.datePipe.transform(constructDate, 'yyyy-MM-dd');
    // const object = {
    //   startDate: this.dateRange.startdate,
    //   endDate: endDate
    // };
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.inventoryService.getInventoryItemsByDateRange(this.dateRange.startdate, endDate, this.Stylenumber)
        .subscribe(
          data => {
            this.spinnerlogo = false;
            this.exportInventoryItemsCSV(data);
            // this.ExportcsvModal.close();
          },
          error => {
            this.spinnerlogo = false;
            console.log('something went wrong');
          });
    } else {
      this.inventoryService.getInventoryItemsByDateRangeCode(this.dateRange.startdate,
        endDate, this.companycode, this.Stylenumber)
        .subscribe(
          data => {
            this.spinnerlogo = false;
            this.exportInventoryItemsCSV(data);
            // this.ExportcsvModal.close();
          },
          error => {
            this.spinnerlogo = false;
            console.log('something went wrong');
          });
    }
    // this.spinnerlogo = false;
  }
  exportCSV(data) {
    console.log('entering into export csv data ----- ', data, data.length);
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        'uuid', 'FinishedGoodsID', 'AdjustedQuantityOnHand', 'CompanyCode', 'CompanyID', 'CustomerCode',
        'DataExportDate', 'DataExportID', 'Description', 'GarmentSize', 'ListPrice', 'QuantityOnHand',
        'QuantityAllocated', 'QuantitySeconds', 'QuantityThirds', 'Season', 'SKUNumber', 'StatusID',
        'StatusName', 'StyleColor', 'StyleID', 'StyleName', 'StyleNumber', 'StyleOption', 'UPCNumber'
      ],
      title: 'inventory-Report'
    };

    // tslint:disable-next-line:no-unused-expression
    new Angular5Csv(data, 'inventory-Report', options);
  }
  // nneed to comments
  exportInventoryItemsCSV(data) {
    console.log('entering into export csv data ----- ', data, data.length);
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        'uuid', 'GoodsTransactionID', 'CompanyCode', 'CompanyID', 'CustomerCode', 'DataExportDate',
        'DataExportID', 'FinishedGoodsID', 'GarmentSize', 'Quantity', 'StyleColor', 'StyleCustomerNumber',
        'StyleNumber', 'TransactionReasonCode', 'TransactionReasonCode2', 'UPCNumber'
      ],
      title: 'inventoryTransaction-Report'
    };

    // tslint:disable-next-line:no-unused-expression
    new Angular5Csv(data, 'inventoryTransaction-Report', options);
  }

  OpenDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '35%';
    dialogConfig.position = {
      bottom: '18%',
    };
    dialogConfig.direction = 'rtl';
    dialogConfig.data = 'no data in Inventory';
    const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

  }



  //   getInventorybyCompanycode() {
  //     this.inventory = [];
  //     this.inventoryService.getInventorybyCompanycode(this.companycode).subscribe(data => {
  //       this.listOfInventory = data;
  //       if (data === 'There is no Inventory') {
  //         this.inventory = [];
  //         this.listOfInventory = [];
  //         this.dataSource = new MatTableDataSource(this.inventory);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //         this.sortPage();
  //         this.spinnerService.hide();
  //         this.OpenDialog();
  //       } else {
  //         this.spinnerService.hide();
  //         this.listOfInventory.forEach(element => {
  //           if (element.StatusName !== null) {
  //             this.inventory.push(element);

  //           }
  //         });
  //         this.listOfInventory = this.inventory;
  //         this.length = this.listOfInventory.length;
  //         // console.log('---------------', this.inventory[0].Allocated);
  //         this.dataSource = new MatTableDataSource(this.inventory);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //         this.sortPage();
  //         this.filter_listOfInventorycolor = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.StyleColor)));
  //         this.filter_listOfInventorysize = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.GarmentSize)));
  //         this.filter_listOfInventorystyle = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.StyleNumber)));
  //         // tslint:disable-next-line:max-line-length
  //         this.filter_listOfInventorycolor = this.filter_listOfInventorycolor.filter((obj) => obj != null);
  //         this.filter_listOfInventorysize = this.filter_listOfInventorysize.filter((obj) => obj != null);
  //         this.filter_listOfInventorystyle = this.filter_listOfInventorystyle.filter((obj) => obj != null);
  //         this.filter_listOfInventorycolor = this.filter_listOfInventorycolor.sort();
  //         this.filter_listOfInventorysize = this.filter_listOfInventorysize.sort();
  //         this.filter_listOfInventorystyle = this.filter_listOfInventorystyle.sort();
  //         //  this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);
  //       }
  //     }, error => {
  //       console.log('------------error--------', error);
  //     })

  //   }

  //   getAllActiveInventories(pageNumber,pageSize) {
  //     this.inventory = [];
  //     this.inventoryService.getAllActiveInventories(pageNumber,pageSize).subscribe(
  //       data => {
  //         this.listOfInventory = data;
  //         if (data === 'There is no Inventory') {
  //           this.inventory = [];
  //           this.listOfInventory = [];
  //           this.dataSource = new MatTableDataSource(this.inventory);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //           this.sortPage();
  //           this.spinnerService.hide();
  //           this.OpenDialog();
  //         } else {
  //           this.spinnerService.hide();
  //           this.listOfInventory.forEach(element => {
  //             if (element.StatusName !== null) {
  //               this.inventory.push(element);
  //             }
  //           });
  //           this.listOfInventory = this.inventory;
  //           this.length = this.listOfInventory.length;
  //           this.dataSource = new MatTableDataSource(this.inventory);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //           this.sortPage();
  //           this.filter_listOfInventorycolor = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.StyleColor)));
  //           this.filter_listOfInventorysize = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.GarmentSize)));
  //           this.filter_listOfInventorystyle = Array.from(new Set(this.inventory.map((itemInArray) => itemInArray.StyleNumber)));
  //           // tslint:disable-next-line:max-line-length
  //           this.filter_listOfInventorycolor = this.filter_listOfInventorycolor.filter((obj) => obj != null);
  //           this.filter_listOfInventorysize = this.filter_listOfInventorysize.filter((obj) => obj != null);
  //           this.filter_listOfInventorystyle = this.filter_listOfInventorystyle.filter((obj) => obj != null);
  //           this.filter_listOfInventorycolor = this.filter_listOfInventorycolor.sort();
  //           this.filter_listOfInventorysize = this.filter_listOfInventorysize.sort();
  //           this.filter_listOfInventorystyle = this.filter_listOfInventorystyle.sort();
  //           //  this.filter_ticketStatus = this.filter_ticketStatus.filter((obj) => obj.length > 0);
  //         }
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //   }
  // getAllInventoryItems(){
  //   this.inventoryService.getAllInventoryItems().subscribe(data=>{
  //     console.log('-----------------listofinventoryitems---->>>>', data);
  //     this.inventoryitems = data;
  //   },error=>{
  //     console.log('--------------error----->>>>', error);
  //   });
  // }
  //   ngAfterViewInit() {
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.sortPage();
  //   }

  //   OpenDialog() {
  //     this.spinnerService.hide();
  //     const dialogConfig = new MatDialogConfig();

  //     dialogConfig.disableClose = true;
  //     dialogConfig.autoFocus = true;
  //     dialogConfig.width = '35%';
  //     dialogConfig.position = {
  //       bottom: '18%',
  //     };
  //     dialogConfig.direction = 'rtl';
  //     dialogConfig.data = 'no data in Inventory';
  //     const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

  //   }


  //   applyFilter(filterValue: string) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource.filter = filterValue;
  //   }

  //   styleFilter() {
  //     this.styleSelectedValue = this.selectfilter.value;
  //     this.filterDetails();
  //   }
  //   colorFilter() {
  //     this.colorSelectedValue = this.selectfilter.value;
  //     this.filterDetails();
  //   }
  //   sizeFilter() {
  //     this.sizeSelectedValues = this.selectfilter.value;
  //     this.filterDetails();
  //   }


  //   filterDetails() {
  //     this.filterArr = [];
  //     this.filterdata = [];
  //     if (this.styleSelectedValue.length === 0 && this.colorSelectedValue.length === 0 &&
  //       this.sizeSelectedValues.length === 0) {
  //       this.initializeValue();
  //     }
  //     if (this.styleSelectedValue.length !== 0 && this.colorSelectedValue.length !== 0 && this.sizeSelectedValues.length === 0) {
  //       this.styleSelectedValue.forEach(element => {
  //         this.stylevalue = element;
  //         // tslint:disable-next-line:no-shadowed-variable
  //         this.colorSelectedValue.forEach(element => {
  //           this.colorvalue = element;
  //           this.inventory.forEach(one => {
  //             if (one.StyleNumber === this.stylevalue && one.StyleColor === this.colorvalue) {
  //               this.filterArr.push(one);
  //             }
  //             this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //             this.dataSource = new MatTableDataSource(this.filterdata);
  //             this.length = this.filterdata.length;
  //             this.paginator.pageIndex = 0;
  //             this.dataSource.paginator = this.paginator;
  //             this.dataSource.sort = this.sort;
  //             this.sortPage();
  //           });
  //         });
  //       });

  //     }
  //     if (this.styleSelectedValue.length !== 0 && this.sizeSelectedValues.length !== 0 && this.colorSelectedValue.length === 0) {
  //       this.styleSelectedValue.forEach(element => {
  //         this.stylevalue = element;
  //         // tslint:disable-next-line:no-shadowed-variable
  //         this.sizeSelectedValues.forEach(element => {
  //           this.sizevalue = element;
  //           this.inventory.forEach(one => {
  //             if (one.StyleNumber === this.stylevalue && one.GarmentSize === this.sizevalue) {
  //               this.filterArr.push(one);
  //             }
  //             this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //           });
  //         });
  //       });
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();

  //     }
  //     if (this.colorSelectedValue.length !== 0 && this.sizeSelectedValues.length !== 0 && this.styleSelectedValue.length === 0) {
  //       this.colorSelectedValue.forEach(element => {
  //         this.colorvalue = element;
  //       });
  //       this.sizeSelectedValues.forEach(element => {
  //         this.sizevalue = element;
  //       });
  //       this.inventory.forEach(one => {
  //         if (one.StyleColor === this.colorvalue && one.GarmentSize === this.sizevalue) {
  //           this.filterArr.push(one);
  //         }
  //         this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       });
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();

  //     }
  //     if (this.colorSelectedValue.length !== 0 && this.sizeSelectedValues.length !== 0 && this.sizeSelectedValues.length !== 0) {
  //       this.colorSelectedValue.forEach(element => {
  //         this.colorvalue = element;
  //         // tslint:disable-next-line:no-shadowed-variable
  //         this.sizeSelectedValues.forEach(element => {
  //           this.sizevalue = element;
  //           // tslint:disable-next-line:no-shadowed-variable
  //           this.styleSelectedValue.forEach(element => {
  //             this.stylevalue = element;
  //             this.inventory.forEach(one => {
  //               if (one.StyleColor === this.colorvalue && one.GarmentSize === this.sizevalue && one.StyleNumber === this.stylevalue) {
  //                 this.filterArr.push(one);
  //               }
  //               this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //             });
  //           });
  //         });
  //       });
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();
  //     }

  //     if (this.styleSelectedValue.length !== 0 && this.colorSelectedValue.length === 0 && this.sizeSelectedValues.length === 0) {
  //       this.styleSelectedValue.forEach(element => {
  //         this.inventory.forEach(one => {
  //           if (one.StyleNumber === element) {
  //             this.filterArr.push(one);
  //           }
  //         });
  //       });
  //       this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();
  //     }
  //     if (this.colorSelectedValue.length !== 0 && this.styleSelectedValue.length === 0 && this.sizeSelectedValues.length === 0) {
  //       this.colorSelectedValue.forEach(element => {

  //         this.inventory.forEach(one => {
  //           if (one.StyleColor === element) {
  //             this.filterArr.push(one);
  //           }
  //         });

  //       });
  //       this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();

  //     }
  //     if (this.sizeSelectedValues.length !== 0 && this.colorSelectedValue.length === 0 && this.colorSelectedValue.length === 0) {
  //       this.sizeSelectedValues.forEach(element => {

  //         this.inventory.forEach(one => {
  //           if (one.GarmentSize === element) {
  //             this.filterArr.push(one);
  //           }
  //         });

  //       });
  //       this.filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.dataSource = new MatTableDataSource(this.filterdata);
  //       this.length = this.filterdata.length;
  //       this.paginator.pageIndex = 0;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.sortPage();

  //     }
  //   }

  //   exportCSV() {
  //     this.filterArr = [];
  //     this.inventory.forEach(element => {
  //       const date = this.datePipe.transform(element.DataExportDate,'yyyy-MM-dd')
  //       if (date >= this.InventoryItems.startdate && this.InventoryItems.enddate === ''){
  //         this.filterArr.push(element);
  //       }else{
  //         if(this.InventoryItems.startdate <= date && this.InventoryItems.enddate >= date){
  //           this.filterArr.push(element);
  //         }
  //       }
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.inventory = filterdata;
  //     });
  //     var options = {
  //       fieldSeparator: ',',
  //       quoteStrings: '"',
  //       decimalseparator: '.',
  //       showLabels: true,
  //       showTitle: true,
  //       useBom: true,
  //       headers: [
  //         "uuid", "FinishedGoodsID", "AdjustedQuantityOnHand", "CompanyCode", "CompanyID", "CustomerCode",
  //         "DataExportDate", "DataExportID", "Description", "GarmentSize", "ListPrice", "QuantityOnHand",
  //         "QuantityAllocated", "QuantitySeconds", "QuantityThirds", "Season", "SKUNumber", "StatusID",
  //         "StatusName", "StyleColor", "StyleID", "StyleName", "StyleNumber", "StyleOption", "UPCNumber"
  //       ],
  //       title: "inventory-Report"
  //     };

  //     new Angular5Csv(this.inventory, "inventory-Report", options);
  //   }

  //   exportInventoryItemsCSV() {
  //     this.filterArr = [];
  //     this.inventoryitems.forEach(element => {
  //       const date = this.datePipe.transform(element.DataExportDate,'yyyy-MM-dd')
  //       // console.log('---------Date----->>>>>>>', date);
  //       // console.log('---------startDate----->>>', this.InventoryItems.startdate);
  //       // console.log('---------endDate----->>>', this.InventoryItems.enddate);
  //       if (date >= this.InventoryItems.startdate && this.InventoryItems.enddate === ''){
  //         // console.log('--------------Startdaterecord-------->>>>', element);
  //         this.filterArr.push(element);
  //         // this.inventoryitemrecord.push(element);
  //       }else{
  //         if(this.InventoryItems.startdate <= date && this.InventoryItems.enddate >= date){
  //           // console.log('--------------ElseStartdaterecord-------->>>>', element);
  //           this.filterArr.push(element);
  //           // this.inventoryitemrecord.push(element);
  //         }
  //       }
  //       const filterdata = Array.from(new Set(this.filterArr.map((itemInArray) => itemInArray)));
  //       this.inventoryitemrecord = filterdata;
  //     });

  //     console.log('--------------Startdaterecord-------->>>>', this.inventoryitemrecord);
  //     var options = {
  //       fieldSeparator: ',',
  //       quoteStrings: '"',
  //       decimalseparator: '.',
  //       showLabels: true,
  //       showTitle: true,
  //       useBom: true,
  //       headers: [
  //         "uuid", "GoodsTransactionID", "CompanyCode", "CompanyID", "CustomerCode", "DataExportDate",
  //         "DataExportID", "FinishedGoodsID", "GarmentSize", "Quantity", "StyleColor", "StyleCustomerNumber",
  //         "StyleNumber", "TransactionReasonCode", "TransactionReasonCode2", "UPCNumber"
  //       ],
  //       title: "inventoryitems-Report"
  //     };

  //     new Angular5Csv(this.inventoryitemrecord, "inventoryitems-Report", options);
  //   }

  //   initializeValue() {
  //     this.dataSource = new MatTableDataSource(this.inventory);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.sortPage();
  //   }
  //   sortPage() {
  //     this.dataSource.sortingDataAccessor = (item, property) => {
  //       switch (property) {
  //         case 'style': return item.StyleNumber;
  //         case 'style_desc': return item.Description;
  //         case 'color': return item.StyleColor;
  //         case 'size': return item.GarmentSize;
  //         case 'style_option': return item.StyleOption;
  //         case 'style_name': return item.StyleName;
  //         case 'on_hand': return item.QuantityOnHand;
  //         case 'allocated': return item.QuantityAllocated;
  //         case 'available': return item.AdjustedQuantityOnHand;
  //         case 'quarantined': return item.QuantitySeconds;
  //         case 'scrapped': return item.QuantityThirds;
  //         case 'quarantined': return item.QuantitySeconds;
  //         default: return item[property];
  //       }
  //     };
  //   }
}
