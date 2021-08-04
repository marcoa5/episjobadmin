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
import { SnfilterPipe } from './pipe/snfilter.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './comp/login/login.component'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MachineComponent } from './comp/rigs/machine/machine.component'
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from './comp/customers/customers.component';
import { CustfilterPipe } from './pipe/custfilter.pipe';
import { ClienteComponent } from './comp/customers/cliente/cliente.component';
import { MatSelectModule } from '@angular/material/select';
import { SjlistComponent } from './comp/rigs/machine/sjlist/sjlist.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { TechniciansComponent } from './comp/technicians/technicians.component';
import { FilesComponent } from './comp/files/files.component';
import { FilefilterPipe } from './pipe/filefilter.pipe'
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavbarComponent } from './comp/util/navbar/navbar.component';
import { LabelComponent } from './comp/util/label/label.component';
import { NewcustComponent } from './comp/customers/newcust/newcust.component';
import { AddbutComponent } from './comp/util/addbut/addbut.component';
import { EditdelbutComponent } from './comp/editdelbut/editdelbut.component'
import { MatDialogModule } from '@angular/material/dialog';
import { DeldialogComponent } from './comp/util/deldialog/deldialog.component';
import { H2Component } from './comp/util/h2/h2.component';
import { AddCancelbuttonsComponent } from './comp/util/add-cancelbuttons/add-cancelbuttons.component';
import { DisbuttonPipe } from './pipe/disbutton.pipe';
import { UpddialogComponent } from './comp/util/upddialog/upddialog.component';
import { NewtechComponent } from './comp/technicians/newtech/newtech.component';
import { NewrigComponent } from './comp/newrig/newrig.component';
import { LogoutComponent } from './comp/util/logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './comp/users/users.component';
import { UserfilterPipe } from './pipe/userfilter.pipe';
import { NewuserComponent } from './comp/users/newuser/newuser.component';
import { AuthComponent } from './comp/auth/auth.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TablefilterPipe } from './pipe/tablefilter.pipe';
import { InputhrsComponent } from './comp/util/inputhrs/inputhrs.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { AuthSingleRigComponent } from './comp/rigs/machine/auth-single-rig/auth-single-rig.component';
import { RigTableComponent } from './comp/rigs/machine/rig-table/rig-table.component';
import { TopMenuComponent } from './comp/rigs/machine/top-menu/top-menu.component';
import { SegmentComponent } from './comp/newrig/segment/segment.component';
import { ResetPwdComponent } from './comp/util/reset-pwd/reset-pwd.component';
import { ReportComponent } from './comp/report/report.component';
import { SpinComponent } from './comp/util/spin/spin.component';
import { SortCustPipe } from './pipe/sort-cust.pipe';
import { VisitComponent } from './comp/visit/visit.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatBadgeModule } from '@angular/material/badge';
import { MainComponent } from './comp/visit/main/main.component'
import { MatTabsModule } from '@angular/material/tabs';
import { NewvisitComponent } from './comp/visit/newvisit/newvisit.component';
import { ComdatedialogComponent } from './comp/util/comdatedialog/comdatedialog.component'

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
    AuthSingleRigComponent,
    RigTableComponent,
    TopMenuComponent,
    SegmentComponent,
    ResetPwdComponent,
    ReportComponent,
    SpinComponent,
    SortCustPipe,
    VisitComponent,
    MainComponent,
    NewvisitComponent,
    ComdatedialogComponent,
  ],
  imports: [
    BrowserModule, FormsModule, MatSidenavModule, ReactiveFormsModule, MatTableModule,MatSelectModule, MatPaginatorModule, MatDatepickerModule, MatBadgeModule,
    AppRoutingModule, FlexLayoutModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatCheckboxModule, MatTabsModule,
    BrowserAnimationsModule,MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatDialogModule, HttpClientModule, MatNativeDateModule,
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
