import { Component } from "@angular/core";
import { NavParams, NavController } from 'ionic-angular';
import { TicketService } from '../ticket.service';
import { CloseTicketComponent } from '../closeTicket/closeTicketComponent';
import { TicketDashboardPage } from '../ticketdashboard';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-ticketDetails',
    templateUrl: 'ticketDetails.html'
})

export class TicketDetailsComponent {

    private ticket;
    private orgUUID;
    private organizationname;
    private allOrganization;
    private myOrganization = [];
    private allUser = [];
    private userToDisplay;
    private Organization: any [] = [];
    private User: any [] = [];
    private Username;
    private Useruuid;
    private currentUser;
    constructor(private navParam: NavParams, private navCtrl: NavController, private ticketService: TicketService,
        private alertctrl: AlertController) {
            this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
            if (this.currentUser != null) {
                this.Username = this.currentUser.user.firstname;
                this.Useruuid = this.currentUser.user.uuid;
            }          
        if (JSON.parse(localStorage.getItem('currentuser')).user.organization !== null) {
            this.orgUUID = JSON.parse(localStorage.getItem('currentuser')).user.organization.uuid;
            this.organizationname = JSON.parse(localStorage.getItem('currentuser')).user.organization.organizationname;
        }

    }
    ngOnInit(): void {
        console.log('-------Organization-----', this.Organization)
        console.log('-------User-----', this.User)
        this.getAllTicket();
        this.getAllOrganization();
        this.getAllOrganizationUser();
    }

    getAllTicket() {
        const uuid = this.navParam.get('ticketUuid');
        console.log("uuid of selected tickets are --- ", uuid);
        this.ticketService.getTicketByUuid(uuid).subscribe(
            data => {
                this.ticket = data;
                console.log("list of ticket in details are ----- ", data)
            },
            error => {
                console.log("something went wrong")
            }
        )
    }

    getAllOrganization() {
        console.log('---------Organizationname------>>>>>>', this.organizationname);
        if (this.organizationname === 'Stahls') {

            this.ticketService.orgGetAll().subscribe(

                data => {
                    // this.UsersList = data;
                    this.allOrganization = data;
                    // this.OrdersSource = new MatTableDataSource(this.UsersList);
                },
                error => {
                    console.log(error);
                }
            );

        }
        if (this.organizationname === undefined) {
            this.ticketService.orgGetAll().subscribe(

                data => {
                    console.log('org------> ', data);
                    this.myOrganization = data;
                    this.allOrganization = data;
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.allOrganization = ['Stahls', this.organizationname];
            this.ticketService.orgGetAll().subscribe(

                data => {
                    console.log('org------> ', data);
                    data.forEach(element => {
                        if (element.organizationname === 'Stahls') {
                            this.myOrganization.push(element);
                            this.allOrganization.push(element);
                        }
                        if (element.organizationname === this.organizationname) {
                            this.myOrganization.push(element);
                            this.allOrganization.push(element);
                        }

                    });
                },
                error => {
                    console.log(error);
                }
            );
        }
    }
    getAllOrganizationUser() {
        this.ticketService.getAllUser().subscribe(

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
    filterOrg(data) {
        console.log('--------Data-----',data);
        this.userToDisplay = [];
        for (let i = 0; i < this.allUser.length; i++) {
          if (this.allUser[i].organization !== null && this.allUser[i].organization !== '') {
            if (this.allUser[i].organization.uuid === data.uuid) {
              this.userToDisplay.push(this.allUser[i]);
            }
          }
        }
      }
      saveAssignedUserTicket() {
        const Object = {
          ticketUuid: this.ticket.uuid,
          assignedUsers: this.User
        };
        // console.log('-------------Object-------->>>>>', Object);
        this.ticketService.createAssignedUserTicket(Object).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => {
            this.ticket.Status = 'Assigned';
            // tslint:disable-next-line:no-shadowed-variable
            this.ticketService.updateticket(this.ticket).subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              data => {
                this.sendMessage();
                this.navCtrl.setRoot(TicketDashboardPage,{});
              },
              error => {
                console.log('something went wrong');
              }
            );
          },
          error => {
            console.log('something went wrong');
    
          }
        );
      }

      sendMessage() {

        this.ticketService.getTicketByUuid(this.ticket.uuid).subscribe(
          data => {
            this.ticket = data;
            data.currentUser = this.Username;
            this.ticketService.sendMail(data).subscribe(
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
    
    closeTicket() {
        console.log("opening close ticket modal are ", this.ticket);
        this.navCtrl.push(CloseTicketComponent, { ticketdetail: this.ticket });
    }
    ReopenTicket() {
        let alert = this.alertctrl.create({
            title: 'Reopen Ticket Confirm',
            message: 'You have Proceeded to Reopen this Ticket',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Dismiss Clicked')
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        const datatoupdate = this.ticket;
                        datatoupdate.CloseReason = '';
                        datatoupdate.CloseReasonUuid = '';
                        datatoupdate.assigned_to = [];
                        datatoupdate.Status = "Reopen";
                        console.log('-----------datatoupdate-----------', datatoupdate);
                        this.ticketService.ReopenTicket(datatoupdate).subscribe(data => {
                            console.log('----------updated data-----------', data);
                        }, error => {

                        });
                        this.navCtrl.setRoot(TicketDashboardPage, {
                        });
                    }
                }
            ]
        });
        alert.present();

    }
}