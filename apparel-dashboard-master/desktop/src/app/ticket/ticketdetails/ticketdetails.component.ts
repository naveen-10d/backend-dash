import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatSortHeader } from '@angular/material';
import { IOrders } from '../../orders/IOrder';
import { TicketDetailService } from './ticketdetails.service';
import { Observable } from 'rxjs/Observable';
import { setTimeout } from 'timers-browserify';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as FileSaver from 'file-saver';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ConfigService } from '../../config/config.service';
import { Constants } from '../../config/Constant';
import { ticketAttachment } from '../ticketcreation/ticketattachment';
import { MatRadioChange } from '@angular/material';
import { AlertDialogComponent } from '../../dialog/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { OrderDataSource } from '../../orders/orderDataSource';
import { OrderService } from '../../orders/orders.service';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { elementClass } from '@angular/core/src/render3/instructions';
// import { QueryList } from '@angular/core';


@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrls: ['./ticketdetails.component.css']
})
export class TicketdetailsComponent implements OnInit {

  @ViewChild('closeTicket')
  closeTicketModel: ModalComponent;
  @ViewChild('addcomment')
  AddCommnetModel: ModalComponent;
  @ViewChild('Download')
  DownloadModel: ModalComponent;
  @ViewChild('TicketHistoryLog')
  TicketHistoryModel: ModalComponent;
  @ViewChild('Ordernumbers')
  Ordernumber: ModalComponent;
  @ViewChild('input') input: ElementRef;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // public ticketDetails: {
  //   createByImg: string,
  //   assignToImg: string
  // };
  public ticketDetails: any;
  public listOfOrders: any;
  public orderid: any;
  public selectedTableValue: any[] = [];
  public Tickethistory = {
    'AssignedTo': '',
    'LogDescription': '',
    'TicketUuid': '',
    'CreatedBy': '',
  };
  public AssignedUsername: any;
  public CreatedByUsername: any;
  public showDetails: boolean;
  public orgUUID;
  public selectedValues = new FormControl();
  public userUUID;
  public closedMessage: any[];
  public allUser = [];
  public userToDisplay = [];
  allOrganization: any[] = [];
  myOrganization: any[] = [];
  public Reason: any[] = [];
  public Reason1: any;
  organizationname: String;
  public test: any;
  public selected: String[] = [];
  public assignedUserList: any[] = [];
  public salesorder: any;
  public ticketcount: any;
  public listofTickets: any;
  public OrderNumber: any;
  public tickettype: any;
  public tickettype1: any;
  public ticketorder = {
    'salesorder': []
  };
  public attachmenturl: any[] = [];
  // public listofattachment: any[];
  public ticket = {
    'Comments': '',
    'CommentUserName': '',
    'TicketUuid': '',
  };
  public uploader: FileUploader = new FileUploader({
    url: '',
    authTokenHeader: '',
    authToken: '',
    isHTML5: true,
  });
  public token;
  public TicketAttachment: ticketAttachment = {
    attachmenturl: [],
    TicketUuid: ''
  };
  type: string[] = ['Regular'];
  type1: string[] = ['Urgent'];
  public dropdown: any;
  public startdate = new Date();
  public Username: any;
  public Useruuid: any;
  public date: any;
  public month: any;
  public year: any;
  public currentdate: any;
  public commentuser: any;
  public UsersList: any[];
  public ticketcomments: any;
  public closedate: any;
  public users: any;
  displayedColumns = ['OrderNumber', 'Location', 'PO#', 'Requested', 'Forecasted', 'Tickets', 'Status'];
  displayedColumns1 = ['Comments', 'CommentDate', 'CommentUserName'];
  displayedColumns4 = ['select', 'FileName'];
  displayedColumns2 = ['select', 'OrderNumber'];
  displayedColumns3 = ['Date', 'User', 'AssignedTo', 'LogDescription'];
  public tickethistorySource: any = [];
  public tickethistory: any;
  public dataSource: any = [];
  public CommentsSource: any = [];
  public OrdersSource: OrderDataSource;
  public ticketattachmentSource: any[];
  public closedby: any;
  companycode: any;
  currentUser: any;
  ischecked: boolean;
  testArray: any[];
  constructor(private router: Router, private ticketDetailService: TicketDetailService,
    private route: ActivatedRoute, private sharedService: SharedService,
    private config: ConfigService, private dailog: MatDialog, private router2: Router,
    private orderService: OrderService, private spinnerService: Ng4LoadingSpinnerService) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log('current user value in ticket details are ----- ', this.currentUser);
    if (this.currentUser != null) {
      this.Username = this.currentUser.user.firstname;
      this.Useruuid = this.currentUser.user.uuid;

      if (this.currentUser.user.organization !== null) {
        this.Username = this.currentUser.user.firstname;
        this.Useruuid = this.currentUser.user.uuid;
        this.orgUUID = this.currentUser.user.organization.uuid;
        this.organizationname = this.currentUser.user.organization.organizationname;
        if (this.currentUser.user.organization.PolypmCompanyCode !== null) {
          this.companycode = this.currentUser.user.organization.PolypmCompanyCode;
        }
      }

    } else {
      // console.log('url location in ticket details --- ', this.router2.url);
      sessionStorage.setItem('urlDirect', this.router2.url);
      this.router2.navigate(['']);

    }
  }

  ngOnInit() {
    this.ischecked = false;
    this.date = this.startdate.getDate();
    this.year = this.startdate.getFullYear();
    this.month = this.startdate.getMonth();
    this.currentdate = this.month + '/' + this.date + '/' + this.year;
    console.log('-----------slectedcheckbox>>>>>>>>>>', this.selectedTableValue);
    this.showDetails = false;
    this.spinnerService.show();
    this.getSalesOrder('OrderNumber', 'desc');
    this.currentUserDetails();
    this.getAllOrganization();
    this.getAllOrganizationUser();
    this.getclosereason();
    this.getQueryDetails();
    // this.getAllCommentByTicketId();
    const URL = this.config.api_url + Constants.upload_file;
    this.uploader.onBeforeUploadItem = (item) => {
      item.url = URL + '';
    };
    this.uploader.authTokenHeader = 'Authorization';
    this.uploader.authToken = 'Bearer ' + this.token;
    this.uploader.onCompleteAll = () => {
      this.ticketDetailService.saveFileUrl(this.TicketAttachment).subscribe(
        data => {
          console.log('saved ticketAttachmentURL');
        },
        error => {
          console.log('cannot save ticket attachmentUrl');
        }
      );
      this.uploader.queue.length = 0;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.TicketAttachment.attachmenturl.push(JSON.parse(response));
      console.log('----------------------', this.TicketAttachment.attachmenturl);
    };

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

    this.sort.toArray()[2].sortChange.subscribe(() => this.paginator.toArray()[this.paginator.length - 1].pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.toArray()[this.paginator.length - 1].pageIndex = 0;

          this.loadDataPage();
        })
      )
      .subscribe();

    merge(this.sort.toArray()[2].sortChange, this.paginator.toArray()[this.paginator.length - 1].page)
      .pipe(
        tap(() => this.loadDataPage())
      )
      .subscribe();

  }


  loadDataPage() {
    console.log('entering into load data page --- ', this.sort.toArray()[2].active, this.sort.toArray()[2].direction);
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.OrdersSource.loadDatas(
        this.paginator.toArray()[this.paginator.length - 1].pageIndex,
        this.paginator.toArray()[this.paginator.length - 1].pageSize,
        this.sort.toArray()[2].active,
        this.sort.toArray()[2].direction,
        this.input.nativeElement.value, [], [], [], []
      );
    } else {
      this.OrdersSource.loadDatasByCompanyCode(
        this.paginator.toArray()[this.paginator.length - 1].pageIndex,
        this.paginator.toArray()[this.paginator.length - 1].pageSize,
        this.sort.toArray()[2].active,
        this.sort.toArray()[2].direction,
        this.input.nativeElement.value, [], [], [], [],
        this.companycode
      );
    }
  }
  getSalesOrder(label, direction) {
    if (this.companycode === undefined || this.companycode === 'STAHLS') {
      this.getAllSalesOrder(label, direction);
    } else {
      this.getAllSalesOrderByCode();
    }
  }


  getAllSalesOrder(label, direction) {
    this.OrdersSource = new OrderDataSource(this.orderService);

    this.OrdersSource.loadDatas(0, 10, label, direction, '', [], [], [], []);
    this.spinnerService.hide();
    // console.log('get all orders ---is selectred-- ;')
    // this.isSelected(this.orderid);
  }
  getAllSalesOrderByCode() {
    this.OrdersSource = new OrderDataSource(this.orderService);

    this.OrdersSource.loadDatasByCompanyCode(0, 10, 'OrderNumber', 'desc', '', [], [], [], [],
      this.companycode);
    this.spinnerService.hide();
  }


  currentUserDetails() {
    const json = this.currentUser;
    if (json != null) {
      this.token = json.token;
    }
  }
  Showdetails() {
    this.paginator.toArray()[this.paginator.length - 1].pageIndex = 0;
    if (this.sort.toArray()[2].active !== undefined && this.sort.toArray()[2].direction !== undefined) {
      this.getSalesOrder(this.sort.toArray()[2].active, this.sort.toArray()[2].direction);
    } else {
      this.getSalesOrder('OrderNumber', 'desc');
    }
    this.Ordernumber.open();
  }
  Hidedetails() {
    this.Ordernumber.close();
  }

  isSelected(OrderID) {
    let check = false;
    this.selectedTableValue.forEach(element => {
      if (OrderID === element.OrderID) {
        check = true;
      }
    });
    return check;
  }
  toggle(row) {
    let isSameValue = false;
    for (let i = 0; i < this.selectedTableValue.length; i++) {
      if (JSON.stringify(this.selectedTableValue[i]) === JSON.stringify(row)) {
        this.selectedTableValue.splice(i, 1);
        isSameValue = true;
        console.log('-------Salesorder------->>>>', this.selectedTableValue);
      }
    }
    if (!isSameValue) {
      console.log('-------Salesorder------->>>>', this.selectedTableValue);
      this.selectedTableValue.push(row);
    }
  }

  AddOrder() {
    const dataToUpdate = this.ticketDetails;
    const orderNumberList = [];
    // dataToUpdate.salesorder = this.selectedTableValue;
    // for (let i = 0; i < this.selectedTableValue.length; i++) {
    this.selectedTableValue.forEach(element => {
      console.log('-------Ticketcount-------->>>>>>>>>', element.Tickets);
      if (element.Tickets === 0) {
        element.Tickets = 1;
      } else {
        element.Tickets = element.Tickets + 1;
      }
      dataToUpdate.salesorder.push(element);
      orderNumberList.push(element.OrderNumber);
    });
    // dataToUpdate.salesorder.push(this.selectedTableValue[i]);
    // }
    this.AssignedUsername = [];
    this.ticketDetails.assigned_to.forEach(element => {
      this.AssignedUsername.push(element.username);
    });
    this.CreatedByUsername = this.Username;
    this.Tickethistory.TicketUuid = this.ticketDetails.uuid;
    this.Tickethistory.AssignedTo = this.AssignedUsername.toString();
    this.Tickethistory.CreatedBy = this.Username;
    this.Tickethistory.LogDescription = 'An Order has been Added';
    this.ticketDetailService.LogHistory(this.Tickethistory).subscribe(data => {
    }, error => {
      console.log('------Error---->>>>>', error);
    });
    this.ticketDetailService.update_Ticket(dataToUpdate).subscribe(data => {
      this.router.navigate(['/ticket']);
      dataToUpdate.orderNumberList = orderNumberList;
      // dataToUpdate.assigned_to = [];
      dataToUpdate.Status = '';
      dataToUpdate.currentUser = this.Username;
      // this.sendMailMessage(dataToUpdate);
    }, error => {
    });
  }

  getAllOrganizationUser() {
    this.ticketDetailService.getAllUser().subscribe(

      data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].Authorities.length !== 0) {
            if (data[i].Authorities[0].role !== 'ADMIN') {
              this.allUser.push(data[i]);
            }
          }
        }
        // this.OrdersSource = new MatTableDataSource(this.UsersList);
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllOrganization() {

    if (this.organizationname === 'Stahls') {

      this.ticketDetailService.orgGetAll().subscribe(

        data => {
          // this.UsersList = data;
          console.log('org------> ', data);
          this.allOrganization = data;
          // this.OrdersSource = new MatTableDataSource(this.UsersList);
        },
        error => {
          console.log(error);
        }
      );

    }
    if (this.organizationname === undefined) {
      this.ticketDetailService.orgGetAll().subscribe(

        data => {
          this.myOrganization = data;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.allOrganization = ['Stahls', this.organizationname];
      this.ticketDetailService.orgGetAll().subscribe(

        data => {
          console.log('org------> ', data);
          data.forEach(element => {
            if (element.organizationname === 'Stahls') {
              this.myOrganization.push(element);
            }
            if (element.organizationname === this.organizationname) {
              this.myOrganization.push(element);
            }

          });
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getQueryDetails() {

    this.route.queryParams.subscribe(params => {
      const uuid = params['uuid'];
      this.getTicketByUuid(uuid);
      this.getAllCommentByTicketId(uuid);
      this.ViewTicketHistory(uuid);
    });
  }

  filterOrg(data) {
    this.userToDisplay = [];
    for (let i = 0; i < this.allUser.length; i++) {
      if (this.allUser[i].organization !== null && this.allUser[i].organization !== '') {
        if (this.allUser[i].organization.uuid === data.uuid) {
          this.userToDisplay.push(this.allUser[i]);
        }
      }
    }

    // this.userToDisplay = Array.from(new Set(this.userToDisplay.map((itemInArray) => itemInArray.firstname)));
    // this.filter_ticketStatus = Array.from(new Set(this.listOfTickets.map((customerArray => customerArray.Status))));
  }


  saveAssignedUserTicket() {
    const Object = {
      ticketUuid: this.ticketDetails.uuid,
      assignedUsers: this.selectedValues.value
    };
    this.ticketDetailService.createAssignedUserTicket(Object).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      data => {
        this.selected = [];
        this.ticketDetails.Status = 'Assigned';
        this.AssignedUsername = [];
        this.selectedValues.value.forEach(element => {
          this.AssignedUsername.push(element.username);
        });
        this.CreatedByUsername = this.Username;
        this.Tickethistory.TicketUuid = this.ticketDetails.uuid;
        this.Tickethistory.AssignedTo = this.AssignedUsername.toString();
        this.Tickethistory.CreatedBy = this.Username;
        this.Tickethistory.LogDescription = 'Ticket has been assigned';
        // tslint:disable-next-line:no-shadowed-variable
        this.ticketDetailService.LogHistory(this.Tickethistory).subscribe(data => {
        }, error => {
        });
        this.ticketDetailService.update_Ticket(this.ticketDetails).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => {
            this.sendMessage();
            this.router.navigate(['/ticket']);
          },
          error => {
            console.log('something went wrong');
          }
        );
        // this.getTicketByUuid(this.ticketDetails.uuid);
        // this.router.navigate(['/ticket']);
      },
      error => {
        console.log('something went wrong');

      }
    );
  }

  sendMessage() {

    this.ticketDetailService.getTicketByUuid(this.ticketDetails.uuid).subscribe(
      data => {
        this.ticketDetails = data;
        data.currentUser = this.Username;
        this.ticketDetailService.sendMail(data).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => {
            console.log('mail sent-------------->');
          });
      },
      error => {
        console.log('something went wrong');
      }
    );

  }

  getTicketByUuid(uuid) {
    this.ticketcount = 0;
    this.ticketDetailService.getTicketByUuid(uuid).subscribe(
      data => {
        // this.spinnerService.hide();
        this.dataSource = new MatTableDataSource(data.salesorder);
        // this.dataSource.paginator = this.paginator.toArray()[this.paginator.length - 1];
        this.dataSource.sort = this.sort.toArray()[1];
        console.log('get ticket by uuid are ----- ', data);
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'Number': return item.OrderNumber;
            case 'Location': return item.CompanyCode.toLowerCase();
            case 'PO#': return item.PONumber;
            case 'Date': return item.OrderDate;
            case 'Requested': return item.RequiredDate;
            case 'Forecasted': return item.ForecastFinish;
            case 'Tickets': return item.Tickets;
            case 'Status': return item.StatusName.toLowerCase();
            default: return item[property];
          }
        };
        this.ticketDetails = data;
        this.listofTickets = data;
        if (this.ticketDetails.Type === 'Regular') {
          this.tickettype = true;
        }
        if (this.ticketDetails.Type === 'Urgent') {
          this.tickettype1 = true;
        }
        this.salesorder = this.ticketDetails.salesorder;
        console.log('ticket uuid values are ------ ', this.salesorder);
        // this.ticketDetails.attachments.forEach(element => {
        //   let Url = this.sharedService.baseUrl + '/' + element.attachmenturl;
        //   this.attachmenturl.url.push(Url);
        //   this.attachmenturl.filename.push(element.filename);
        // });
        // console.log('--------Attachmentfiles----->>>>>>', this.attachmenturl);
        // tslint:disable-next-line:no-shadowed-variable
        this.getAllUploadFile();
        // if (this.salesorder.TicketUuid !== '') {
        //   this.ticketcount = this.ticketcount + 1;
        // }
        // this.ticketDetails.createByImg = 'assets/img/male-icon.png';
        // this.ticketDetails.assignToImg = 'assets/img/male-icon.png';
      }, error => {
        // this.spinnerService.hide();
        console.log('something went wrong');
      }
    );
  }

  getAllUploadFile() {
    console.log('get all upload file are ----- ', this.ticketDetails);
    if (this.ticketDetails.uuid !== undefined) {
      this.ticketDetailService.getAttachementbyTicketid(this.ticketDetails.uuid).subscribe(data => {
        console.log('-------All Attachments for this ticket-------->>>>', data);
        if (data === null) {
          this.ticketDetails.attachments.length = 0;
        }
        this.ticketattachmentSource = data;
      }, error => {
        console.log('-----Error-------->>>>', error);
      });
    }
  }

  /* Ticket Histroy */

  ViewTicketHistory(uuid) {
    this.ticketDetailService.getHistory(uuid).subscribe(data => {
      this.tickethistory = data;
      this.tickethistorySource = new MatTableDataSource(this.tickethistory);
      this.tickethistory.forEach(element => {
        if (element.LogDescription.includes('Closed:')) {
          this.closedby = element.CreatedBy;
          this.closedate = element.Date;
        }
      });
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
      console.log('-----------error--------', error);
    });

  }
  SelectedAttachment(attachmentid) {
    // this.download(attachmentid);
    // this.attachmenturl = [];
    let isSameValue = false;
    for (let i = 0; i < this.attachmenturl.length; i++) {
      if (JSON.stringify(this.attachmenturl[i]) === JSON.stringify(attachmentid)) {
        this.attachmenturl.splice(i, 1);
        isSameValue = true;
      }
    }
    if (!isSameValue) {
      this.attachmenturl.push(attachmentid);
    }
    // this.attachmenturl.push(attachmentid);
    // this.listofattachment.push(this.attachmenturl);
    console.log('--------attachmentlength-in selected attachement method---->>>>>>', this.testArray, this.attachmenturl);

  }
  // zipped one or more than one files and downloaded using JSZip
  download() {
    this.ischecked = false;
    console.log(' checked download values are ----- ', this.ischecked);
    console.log('downloading files', this.attachmenturl);
    const zip = new JSZip();
    let count = 0;
    const nombre = 'newFile';
    const name = nombre + '.zip';
    this.attachmenturl.forEach(element => {
      // urls.push(element.attachmenturl);
      // });
      const img = zip.folder('Data');
      const ticketLength = this.attachmenturl.length;
      this.DownloadModel.close();
      // this.ticketDetails.attachments.forEach(element => {
      const fullUrl = this.sharedService.baseUrl + '/' + element.attachmenturl;
      // const fullUrl = data;
      console.log('--------Attachmentfiles----->>>>>>', ticketLength);
      const filename = element.filename;
      JSZipUtils.getBinaryContent(fullUrl, function (err, data) {
        if (err) {
          console.log('---------Error----->>>', err);
        }
        img.file(filename, data, { binary: true });
        count++;
        if (count === ticketLength) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            console.log('--------Attachmentfiles----->>>>>>', content);
            FileSaver.saveAs(content, name);
          });
        }
      });
    });
  }
  DeleteAttachment() {
    console.log('deleting files--------->>>>', this.attachmenturl);
    let count = 0;
    this.attachmenturl.forEach(element => {
      count++;
      console.log('---------ElementUUid------->>>>', element.uuid);
      this.ticketDetailService.DeleteAttachementbyid(element.uuid).subscribe(data => {
        console.log('-----Deleted Data----->>>>', data);
        if (count === this.attachmenturl.length) {
          console.log('entering into attachement url delete are -----  ', count, this.attachmenturl.length);
          this.attachmenturl = [];
          const sendDetails = this.ticketDetails;
          sendDetails.Status = '';
          sendDetails.comments = '';
          sendDetails.currentUser = this.Username;
          sendDetails.LogDescription = 'File has been Deleted';
          this.sendMailMessage(sendDetails);
        }
        this.DownloadModel.close();
        this.getAllUploadFile();
      }, error => {
        this.DownloadModel.close();
        console.log('-----Error------>>>>', error);
      });
    });


  }
  openCloseTicketModal() {
    this.closeTicketModel.open();
  }
  openDownloadAttachmentModal() {
    // this.attachmenturl = [];
    this.DownloadModel.open();
  }

  getclosereason() {
    // tslint:disable-next-line:prefer-const
    let dataToUpdate = this.ticketDetails;
    this.ticketDetailService.getReason().subscribe(data1 => {
      this.Reason = data1;

    }, error => { });

  }
  fileupload() {
    const dataToUpdate = this.ticketDetails;
    this.TicketAttachment.TicketUuid = this.ticketDetails.uuid;
    dataToUpdate.attachments = this.TicketAttachment;
    dataToUpdate.Type = this.selected;
    if (this.TicketAttachment.attachmenturl !== 0) {
      this.Tickethistory.LogDescription = 'File has been Uploaded';
    }
    if (this.selected.length !== 0) {
      this.Tickethistory.LogDescription = 'Priority has been Changed';
    }
    this.ticketDetailService.update_Ticket(dataToUpdate).subscribe(data => {
      this.AssignedUsername = [];
      this.ticketDetails.assigned_to.forEach(element => {
        this.AssignedUsername.push(element.username);
      });
      this.CreatedByUsername = this.Username;
      // this.Tickethistory.AssignedTo = this.AssignedUsername.toString();
      this.Tickethistory.TicketUuid = this.ticketDetails.uuid;
      this.Tickethistory.CreatedBy = this.Username;
      const sendDetails = this.ticketDetails;
      sendDetails.Status = '';
      sendDetails.comments = '';
      sendDetails.currentUser = this.Username;
      sendDetails.LogDescription = this.Tickethistory.LogDescription;
      this.sendMailMessage(sendDetails);
      // tslint:disable-next-line:no-shadowed-variable
      this.ticketDetailService.LogHistory(this.Tickethistory).subscribe(data => {
      }, error => {
        console.log('--------------error------->>>>>', error);
      });
      this.uploader.uploadAll();
      this.OpenDialog();
      this.router.navigate(['/ticket']);
    }, error => {
      console.log('something went wrong', error);
    });
  }
  closeTicketOption() {
    const dataToUpdate = this.ticketDetails;
    dataToUpdate.closingRemarks = this.closedMessage;
    dataToUpdate.CloseReasonUuid = dataToUpdate.closingRemarks.uuid;
    dataToUpdate.Status = 'Closed';
    this.ticketDetailService.update_Ticket(dataToUpdate).subscribe(
      data => {
        this.test = data;
        this.AssignedUsername = [];
        this.ticketDetails.assigned_to.forEach(element => {
          this.AssignedUsername.push(element.username);
        });
        this.CreatedByUsername = this.Username;
        this.Tickethistory.AssignedTo = this.AssignedUsername.toString();
        this.Tickethistory.TicketUuid = this.ticketDetails.uuid;
        this.Tickethistory.CreatedBy = this.Username;
        this.Tickethistory.LogDescription = 'Closed:' + dataToUpdate.closingRemarks.Reason;
        // tslint:disable-next-line:no-shadowed-variable
        this.ticketDetailService.LogHistory(this.Tickethistory).subscribe(data => {
        }, error => {
          console.log('--------------error------->>>>>', error);
        });
        // this.closedMessage = "";
        // this.sendCloseMessage(dataToUpdate);
        if (this.ticketDetails.created_by != null) {
          // if (this.ticketDetails.created_by.uuid === this.Useruuid) {
          //   dataToUpdate.currentUser = 'you';
          // } else {
          //   dataToUpdate.currentUser = this.Username;
          // }
          dataToUpdate.currentUser = this.Username;
        }
        dataToUpdate.assigned_to = this.ticketDetails.assigned_to;
        this.sendMailMessage(dataToUpdate);
        console.log('close ticket modeil calling --------->>>> ');
        this.closeTicketModel.close();
        this.router.navigate(['/ticket']);
        // this.getTicketByUuid(dataToUpdate.uuid);
      },
      error => {
      }
    );
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
    dialogConfig.data = 'Your Ticket has been Updated';
    const dialogRef = this.dailog.open(AlertDialogComponent, dialogConfig);
  }

  sendMailMessage(data) {

    this.ticketDetailService.sendMail(data).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      data => {
        console.log('mail sent-------------->');
      },
      error => {
        console.log('something went wrong');
      }
    );

  }
  tickettypechange(event: MatRadioChange) {
    console.log('----------event---------', event.value[0]);
    const dataToUpdate = this.listofTickets;
    this.selected = event.value[0];
  }
  selectmodel() {
    this.dropdown = !this.dropdown;
  }

  Addcomment() {
    this.ticket.Comments = '';
    this.AddCommnetModel.open();
  }
  // Viewcomment() {
  //   this.ViewCommentModel.open();
  // }
  ViewHistory() {
    this.TicketHistoryModel.open();
  }
  cancelcomment() {
    this.AddCommnetModel.close();
  }
  // cancel() {
  //   this.ViewCommentModel.close();
  // }
  CloseTicketHistory() {
    this.TicketHistoryModel.close();
  }
  Reopenticket() {
    const dataToUpdate = this.ticketDetails;
    dataToUpdate.assigned_to = [];
    dataToUpdate.Status = 'Reopen';
    console.log('--------ReopenTicket------>>>>', dataToUpdate);
    this.ticketDetailService.Reopen_ticket(dataToUpdate).subscribe(
      data => {
        this.test = data;
        this.AssignedUsername = [];
        // this.ticketDetails.assigned_to.forEach(element => {
        //   this.AssignedUsername.push(element.username);
        // });
        this.CreatedByUsername = this.Username;
        // this.Tickethistory.AssignedTo = this.AssignedUsername.toString();
        this.Tickethistory.TicketUuid = this.ticketDetails.uuid;
        this.Tickethistory.CreatedBy = this.Username;
        this.Tickethistory.LogDescription = 'Ticket has been Reopened';
        // tslint:disable-next-line:no-shadowed-variable
        this.ticketDetailService.LogHistory(this.Tickethistory).subscribe(data => {
        }, error => {
          console.log('--------------error------->>>>>', error);
        });
        // this.closedMessage = "";
        if (this.ticketDetails.created_by != null) {
          dataToUpdate.currentUser = this.Username;
        }
        this.sendMailMessage(dataToUpdate);
        // this.sendCloseMessage(dataToUpdate);
        // this.closeTicketModel.close();
        this.router.navigate(['/ticket']);
        // this.getTicketByUuid(dataToUpdate.uuid);
      },
      error => {
        console.log('--------------error------->>>>>', error);
      }
    );

  }
  closecomment() {
    // this.ticket.CommentDate = this.currentdate;
    this.ticket.CommentUserName = this.Username;
    this.ticket.TicketUuid = this.ticketDetails.uuid;
    const sendCommentDetails = {
      Status: '',
      comments: this.ticket.Comments,
      userId: this.Useruuid,
      email: this.ticketDetails.created_by.email,
      firstname: this.ticketDetails.created_by.firstname,
      assigned_to: this.ticketDetails.assigned_to,
      id: this.ticketDetails.id,
      description: this.ticketDetails.description,
      salesorder: '',
      currentUser: this.Username
    };
    if (this.ticketDetails.salesorder.length > 0) {
      sendCommentDetails.salesorder = this.ticketDetails.salesorder[0].OrderID;
    }
    // sendCommentDetails.Status = "";
    // sendCommentDetails.currentUser = this.Username;
    // sendCommentDetails.comments = this.ticket.Comments;
    this.ticketDetailService.createcomments(this.ticket).subscribe(data => {
      this.test = data;
      this.AddCommnetModel.close();
      this.sendMailMessage(sendCommentDetails);
      this.getAllCommentByTicketId(this.ticketDetails.uuid);
    }, error => {
      console.log('-----------error---------->>>>', error);
    });
  }
  getAllCommentByTicketId(ticketId) {
    this.ticketDetailService.getCommentsByTicketID(ticketId).subscribe(data => {
      console.log('@@@@ comments  ------- ', data);
      if (data === 'There is no Comments') {
        this.ticketcomments = 0;
        this.CommentsSource = new MatTableDataSource([]);
      } else {
        this.CommentsSource = new MatTableDataSource(data);
        this.CommentsSource.paginator = this.paginator.toArray()[this.paginator.length - 2];
        this.CommentsSource.sort = this.sort.toArray()[0];
        this.ticketcomments = 1;
      }
    }, error => {
      console.log('--------error----->>>>', error);
    });

  }

  unCheckDownload(uuid) {
    console.log('entering into un chec data ', uuid, this.attachmenturl);
    let check = false;
    this.attachmenturl.forEach(element => {
      if (element.uuid === uuid) {
        check = true;
      }
    });
    return check;
    // console.log('entering into uncheck download file &&& ');
    // return true;
  }
}
