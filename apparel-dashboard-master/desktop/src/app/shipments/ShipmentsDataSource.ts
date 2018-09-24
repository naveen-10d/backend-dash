import { DataSource } from '@angular/cdk/table';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { ShipmentsService } from './shipments.service';
@Injectable()

export class ShipmentDataSource implements DataSource<any> {

    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public countValue: Number;
    public loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        console.log('data source  connection are ------ >>> ');
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    constructor(private Shipmentservice:ShipmentsService , private dialog: MatDialog) { }

    loadDatas(
        pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any,
        ponumber: String [],
        startdate: any,
        enddate: any
    ) {

        this.loadingSubject.next(true);

        this.Shipmentservice.getData(
            pageIndex, pageSize, sortLabel,
            sortDirection, search,ponumber,startdate,enddate).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                if (this.countValue === undefined && search === '' && ponumber.length === 0 && startdate === '' && enddate === '' ) {
                    this.OpenDialog();
                }
                this.dataSubject.next(lessons['response']);
                console.log('data source  connection are ------ >>> ',lessons['response']);
            });

    }
    loadDatasByCompanyCode(
        pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any,
        ponumber: String [],
        companyCode: any,
        startdate: any,
        enddate: any
        ) {

        this.loadingSubject.next(true);

        this.Shipmentservice.getDataByCompanyCode(
            pageIndex, pageSize, sortLabel, sortDirection, search,ponumber, companyCode,startdate,enddate).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                if (this.countValue === undefined && search === '' && ponumber.length === 0 && startdate === '' && enddate === '') {
                    this.OpenDialog();
                }
                this.dataSubject.next(lessons['response']);
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
        dialogConfig.data = 'no data in Shipments';
        const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    }

}