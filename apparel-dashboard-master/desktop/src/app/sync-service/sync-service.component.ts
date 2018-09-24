import { Component, OnInit, ViewChild } from '@angular/core';
import { SyncService } from './sync-service.service';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-sync-service',
  templateUrl: './sync-service.component.html',
  styleUrls: ['./sync-service.component.css']
})
export class SyncServiceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // sliderValue(arg0: any, arg1: any): any {
  //   throw new Error("Method not implemented.");
  // }
  displayedColumns = ['Sync Date', 'Sync Time', 'Table', 'Status', 'ExportDate'];
  dataSource: any = [];

  constructor(private syncService: SyncService, private dailog: MatDialog) { }

  public frequency: any;

  public time: number;
  public update: any;
  public enable: boolean;
  public sliderValue: Number;

  ngOnInit() {
    // this.enable=false
    this.timeFrequency();
    this.getSyncService();
    // this.sliderValue = 50;
  }

  getSyncService() {
    this.syncService.getallSyncService().subscribe(data => {
      console.log('success to frequency --- ', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'Updated Date': return item.updatedAt;
          case 'SyncConfig': return item.SyncConfig;
          case 'SyncStatus': return item.SyncStatus;
          case 'SyncTable': return item.SyncTable;
          case 'Created Date': return item.createdAt;
          case 'ExportDate': return item.DataExportDate;
          default: return item[property];
        }
      };
    }, error => {
      console.log('--------error----------', error);
    });
  }

  timeFrequency() {
    this.syncService.getFrequency().subscribe(
      data => {
        console.log('success to frequency --- ', data);
        this.frequency = data;
        this.sliderValue = data.value;
        if (this.sliderValue === data.value) {
          this.update = false;
        }
      },
      error => {
        // if (error.status === 404) {
        this.OpenDialog();
        // }
        console.log('something went wrong');
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
    dialogConfig.data = 'Sync-Service is Down';
    const dialogRef = this.dailog.open(AlertDialogComponent, dialogConfig);
  }

  updateTime() {
    console.log('testing update time values are ------ ', this.sliderValue);
    this.frequency.value = this.sliderValue;
    this.syncService.updateFrequency(this.frequency).subscribe(
      data => {
        console.log('success updated', data);
        this.enable = false;
      },
      error => {
        console.log('something went wrong');
      }
    );
  }

  Onchange() {
    console.log('----------------------', this.sliderValue);
    if (this.frequency.value !== this.sliderValue) {
      this.update = true;
    }
  }

}

export interface DialogPosition {
  /** Override for the dialog's top position. */
  top?: '50%';

  /** Override for the dialog's bottom position. */
  bottom?: '50%';

  /** Override for the dialog's left position. */
  // left?: string;

  /** Override for the dialog's right position. */
  // right?: string;
}

