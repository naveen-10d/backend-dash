import { DataSource } from '@angular/cdk/table';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { InvoiceService } from './invoice.service';
import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
@Injectable()
export class InvoiceDataSource implements DataSource<any> {
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public countValue: Number;
    public loading$ = this.loadingSubject.asObservable();
    constructor(private invoiceService: InvoiceService, private dailog: MatDialog) { }
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        console.log('data source  connection are ------ >>> ');
        return this.dataSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }
    loadDatas(pageIndex: number, pageSize: number, sortLabel: String,
        sortDirection: String, search: any, item: String[],
        status: String[]) {
        this.loadingSubject.next(true);
        this.invoiceService.getData(pageIndex, pageSize, sortLabel,
            sortDirection, search, item, status).pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
            .subscribe(responses => {
                this.countValue = responses['count'];
                this.dataSubject.next(responses['response']);
                if (this.countValue === undefined && item.length === 0 && status.length === 0  && search === '') {
                    this.OpenDialog();
                }
            });
    }

    loadDatasByCompanyCode(pageIndex: number, pageSize: number, sortLabel: String,
        sortDirection: String, search: any,
        item: String[], status: String[], companyCode: any) {
        this.loadingSubject.next(true);
        this.invoiceService.getDataByCompanyCode(pageIndex, pageSize, sortLabel,
            sortDirection, search,
            item, status, companyCode).pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
            .subscribe(responses => {
                this.countValue = responses['count'];
                this.dataSubject.next(responses['response']);
                if (this.countValue === undefined && item.length === 0 && status.length === 0 && search === '') {
                    this.OpenDialog();
                }
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
        dialogConfig.data = ' No Data in Invoice';
        const dialogRef = this.dailog.open(AlertDialogComponent, dialogConfig);
    }

}
