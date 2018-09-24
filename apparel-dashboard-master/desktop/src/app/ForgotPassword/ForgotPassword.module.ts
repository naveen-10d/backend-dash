import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordService } from './ForgotPassword.service';
import { ForgotPasswordComponent } from './ForgotPassword.component';

import { AuthGuard } from '../login/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: 'Forgotpassword',
            component: ForgotPasswordComponent,

        }]),
        FormsModule,
        BrowserModule,

    ],
    declarations: [
        ForgotPasswordComponent
    ],
    providers: [ForgotPasswordService ]
})
export class ForgotPasswordModule {
}
