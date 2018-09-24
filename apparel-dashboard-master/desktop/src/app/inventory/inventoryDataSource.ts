import { DataSource } from '@angular/cdk/table';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { InventoryService } from './inventory.service';
import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InventoryComponent } from './inventory.component';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';

@Injectable()
// tslint:disable-next-line:class-name
export class inventoryDataSource implements DataSource<any> {

    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public countValue: Number;
    public loading$ = this.loadingSubject.asObservable();

    constructor(private inventoryService: InventoryService, private dialog: MatDialog) { }

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
        style: String[],
        color: String[],
        size: String[],
        code: String[]
    ) {

        this.loadingSubject.next(true);

        this.inventoryService.getData(
            pageIndex, pageSize, sortLabel,
            sortDirection, search, style, color, size, code).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                if (this.countValue === undefined && style.length === 0 && color.length === 0 && size.length === 0
                    && code.length === 0 && search === '') {
                    this.OpenDialog();
                }
                this.dataSubject.next(lessons['response']);
            });

    }
    loadDatasByCompanyCode(
        pageIndex: number,
        pageSize: number,
        sortLabel: String,
        sortDirection: String,
        search: any,
        style: String[],
        color: String[],
        size: String[],
        companyCode: any) {

        this.loadingSubject.next(true);

        this.inventoryService.getDataByCompanyCode(
            pageIndex, pageSize, sortLabel, sortDirection, search, style, color, size, companyCode).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => {
                this.countValue = lessons['count'];
                if (this.countValue === undefined && style.length === 0 && color.length === 0 && size.length === 0
                    && search === '') {
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
        dialogConfig.data = 'no data in Inventory';
        const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    }

}
