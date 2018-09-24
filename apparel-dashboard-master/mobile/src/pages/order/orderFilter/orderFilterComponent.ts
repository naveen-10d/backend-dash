import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-orderFilter',
  templateUrl: 'orderFilter.html',
  
})

export class OrderFilterComponent implements OnInit {

  constructor( private menu: MenuController , public navCtrl: NavController ) {
  }

  ngOnInit(): void {
    
  }
}