import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TicketService } from './ticket.service';
import { TicketDetailsComponent } from './ticketDetails/ticketDetailsComponent';
import { NewTicketComponent } from '../tickets/newTicket/newTicketComponent';
import { TicketFilter } from '../tickets/ticketFilter/ticketFilter.Component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'page-ticketdashboard',
  templateUrl: 'ticketdashboard.html',

})

export class TicketDashboardPage implements OnInit {

  public allList: {};
  searchTerm: string = '';
  public createdBy: any[];
  public assignedTo: any[];
  private listOfTicketToFilter: any[] = [];
  private name: any;
  public status: any[];
  private filtercreatedby: any[];
  private filterassignedto: any[];
  private filterStatus: any[];
  private filterSort: any;
  private componentName;
  private assignedtoname: any;
  private orgUUID: any;
  private organizationname: any;
  constructor(public navCtrl: NavController, private ticketService: TicketService, private nav: NavParams,
    private spinnerservice: Ng4LoadingSpinnerService, private alertCtrl: AlertController) {
    if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
      this.orgUUID = JSON.parse(localStorage.getItem('currentuser')).user.organization.uuid;
      this.organizationname = JSON.parse(localStorage.getItem('currentuser')).user.organization.organizationname;
    }

  }

  searchQuery: string = '';
  items: string[];
  Ticketslist: any;
  listOfTicketItems: any;
  private createdby: any[];
  private assigendto: any[];
  private ticketstatus: any;
  assignedname: any;
  ordernumber: any;
  ngOnInit(): void {
    console.log('org name------->', this.organizationname);
    if (this.organizationname === undefined) {
      this.getAlladminticket()
    } else {
      this.add_Ticketlist();
    }
    this.componentName = this.navCtrl.getPrevious().component.name;

  }

  getAlladminticket() {
    this.spinnerservice.show();
    this.createdby = [];
    this.ticketstatus = [];
    this.assigendto = [];
    this.assignedname = [];
    this.Ticketslist = [];
    this.listOfTicketItems = [];
    this.ticketService.getAllTicket().subscribe(
      data => {
        if (data === 'There is no Tickets') {
          let alert = this.alertCtrl.create({
            message: 'No data in Tickets',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Dismiss Clicked')
                }
              },
            ]
          });
          alert.present();
        } else {
          data.forEach(element => {
            if (element.organization !== null) {
              this.Ticketslist.push(element)
              this.listOfTicketItems.push(element)
            }
          })
          this.spinnerservice.hide();
          // this.Ticketslist = data;
          // this.listOfTicketItems = data;
          console.log("list of tickets are --- ", this.Ticketslist)
          this.ticketstatus = Array.from(new Set(this.listOfTicketItems.map((customerArray => customerArray.Status))));
          console.log('-------test------', this.ticketstatus);
          this.listOfTicketItems.forEach(element => {
            this.createdby.push(element.created_by);
            this.assigendto.push(element.assigned_to);
          })
          this.assigendto.forEach(element => {
            this.assignedname.push(element);
          })
          this.getparamvalue();
        }
      },
      error => {
        this.spinnerservice.hide();
        console.log('something went wrong');
        if (error.status === 404) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'Something went wrong with displaying Tickets',
            buttons: ['Dismiss']
          });
          alert.present();
        }

      }
    )
  }

  add_Ticketlist() {
    this.spinnerservice.show();
    this.createdby = [];
    this.ticketstatus = [];
    this.assigendto = [];
    this.assignedname = [];
    console.log('----------Organization--------', this.organizationname);
    if (this.organizationname !== 'Stahls' && this.organizationname !== undefined) {
      console.log('----------Organization--------', this.orgUUID);
      this.ticketService.getAllTicketByOrg(this.orgUUID).subscribe(data => {
        this.spinnerservice.hide();
        if (data === 'There is no Tickets') {
          let alert = this.alertCtrl.create({
            message: 'No data in Tickets',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Dismiss Clicked')
                }
              },
            ]
          });
          alert.present();
        } else {
          this.Ticketslist = data;
          this.listOfTicketItems = data;
          console.log("list of org tickets are --- ", this.Ticketslist)
          this.ticketstatus = Array.from(new Set(this.listOfTicketItems.map((customerArray => customerArray.Status))));
          console.log('-------test------', this.ticketstatus);
          this.listOfTicketItems.forEach(element => {
            this.createdby.push(element.created_by);
            this.assigendto.push(element.assigned_to);
          })
          this.assigendto.forEach(element => {
            this.assignedname.push(element);
          })
          this.getparamvalue();
        }
      }, error => {
        this.spinnerservice.hide();
        console.log('something went wrong');
        if (error.status === 404) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'Something went wrong with displaying Tickets',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      })
    } else {
      this.ticketService.getAllTicket().subscribe(
        data => {
          this.spinnerservice.hide();
          if (data === 'There is no Tickets') {
            let alert = this.alertCtrl.create({
              message: 'No data in Tickets',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Dismiss Clicked')
                  }
                },
              ]
            });
            alert.present();
          } else {
            this.Ticketslist = data;
            this.listOfTicketItems = data;
            console.log("list of all tickets are --- ", this.Ticketslist)
            this.ticketstatus = Array.from(new Set(this.listOfTicketItems.map((customerArray => customerArray.Status))));
            console.log('-------test------', this.ticketstatus);
            this.listOfTicketItems.forEach(element => {
              this.createdby.push(element.created_by);
              this.assigendto.push(element.assigned_to);
            })
            this.assigendto.forEach(element => {
              this.assignedname.push(element);
            })
            this.getparamvalue();
          }
        },
        error => {
          this.spinnerservice.hide();
          console.log('something went wrong');
          if (error.status === 404) {
            let alert = this.alertCtrl.create({
              title: 'Error',
              message: 'Something went wrong with displaying Tickets',
              buttons: ['Dismiss']
            });
            alert.present();
          }

        }
      )
    }
  }

  getparamvalue() {
    this.assignedtoname = [];
    this.filterassignedto = this.nav.get('assigned')
    this.filtercreatedby = this.nav.get('createdby');
    this.filterStatus = this.nav.get('status');
    this.componentName = this.nav.get('componentname');
    if (this.filterStatus === undefined) {
      this.filterStatus = []
    }
    if (this.filtercreatedby === undefined) {
      this.filtercreatedby = []
    }
    if (this.filterassignedto === undefined) {
      this.filterassignedto = []
    }
    this.filterSort = this.nav.get('sort');
    if (this.componentName === "TicketFilter") {
      let filterCount, leastCount;
      if (this.filtercreatedby.length > this.filterStatus.length) {
        filterCount = this.filtercreatedby.length;
        leastCount = this.filterStatus.length;
      } else {
        filterCount = this.filterStatus.length;
        leastCount = this.filtercreatedby.length;
      }
      let filteredValue = this.listOfTicketItems.filter((item) => {
        if (item.assigned_to.length !== 0) {
          this.filterassignedto.forEach(name => {
            item.assigned_to.forEach(element => {
              console.log('----------', name);
              console.log('------------', element.firstname);
              if (name === element.firstname) {
                this.assignedtoname.push(item);
                console.log('------item----------', item);
                return true;
              }
            });
          })
        }
        if (filterCount !== 0) {
          for (let i = 0; i < filterCount; i++) {
            for (let j = 0; j < filterCount; j++) {
              if (((item.created_by.firstname.indexOf(this.filtercreatedby[i]) > -1) || (this.filtercreatedby.length === 0)) &&
                ((item.Status.indexOf(this.filterStatus[j]) > -1) || (this.filterStatus.length === 0))) {
                return true;
              }
            }
          }
        }
        else {
        }
      })
      console.log('-------filtervalue-------------', filteredValue);
      if (filteredValue.length === 0) {
        filteredValue = this.listOfTicketItems;
      }
      if (this.filterSort != undefined) {
        if (this.filterSort === "status") {
          filteredValue.sort(function (a, b) {
            return (a.Status.toLowerCase() > b.Status.toLowerCase()) ? 1 : ((b.Status.toLowerCase() > a.Status.toLowerCase()) ? -1 : 0);
          });
        }
        else if (this.filterSort === "date") {
          filteredValue.sort(function (a, b) {
            return (a.Date > b.Date) ? 1 : ((b.Date > a.Date) ? -1 : 0);
          });
        }

      }
      this.Ticketslist = filteredValue;
      if (this.assignedtoname.length !== 0) {
        this.Ticketslist = this.assignedtoname;
      }
    }
    else {
      this.Ticketslist = this.listOfTicketItems;
    }
  }

  ionViewDidLoad() {

  }

  setFilteredItems() {
    // const filteredValue = this.dataService.filterItems(this.listOfTicketItems, this.searchTerm);
    const filteredValue = this.filterItems(this.listOfTicketItems, this.searchTerm);
    console.log('------seacrh--------', filteredValue);
    if (filteredValue === false) {
      console.log("entering into filteredd valeus ")
      this.Ticketslist = this.listOfTicketItems;
    }
    else {
      console.log("entering into else part")
      this.Ticketslist = filteredValue;

    }

  }

  filterItems(items, searchTerm) {
    if (searchTerm === '') {
      return false;
    }
    else {
      return items.filter((item) => {
        item.assigned_to.forEach(element => {
          this.name = element.firstname;
        });
        item.salesorder.forEach(orders => {
          this.ordernumber = orders.OrderNumber;
        });
        if (this.name !== undefined && this.name !== null) {
          if (this.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.description !== null && item.description !== undefined) {
          if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.created_by.firstname !== null && item.created_by.firstname !== undefined) {
          if (item.created_by.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (this.ordernumber !== null && this.ordernumber !== undefined) {
          if (this.ordernumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.Date !== null && item.Date !== undefined) {
          if (item.Date.indexOf(searchTerm) > -1) {
            return true;
          }
        }
        if (item.uuid !== null && item.uuid !== undefined) {
          if (item.uuid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        if (item.Status !== null && item.Status !== undefined) {
          if (item.Status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
        }
        for (let i = 0; i < item.salesorder.length; i++) {
          if (item.salesorder[i].uuid.indexOf(searchTerm) > -1) {
            return true;
          }
        }
      });
    }
  }

  filterOrder() {
    console.log("---->Filter Clicked ------------ >  ", this.assignedname);
    this.navCtrl.push(TicketFilter, {
      ticketcreated: this.createdby,
      ticketstatus: this.ticketstatus,
      ticketassigned: this.assignedname
    });
  }

  displayTicketDetails(ticket) {
    console.log("----> ticket details--> ", ticket);
    this.navCtrl.push(TicketDetailsComponent, {
      ticketUuid: ticket.uuid
    })
    // this.navCtrl.setRoot(OrderDetailsComponent);
  }


  getItems(ev: any) {

    console.log("get selected itemsa reare ----- >>> ", ev);
    this.Ticketslist = this.Ticketslist;
    // console.log("allticket to be filtered are ----- ", this.allTicketsToFilter)
    console.log("list of tickets are ---- ", this.Ticketslist)
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.Ticketslist = Object(this.Ticketslist).filter((item) => {
        return (item.assigned_to.firstname.toLowerCase().indexOf(val) > -1);
      })
    }
  }
  gotoNewTicket() {
    console.log("---->new ticket--> ");
    this.navCtrl.push(NewTicketComponent, {
    });
  }
  doRefresh(refresher) {
    this.add_Ticketlist();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
