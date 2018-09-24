import { DataSource } from '@angular/cdk/table';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TicketService } from './ticket.service';
import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialog/alert-dialog/alert-dialog.component';

@Injectable()
// tslint:disable-next-line:class-name
export class TicketDataSource implements DataSource<any> {

    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public countValue: Number;
    public loading$ = this.loadingSubject.asObservable();
    showArrayObject: any[] = [];

    constructor(private ticketService: TicketService, private dialog: MatDialog) { }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        console.log('data source  connection are ------ >>> ');
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadDatas(
        pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any,
        createdBy: String[],
        assignedTo: String[],
        status: String[],
        organization: String[]
    ) {

        this.loadingSubject.next(true);

        this.ticketService.getData(
            pageIndex, pageSize, sortLabel,
            sortDirection, search, createdBy, assignedTo, status, organization).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                if (this.countValue === undefined && createdBy.length === 0 && assignedTo.length === 0 && status.length === 0
                    && organization.length === 0 && search === '') {
                    this.OpenDialog();
                }
                this.showTableData(lessons['response']);
            });

    }
    loadDatasByCompanyCode(
        pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any,
        createdBy: String[],
        assignedTo: String[],
        status: String[],
        orgId: any) {

        this.loadingSubject.next(true);

        this.ticketService.getDataByOrgId(
            pageIndex, pageSize, sortLabel, sortDirection, search, createdBy, assignedTo, status, orgId).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                console.log('lessons values are -code---- ', lessons);
                if (this.countValue === undefined && createdBy.length === 0 && assignedTo.length === 0 && status.length === 0
                    && search === '') {
                    this.OpenDialog();
                }
                this.showTableData(lessons['response']);
                // this.dataSubject.next(lessons['response']);
            });

    }

    getSearchResultByOrgId(pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any, orgId: any) {
        this.loadingSubject.next(true);
        this.ticketService.getSearchResultByOrgId(pageIndex, pageSize, sortLabel, sortDirection, search, orgId).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                //   if (this.countValue === undefined && createdBy.length === 0 && assignedTo.length === 0 && status.length === 0
                //     && search === '') {
                //     this.OpenDialog();
                // }
                this.showTableData(lessons['response']);
            });
    }


    getSearchResult(pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any) {
        this.loadingSubject.next(true);
        this.ticketService.getSearchResult(pageIndex, pageSize, sortLabel, sortDirection, search).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                //   if (this.countValue === undefined && createdBy.length === 0 && assignedTo.length === 0 && status.length === 0
                //     && search === '') {
                //     this.OpenDialog();
                // }
                this.showTableData(lessons['response']);
            });
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
        dialogConfig.data = 'no data in Ticket';
        const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    }

    showTableData(data) {
        console.log('show table data response ----- ', data);
        this.showArrayObject = [];
        if (data !== undefined) {
            data.forEach(element => {
                const singleObject = {
                    uuid: '',
                    id: element.id,
                    Date: '',
                    orderNumberList: [],
                    Company: '',
                    createdByName: '',
                    assignedToName: [],
                    type: '',
                    status: '',
                    PONumberList: [],
                    Description: ''
                };
                singleObject.uuid = element.uuid;
                singleObject.Date = element.Date;
                singleObject.Description = element.description;
                if (element.salesorder.length === 0) {
                    singleObject.orderNumberList = [];
                } else {
                    for (let i = 0; i < element.salesorder.length; i++) {
                        // singleObject.orderNumberList = element.salesorder[i].uuid;
                        singleObject.orderNumberList.push(element.salesorder[i].OrderNumber);
                    }
                }
                if (element.salesorder.length === 0) {
                    singleObject.PONumberList = [];
                } else {
                    for (let i = 0; i < element.salesorder.length; i++) {
                        singleObject.PONumberList.push(element.salesorder[i].PONumber);
                    }
                }
                singleObject.createdByName = element.created_by.firstname;
                if (element.assigned_to.length > 0) {
                    for (let i = 0; i < element.assigned_to.length; i++) {
                        singleObject.assignedToName.push(element.assigned_to[i].firstname);
                    }
                    // singleObject.assignedToName = element.assigned_to.firstname;
                }
                if (element.organizationUuid != null) {
                    singleObject.Company = element.organization.organizationname;
                }
                singleObject.type = element.Type;
                singleObject.status = element.Status;
                this.showArrayObject.push(singleObject);
            });
            console.log('show array object are --- ', this.showArrayObject);
            if (this.showArrayObject.length === 0) {
                //   this.dataSource = new MatTableDataSource([]);
                this.dataSubject.next([]);
            } else {
                //   this.dataSource = new MatTableDataSource(this.showArrayObject);
                this.dataSubject.next(this.showArrayObject);
            }
        }
    }

}
