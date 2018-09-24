import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrderDetail } from './IOrderDetail';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrderDetailService } from './order-detail.service';
import { forEach } from '@angular/router/src/utils/collection';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';




@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  animations: [
    trigger('detailExpand', [
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLinear = true;
  public IOrders: IOrderDetail = {
    uuid: '',
    item: 0,
    style: '',
    color: '',
    quantity: 0,
    price: '',
    shippingmethod: '',
    artworkstatus: ''
  };
  Order: any;
  listOrderDetail: IOrderDetail[] = [];
  public showDetails: boolean;
  public ticket: any;
  public ticketstatus: any;
  public Openticket: any;
  public Closeticket: any;
  public inprogress: any;
  public ticketdate: any;
  public tstatus: any[] = [];
  public saleorderstatus: any[] = [];
  public salesoderdetails: any;
  public showStepper: boolean;
  public status: any;
  public active: any;
  public shipped: any;
  public void: any;
  public delayed: any;
  public activeorder: any;
  public voidorder: any;
  public Delayedorder: any;
  public Shippedorder: any;
  public orderstatus: any;
  public test: any;
  public createdby: any;
  public test1 = { StatusName: 'Released' };
  public ticketcount: any;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  displayedColumns = ['ItemNumber', 'Style', 'Color', 'Size', 'style_option', 'Quantity', 'Price', 'ShippingMethod'];
  dataSource: any = [];
  constructor(private _formBuilder: FormBuilder, private orderDetailService: OrderDetailService,
    private router2: Router, private router: ActivatedRoute, private route: Router, private spinnerservice: Ng4LoadingSpinnerService) {
    if (JSON.parse(sessionStorage.getItem('currentUser')) === null) {
      console.log('url-------->', this.router2.url);
      sessionStorage.setItem('urlDirect', this.router2.url);
      this.router2.navigate(['']);
    }
  }

  ngOnInit() {
    this.spinnerservice.show();
    this.Openticket = 0;
    this.activeorder = 0;
    this.Shippedorder = 0;
    this.Delayedorder = 0;
    this.voidorder = 0;
    this.Closeticket = 0;
    this.inprogress = 0;
    this.showDetails = false;
    this.getQueryDetails();
  }
  ngAfterViewInit() {
  }
  getQueryDetails() {
    this.router.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      console.log('uuid value are a------>', orderId);
      this.getOrder(orderId);
    });
  }


  getOrder(id) {
    this.tstatus = [];
    this.orderDetailService.getOrder(id)
      .subscribe(data => {
        this.Order = data;
        this.spinnerservice.hide();
        this.test1.StatusName = data.StatusName;
        this.ticket = data.Ticket;
        this.ticketcount = data.Tickets;
        this.ticket.forEach(element => {
          element.assigned_to.forEach(element2 => {
            this.test = element2.firstname;
          });
        });
        this.ticket.forEach(element => {
          this.createdby = element.created_by.firstname;
        });

        if (this.ticketcount !== undefined) {
          // this.ticketlength = this.ticket.length;
          for (let i = 0; i < this.ticket.length; i++) {
            this.ticketstatus = this.ticket[i].Status;
            if (this.ticketstatus === 'Open') {
              this.Openticket = this.Openticket + 1;
            }
            if (this.ticketstatus === 'Close') {
              this.Closeticket = this.Closeticket + 1;
            }
            if (this.ticketstatus === 'Assigned') {
              this.inprogress = this.inprogress + 1;
            }
            this.ticketdate = this.ticket[i].Date;
            this.tstatus.push(this.ticketstatus);
          }
        }
        this.listOrderDetail = data.SalesOrderItems;
        // this.getuser();
        this.listofstatus();
        this.setStepper();
        this.showStepper = true;
        this.intializeDataValues();
      },
        error => {
          console.log('error------->', error);
        });
  }
  intializeDataValues() {
    this.dataSource = new MatTableDataSource(this.listOrderDetail);
    this.sortPage();
  }
  sortPage() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Item': return item.ItemNumber;
        case 'Style': return item.StyleNumber;
        case 'Color': return item.StyleColor;
        case 'Size': return item.SalesOrderDetails[0].GarmentSize;
        case 'style_option': return item.StyleOption;
        case 'Quantity': return item.QuantityRequested;
        case 'Price': return item.UnitPrice;
        case 'ShippingMethod': return item.shippingmethod;
        case 'ArtworkStatus': return item.ArtworkStatus;
        default: return item[property];
      }
    };
  }

  setStepper() {
    if (this.test1.StatusName === 'Complete') {
      return 3;
    }
    if (this.test1.StatusName === 'Shipped') {
      return 2;
    }
    if (this.test1.StatusName === 'Released') {
      return 0;
    }
    if (this.test1.StatusName === 'Processed') {
      return 1;
    }
  }

  listofstatus() {
    this.salesoderdetails = this.listOrderDetail;
    this.orderstatus = [];
    this.saleorderstatus = [];
    this.activeorder = 0;
    this.Shippedorder = 0;
    this.Delayedorder = 0;
    this.voidorder = 0;
    this.salesoderdetails.forEach(element => {
      element.SalesOrderDetails.forEach(element2 => {
        this.orderstatus.push(element2.StatusName);

        if (element2.StatusName === 'Active') {
          this.active = true;
          this.activeorder = this.activeorder + 1;
        }
        if (element2.StatusName === 'Delayed') {
          this.delayed = true;
          this.Delayedorder = this.Delayedorder + 1;
        }
        if (element2.StatusName === 'Shipped') {
          this.shipped = true;
          this.Shippedorder = this.Shippedorder + 1;
        }
        if (element2.StatusName === 'Void') {
          this.void = true;
          this.voidorder = this.voidorder + 1;
        }
      });
    });
    this.saleorderstatus = Array.from(new Set(this.orderstatus.map((itemInArray) => itemInArray)));

  }
  newticket() {
    this.route.navigate(['/ticketcreation'], { queryParams: { orderId: this.Order.OrderID } });
  }
  Activeclick() {
    this.active = false;
  }
  Shippedclick() {
    this.shipped = false;
  }
  Delayedclick() {
    this.delayed = false;
  }
  Voidclick() {
    this.void = false;
  }

}
