import { NgModule,  NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule , MatSliderModule} from '@angular/material';
import { MatFormFieldModule, MatFormFieldControl, MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupMailComponent } from './mail-notification.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { SidenavModule } from '../sidenav/sidenav.module';
import {GroupMailService} from './mail-notification.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {SuccessalertComponent} from '../successalert/successalert.component';
import {SuccessalertModule} from '../successalert/successalert.module';
import {FailurealertComponent} from '../failurealert/failurealert.component';
import {FailurealertModule} from '../failurealert/failurealert.module';
import { AuthGuard } from '../login/auth.guard';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'groupmail',
        component: GroupMailComponent,
        canActivate: [AuthGuard]
      }
    ]),
    MatChipsModule,
    MatSelectModule,
    MatSortModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    CommonModule,
    SidenavModule,
    SuccessalertModule,
    FailurealertModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    MatSlideToggleModule,
    Ng2Bs3ModalModule
  ],
  declarations: [
    GroupMailComponent
  ],
  bootstrap: [GroupMailComponent],
  providers: [GroupMailService],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class GroupMailModule { }
