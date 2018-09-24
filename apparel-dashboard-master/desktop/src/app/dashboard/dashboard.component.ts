import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TicketCreationService } from '../ticket/ticketcreation/ticketcreation.service';
import * as Highcharts from 'highcharts';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DashboardService } from './dashboard.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public loading = false;
  public userDetails: any;
  public allowedScreensList = '';
  public allowedScreens = [];
  public ticketlist = [];
  @Input()
  bufferValue = 50;

  displayedColumns = ['Ticket Id', 'Date', 'Status', 'Type'];
  dataSource: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public dashboardvalues: any;
  public dashboardtype: any;
  public letsc = [];

  public selectedReport: string;

  public temp_var = true;

  public orderReceived: any;
  public orderReceivedPercent: number;
  public orderReceivedToday: number;
  public orderShipped: number;
  public orderShippedToday: any;
  public orderShippedPercent: number;

  public barGraphData = [];
  public barGraphDataRecived = [];
  public barGraphDays = 7;
  public timeGraphDays = 7;

  public topSellingDays = 7;

  public ticketDays = 7;

  public onTimeDays = 7;
  public onTimeShipped = [];
  public onTimeForecasted = [];


  public timeGraphData: any;

  public barGraphDaysArr = [7, 30, 90];

  public timeGraphDaysArr = [7, 30, 90];

  public onTimeDaysArr = [7, 30, 90];

  public topSellingDaysArr = [7, 30, 90];

  public ticketDaysArr = [7, 30, 90];

  public dayGraph = [];
  public ForecastdayGraph = [];

  public onTimedayGraph = [];

  public topSelling = [];

  public showGraph = '';

  // public timeGraphData:any;

  public orderOnTimeToday: number;
  public orderOnTimePercent: number;

  public companyCode: string;
  public organizationId: string;

  public nodataTicket = false;
  public nodataTopSelling = false;

  constructor(private router: Router, private dashboardService: DashboardService, private spinnerService: Ng4LoadingSpinnerService) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization !== null) {
      if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode !== null) {
        this.companyCode = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.PolypmCompanyCode;
        this.organizationId = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
      }
    }
  }

  ngOnInit() {
    this.spinnerService.show();
    this.showGraph = 'received';
    // this.orderReceivedToday = 0;
    // this.orderShippedToday = 0;
    // this.orderOnTimeToday = 0;
    this.getCurrentUserDetails();
    this.selectedReport = '00';
    const cookiedata = sessionStorage.getItem('currentUser');
    const json = JSON.parse(cookiedata);
    this.getreport_byuser();


    this.priorityticket();
    this.getTopSelling();
    this.getOrdersReceived();
    this.getOrdersShipped();
    this.onTime();

    this.barOrderReceived();
    this.timeGraph();

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.allowedScreens.indexOf('Orders') > -1) {

      //  this.getBarGraph();


    }
  }

  getTopSelling() {
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_ordersTopSellingOrg(this.topSellingDays, this.companyCode).subscribe(
        data => {
          console.log("top data-------->", data);
          if (data.length !== 0) {
            this.nodataTopSelling = false
            this.topSelling = data;
          } else {
            this.nodataTopSelling = true
          }
        }
      );
    } else {
      this.dashboardService.get_ordersTopSelling(this.topSellingDays).subscribe(
        data => {
          console.log("top data-------->", data);
          this.topSelling = data;
        }
      );
    }

  }

  onRowSelected(row) {
    this.router.navigate(['/ticketdetails'], { queryParams: { uuid: row.uuid } });
    // this.router.navigate(['/tickets-details'], { queryParams: { uuid: id } });
  }

  onTime() {
    console.log('entering into on time values are --- ');
 if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
          this.dashboardService.get_ordersOnTimeOrg(this.companyCode).subscribe(
            data2 => {
              console.log('--organization------on time top-----', data2);  
              if (data2 !== null){
                this.orderOnTimeToday = data2.onTime;
                this.orderOnTimePercent = data2.percent.toFixed(2);
              }
            }
          );
    } else {
          this.dashboardService.get_ordersOnTime().subscribe(
            data2 => {
              this.orderOnTimeToday = data2.onTime;
              this.orderOnTimePercent = data2.percent.toFixed(2);
              console.log('--normal------on time top-----', data2);
            }
      );
    }
  }

  getCurrentUserDetails() {
    const json = JSON.parse(sessionStorage.getItem('currentUser'));
    json.user.Authorities[0].role = json.user.Authorities[0].role.toLowerCase();
    this.userDetails = json.user;
    this.allowedScreensList = this.userDetails.Authorities[0].allowedScreens;
    this.allowedScreens = this.allowedScreensList.split(',');

    console.log('sidenav user details are ----- ', this.allowedScreens);
  }

  getreport_byuser() {
    this.loading = true;
  }

  selectedreport(report) {

  }

  displaychart(template_display) {

    template_display.forEach((item: any, index: any) => {

    });

    this.loading = false;
  }

  reportDetails(detailOfReport) {
    sessionStorage.setItem('reportdetail', detailOfReport.reportname);
    this.router.navigate(['/spldashboarddetail']);
  }

  priorityticket() {
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_priorityOrg(this.ticketDays, this.organizationId).subscribe(
        data => {
          console.log("ticket data----#####---->",data);
          if (data.PriorityTickets === 'No data!' || data.length === 0) {
            this.nodataTicket = true
          } else {
            this.nodataTicket = false
            this.ticketlist = data.PriorityTickets;  
            this.dataSource = new MatTableDataSource(this.ticketlist);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
      );
    } else {
      this.dashboardService.get_priority(this.ticketDays).subscribe(
        data => {
          console.log("ticket data---222222----->",data);
          this.ticketlist = data.PriorityTickets;
          this.dataSource = new MatTableDataSource(this.ticketlist);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }
      );
    }

  }

  getOrdersReceived() {

    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {

      this.dashboardService.get_ordersReceivedOrg(this.companyCode).subscribe(
        data => {
          this.orderReceived = data;
          console.log('----------------getOrdersReceived---->>>>', this.orderReceived);
            this.orderReceivedToday = this.orderReceived.TodayOrder;
            if(this.orderReceived.percent !== undefined){
            this.orderReceivedPercent = this.orderReceived.percent.toFixed(2)  
          }
          // this.dashboardService.get_ordersReceivedTodayOrg(this.companyCode).subscribe(
          //   data2 => {
          //     console.log('second get order received ----- ', data2);
          //     // console.log('--------Today--------->>>>>>>', data2);
          //     // this.orderReceivedToday = data2.TodayOrder;
          //     // const percent = (this.orderReceivedToday / this.orderReceived) * 100;
          //     // if (percent.toString() === 'NaN') {
          //     //   this.orderReceivedPercent = 0;
          //     // } else { this.orderReceivedPercent = Math.round(percent * 100) / 100; }
          //   }
          // );
        }
      );
    } else {
      this.dashboardService.get_ordersReceived().subscribe(
        data => {
          this.orderReceived = data;
          console.log('----------------data---->>>>', this.orderReceived);
          if (this.orderReceived !== null){
            this.orderReceivedToday = this.orderReceived.TodayOrder;
            this.orderReceivedPercent = this.orderReceived.percent.toFixed(2)  
          }
          console.log('--------Percent---------', this.orderReceivedToday);
          this.dashboardService.get_ordersReceivedToday().subscribe(
            data2 => {
              console.log('--------Today--------->>>>>>>', data2);
              this.orderReceivedToday = this.orderReceived.TodayOrder;
              // const percent = (this.orderReceivedToday / this.orderReceived) * 100;
              // if (percent.toString() === 'NaN') {
              //   this.orderReceivedPercent = 0;
              // } else { this.orderReceivedPercent = Math.round(percent * 100) / 100; }
            }
          );
        }
      );
    }

  }

  getOrdersShipped() {

    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_orderShippedOrg(this.companyCode).subscribe(
        data => {
          this.orderShipped = data;
          this.dashboardService.get_orderShippedTodayOrg(this.companyCode).subscribe(
            data2 => {
              console.log("ship data--2->", data2)
              this.orderShippedToday = data2.TodayShipped;
              if (data2.percent !== undefined){
                this.orderShippedPercent = data2.percent.toFixed(2);
              }
              // const percent = (this.orderShippedToday / this.orderShipped) * 100;
              // if (percent.toString() === 'NaN') {
              //   this.orderShippedPercent = 0;
              // } else { console.log('percent 2-------->', percent); this.orderShippedPercent = Math.round(percent); }
            }
          );
        }
      );
    } else {
      this.dashboardService.get_orderShipped().subscribe(
        data => {
          this.orderShipped = data;
          console.log("ship data-1-->", data)
          this.dashboardService.get_orderShippedToday().subscribe(
            data2 => {
              console.log("ship data--2->", data2)
              this.orderShippedToday = data2.TodayShipped;
              this.orderShippedPercent = data2.percent.toFixed(2);
              // const percent = (this.orderShippedToday / this.orderShipped) * 100;
              // if (percent.toString() === 'NaN') {
              //   this.orderShippedPercent = 0;
              // } else { console.log('percent 2-------->', percent); this.orderShippedPercent = Math.round(percent); }
            }
          );
        }
      );

    }

  }


  // getOrdersOnTime() {
  //   this.dashboardService.get_orderShipped().subscribe(
  //     data => {
  //       this.orderShipped = data;
  //       console.log('data----------1-->', data);
  //       this.dashboardService.get_orderShippedToday().subscribe(
  //         data2 => {
  //           this.orderShippedToday = data2;
  //           console.log('data----------2-->', data2);
  //           const percent = (this.orderShippedToday / this.orderShipped) * 100;
  //           if (percent.toString() === 'NaN') {
  //             this.orderShippedPercent = 0;
  //           } else { console.log('percent 2-------->', percent); this.orderShippedPercent = percent; }
  //         }
  //       );
  //     }
  //   );
  // }

  barOrderShipped() {
    this.showGraph = 'shipped';
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_barGraphDataShippedOrg(this.barGraphDays, this.companyCode).subscribe(
        data => {
          this.barGraphDataRecived = data.Shipped;
          console.log('-----bargraphShipped---------------->>>>', this.barGraphDataRecived);
          this.barOrderShipped2();
        })
    } else {
      this.dashboardService.get_barGraphDataShipped(this.barGraphDays).subscribe(
        data => {
          this.barGraphDataRecived = data.Shipped;
          console.log('-----bargraphShipped---------------->>>>', this.barGraphDataRecived);
          this.barOrderShipped2();
        })
    }
  }

  barOrderShipped2() {
    if (this.barGraphDays.toString() === '7') {
     
      this.dayGraph = ['1', '2', '3', '4', '5', '6', '7'];
    }
    if (this.barGraphDays.toString() === '30') {
      this.dayGraph = ['4', '8', '12', '16', '20', '24', '30'];
    }

    if (this.barGraphDays.toString() === '90') {
      this.dayGraph = ['15', '30', '45', '60', '75', '90'];
    }

    Highcharts.chart('container2', {
      chart: {
        backgroundColor:
        {
          linearGradient: [500, 500, 500, 0],
          stops: [
            [0, 'transparent'],
            [1, '#FFFFFF']
          ]
        },
        type: 'column',
        height: '80%'
      },
      title: {
        text: ''
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      xAxis: {
        title: {
          text: 'Days'
        },
        labels: {
          style: {
            color: 'gray'
          }
        },
        categories: this.dayGraph,
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            color: 'gray'
          }
        },
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        shared: true
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        }
      },
      series: [{
        name: 'No of orders',
        data: this.barGraphDataRecived
      }]
    });

  }

  barOrderReceived() {
    this.showGraph = 'received';
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_barGraphDataOrg(this.barGraphDays, this.companyCode).subscribe(
        data => {
          this.barGraphData = data.Actual;
          console.log('--organization---order received graph---------------->>>>', this.barGraphData);
          this.barOrderReceived2();
        }
      );
    } else {
      this.dashboardService.get_barGraphData(this.barGraphDays).subscribe(
        data => {
          this.barGraphData = data.Actual;
          console.log('-----organization-------order received graph--------->>>>', this.barGraphData);
          this.barOrderReceived2();
        }
      );
    }
  }


  barOrderReceived2() {
    if (this.barGraphDays.toString() === '7') {
      // this.dayGraph = ['7', '6', '5', '4', '3', '2', '1'];
      this.dayGraph = ['1', '2', '3', '4', '5', '6', '7'];

    }
    if (this.barGraphDays.toString() === '30') {
      // this.dayGraph = ['30', '24', '20', '16', '12', '8', '4'];
      this.dayGraph = ['4', '8', '12', '16', '20', '24', '30'];
    }

    if (this.barGraphDays.toString() === '90') {
      // this.dayGraph = ['90', '75', '60', '45', '30', '15'];
      this.dayGraph = ['15', '30', '45', '60', '75', '90'];
    }
    Highcharts.chart('container2', {
      chart: {
        backgroundColor:
        {
          linearGradient: [500, 500, 500, 0],
          stops: [
            [0, 'transparent'],
            [1, '#FFFFFF']
          ]
        },
        type: 'column',
        height: '80%'
      },
      title: {
        text: ''
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      xAxis: {
        title: {
          text: 'Days'
        },
        labels: {
          style: {
            color: 'gray'
          }
        },
        categories: this.dayGraph
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            color: 'gray'
          }
        },
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        shared: true
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        }
      },
      series: [{
        name: 'No of orders',
        data: this.barGraphData
      }]
    });
  }

  timeGraph() {
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_timeGraphDataOrg(this.timeGraphDays, this.companyCode).subscribe(
        data => {
          this.timeGraphData = data
          console.log('----organizaiton-----TimeGraph------->>>>>>', this.timeGraphData);
          this.timeGraph2();
        });
    } else {
      this.dashboardService.get_timeGraphData(this.timeGraphDays).subscribe(
        data => {
          this.timeGraphData = data
          console.log('---normal------TimeGraph------->>>>>>', this.timeGraphData);
          this.timeGraph2();
        });
    }
  }

  timeGraph2() {
    if (this.timeGraphDays.toString() === '7') {
       this.ForecastdayGraph = ['1', '2', '3', '4', '5', '6', '7'];
      
    }
    if (this.timeGraphDays.toString() === '30') {
       this.ForecastdayGraph = ['4', '8', '12', '16', '20', '24', '30'];

    }

    if (this.timeGraphDays.toString() === '90') {
     this.ForecastdayGraph = ['15', '30', '45', '60', '75', '90'];
     
    }

    if (this.timeGraphDays.toString() === '90') {
      this.timeGraphData.Actual.splice(-1, 1);
      this.timeGraphData.Forecasted.splice(-1, 1);
    }

    Highcharts.chart('container3', {
      chart: {
        backgroundColor:
        {
          linearGradient: [500, 500, 500, 0],
          stops: [
            [0, 'transparent'],
            [1, '#FFFFFF']
          ]
        },
        type: 'spline',
        height: '80%'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: 'Time Line'
      },
      xAxis: {
        type: 'datetime',
        // dateTimeLabelFormats: {
        //   month: '%e. %b',
        //   year: '%b'
        // },
        title: {
          text: 'Date'
        },
        labels: {
          style: {
            color: 'gray'
          }
        },
        categories: this.ForecastdayGraph
      },
      yAxis: {
        title: {
          text: 'Orders'
        },
        min: 0,
        labels: {
          style: {
            color: 'gray'
          }
        },
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        // pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
      },

      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },

      series: [{
        name: 'Actual',

        data: this.timeGraphData.Actual
      },
      {
        name: 'Forcast',

        data: this.timeGraphData.Forcast  
      }
      ]


    });
this.spinnerService.hide();

  }

  onTimeGraph() {
    this.showGraph = 'ontime';
    if (this.companyCode !== undefined && this.companyCode !== 'STAHLS') {
      this.dashboardService.get_ordersOnTimeShippedOrg(this.onTimeDays, this.companyCode).subscribe(
        data => {
          // this.onTimeShipped = data;
          console.log('organization on time ----- ', data);
          this.onTimeShipped = data.ShippedGraphCount;
          this.onTimeForecasted = data.ForcastGraphCount;
          this.onTimeGraph2()
          // this.dashboardService.get_ordersOnTimeForecastOrg(this.onTimeDays, this.companyCode).subscribe(
          //   data2 => {
          //     this.onTimeForecasted = data2;
          //     this.onTimeGraph2()
          //   });
        });
    } else {
      this.dashboardService.get_ordersOnTimeShipped(this.onTimeDays).subscribe(
        data => {
          console.log("normal on time ------ ", data);
          this.onTimeShipped = data.ShippedGraphCount;
          this.onTimeForecasted = data.ForcastGraphCount;
          this.onTimeGraph2()
          // this.dashboardService.get_ordersOnTimeForecast(this.onTimeDays).subscribe(
          //   data2 => {
          //     this.onTimeForecasted = data2;
          //     this.onTimeGraph2()
          //   });
        });
    }

  }

  onTimeGraph2() {

    if (this.onTimeDays.toString() === '7') {
      //this.onTimedayGraph = ['7', '6', '5', '4', '3', '2', '1'];
      this.onTimedayGraph = ['1', '2', '3', '4', '5', '6', '7'];
      
    }
    if (this.onTimeDays.toString() === '30') {
      //this.onTimedayGraph = ['30', '24', '20', '16', '12', '8', '4'];
      this.onTimedayGraph = ['4', '8', '12', '16', '20', '24', '30'];
      
    }

    if (this.onTimeDays.toString() === '90') {
      // this.onTimedayGraph = ['90', '75', '60', '45', '30', '15'];
      this.onTimedayGraph = ['15', '30', '45', '60', '75', '90'];
    }

    Highcharts.chart('container2', {
      chart: {
        type: 'column',
        height: '80%',
        backgroundColor:
        {
          linearGradient: [500, 500, 500, 0],
          stops: [
            [0, 'transparent'],
            [1, '#FFFFFF']
          ]
        },
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: this.onTimedayGraph,
        crosshair: true,
        title: {
          text: 'Days'
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Orders'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
        // series: {
        //   color: '#64b448'
        // }
      },
      series: [{
        name: 'Total Shipped',
        data: this.onTimeShipped,
        color: '#64b448'

      }, {
        name: 'Total Forecasted',
        data: this.onTimeForecasted

      }]
    });
  }

}
