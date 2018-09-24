import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './auth.guard';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';


@NgModule({
    imports: [
        RouterModule.forChild([{
            redirectTo:'',
            path: '',
            pathMatch: 'full',
            component: LoginComponent
        }]),
        FormsModule,
        BrowserModule,
        Ng2Bs3ModalModule,

    ],
    declarations: [
        LoginComponent
    ],
    providers: [ AuthGuard, LoginService]
})
export class LoginModule {
}
