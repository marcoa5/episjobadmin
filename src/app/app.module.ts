import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './comp/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { FlexLayoutModule } from '@angular/flex-layout';
import { RigsComponent } from './comp/rigs/rigs.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatFormFieldModule, MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { MatInput, MatInputModule } from '@angular/material/input';
import { SnfilterPipe } from './snfilter.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './comp/login/login.component'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MachineComponent } from './comp/machine/machine.component'
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from './comp/customers/customers.component';
import { CustfilterPipe } from './custfilter.pipe';
import { ClienteComponent } from './comp/cliente/cliente.component';
import { MatSelectModule } from '@angular/material/select';
import { SjlistComponent } from './comp/sjlist/sjlist.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { TechniciansComponent } from './comp/technicians/technicians.component';
import { FilesComponent } from './comp/files/files.component';
import { FilefilterPipe } from './filefilter.pipe'
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavbarComponent } from './comp/navbar/navbar.component';
import { LabelComponent } from './comp/label/label.component';
import { NewcustComponent } from './comp/newcust/newcust.component';
import { AddbutComponent } from './comp/addbut/addbut.component';
import { EditdelbutComponent } from './comp/editdelbut/editdelbut.component'
import { MatDialogModule } from '@angular/material/dialog';
import { DeldialogComponent } from './comp/dialog/deldialog/deldialog.component';
import { H2Component } from './comp/util/h2/h2.component';
import { AddCancelbuttonsComponent } from './comp/util/add-cancelbuttons/add-cancelbuttons.component';
import { DisbuttonPipe } from './pipe/disbutton.pipe';
import { UpddialogComponent } from './comp/dialog/upddialog/upddialog.component';
import { NewtechComponent } from './comp/newtech/newtech.component';
import { NewrigComponent } from './comp/newrig/newrig.component';
import { LogoutComponent } from './comp/dialog/logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './comp/users/users.component';
import { UserfilterPipe } from './pipe/userfilter.pipe';
import { NewuserComponent } from './comp/newuser/newuser.component';
import { AuthComponent } from './comp/auth/auth.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TablefilterPipe } from './tablefilter.pipe';
import { InputhrsComponent } from './comp/dialog/inputhrs/inputhrs.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'standard'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RigsComponent,
    SnfilterPipe,
    LoginComponent,
    MachineComponent,
    CustomersComponent,
    CustfilterPipe,
    ClienteComponent,
    SjlistComponent,
    TechniciansComponent,
    FilesComponent,
    FilefilterPipe,
    NavbarComponent,
    LabelComponent,
    NewcustComponent,
    AddbutComponent,
    EditdelbutComponent,
    DeldialogComponent,
    H2Component,
    AddCancelbuttonsComponent,
    DisbuttonPipe,
    UpddialogComponent,
    NewtechComponent,
    NewrigComponent,
    LogoutComponent,
    UsersComponent,
    UserfilterPipe,
    NewuserComponent,
    AuthComponent,
    TablefilterPipe,
    InputhrsComponent,
  ],
  imports: [
    BrowserModule, FormsModule, MatSidenavModule, ReactiveFormsModule, MatTableModule,MatSelectModule, MatPaginatorModule, MatDatepickerModule,
    AppRoutingModule, FlexLayoutModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatCheckboxModule,
    BrowserAnimationsModule,MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDialogModule, HttpClientModule, MatNativeDateModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: appearance,
  },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
