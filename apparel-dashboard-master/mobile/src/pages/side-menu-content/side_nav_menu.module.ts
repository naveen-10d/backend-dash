import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuContentComponent } from './side-menu-content.component';
import { AvatarModule } from 'ngx-avatar';


@NgModule({
  imports: [
    CommonModule,
    AvatarModule
  ],
  declarations: [ 
    SideMenuContentComponent
  ],
  exports: [ SideMenuContentComponent ] 
})
export class SidenavModule { }
