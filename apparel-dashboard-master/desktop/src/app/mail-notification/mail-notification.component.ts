import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupMailService } from './mail-notification.service';
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-mail-notification',
  templateUrl: './mail-notification.component.html',
  styleUrls: ['./mail-notification.component.css']
})
export class GroupMailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addmail')
  AddMailModel: ModalComponent;

  @ViewChild('updatemail')
  UpdateMailModel: ModalComponent;

  // sliderValue(arg0: any, arg1: any): any {
  //   throw new Error("Method not implemented.");
  // }
  displayedColumns = ['Id','Mail','Actions'];
  dataSource: any = [];

  constructor(private groupMailService: GroupMailService,private spinnerService: Ng4LoadingSpinnerService, private dailog: MatDialog) { }

  data={label:"groupmail",mail:"",status:true}
  
  ngOnInit() {
    this.spinnerService.show();
    this.getAllMail();
  }

  getAllMail(){
    this.groupMailService.getAllMail().subscribe(
      data => {
        this.spinnerService.hide();
        if(data!=="There is no Mail"){
        this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{this.dataSource=[]}
      },
      error => {
        console.log('something went wrong');
      }
    )
  }

  openMail() {
    this.data.mail = '';
    this.AddMailModel.open();
  }

  addMail(){
    this.groupMailService.saveMail(this.data).subscribe(
      data => {
        this.getAllMail();
        this.AddMailModel.close();
      },
      error => {
        console.log('something went wrong');
      }
    )
  }

  openupdateMail(data){
   this.data=data
   this.UpdateMailModel.open();
  }

  updateMail(){

    this.groupMailService.updateMail(this.data).subscribe(
      data => {
        console.log('success!');
        this.getAllMail();
        this.UpdateMailModel.close();
      },
      error => {
        console.log('something went wrong');
      }
    )
  }

  deleteMail(data){

    this.groupMailService.deleteMail(data).subscribe(
      data => {
        console.log('success!');
        this.getAllMail();
      },
      error => {
        console.log('something went wrong');
      }
    )
  }

  cancelMail() {
    this.AddMailModel.close();
    this.UpdateMailModel.close();
  }
  
}

 

