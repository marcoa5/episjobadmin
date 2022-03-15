import { NgModule, LOCALE_ID } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { SnfilterPipe } from './pipe/snfilter.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './comp/login/login.component'
import { MatSidenavModule } from '@angular/material/sidenav';
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
import { EditdelbutComponent } from './comp/util/editdelbut/editdelbut.component'
import { MatDialogModule } from '@angular/material/dialog';
import { DeldialogComponent } from './comp/util/dialog/deldialog/deldialog.component';
import { H2Component } from './comp/util/h2/h2.component';
import { AddCancelbuttonsComponent } from './comp/util/add-cancelbuttons/add-cancelbuttons.component';
import { DisbuttonPipe } from './pipe/disbutton.pipe';
import { UpddialogComponent } from './comp/util/dialog/upddialog/upddialog.component';
import { NewtechComponent } from './comp/technicians/newtech/newtech.component';
import { NewrigComponent } from './comp/rigs/newrig/newrig.component';
import { LogoutComponent } from './comp/util/logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './comp/users/users.component';
import { UserfilterPipe } from './pipe/userfilter.pipe';
import { NewuserComponent } from './comp/users/newuser/newuser.component';
import { AuthComponent } from './comp/auth/auth.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TablefilterPipe } from './pipe/tablefilter.pipe';
import { InputhrsComponent } from './comp/util/dialog/inputhrs/inputhrs.component'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { AuthSingleRigComponent } from './comp/rigs/machine/auth-single-rig/auth-single-rig.component';
import { RigTableComponent } from './comp/rigs/machine/rig-table/rig-table.component';
import { TopMenuComponent } from './comp/rigs/machine/top-menu/top-menu.component';
import { SegmentComponent } from './comp/rigs/newrig/segment/segment.component';
import { ResetPwdComponent } from './comp/util/reset-pwd/reset-pwd.component';
import { ReportComponent } from './comp/report/report.component';
import { SpinComponent } from './comp/util/spin/spin.component';
import { SortCustPipe } from './pipe/sort-cust.pipe';
import { VisitComponent } from './comp/visit/visit.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatBadgeModule } from '@angular/material/badge';
import { ComdatedialogComponent } from './comp/util/dialog/comdatedialog/comdatedialog.component';
import { ElevationDirective } from './dir/elevation.directive';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { NewvisitcontDirective } from './dir/newvisitcont.directive';
import { NewvisitsubcontDirective } from './dir/newvisitsubcont.directive';
import { NewvisitfieldDirective } from './dir/newvisitfield.directive';
import { NewvisitspacerDirective } from './dir/newvisitspacer.directive';
import { NewvisiticoDirective } from './dir/newvisitico.directive';
import { SavevisitComponent } from './comp/util/dialog/savevisit/savevisit.component';
import { PotentialComponent } from './comp/customers/cliente/potential/potential.component'
import { DateconvPipe } from './pipe/dateconv.pipe';
import { NewvisitComponent } from './comp/visit/newvisit/newvisit.component';
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio'
import { MatListModule } from '@angular/material/list';
import { matSnackBarAnimations, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabFilterPipe } from './pipe/lab-filter.pipe';
import { ContactComponent } from './comp/customers/cliente/contact/contact.component';
import { ImifabiComponent } from './comp/rigs/machine/imifabi/imifabi.component';
import { CopyComponent } from './comp/util/dialog/copy/copy.component';
import { AddhrsComponent } from './comp/util/dialog/addhrs/addhrs.component';
import { ThousandsPipe } from './pipe/thousands.pipe';
import { MatSortModule } from '@angular/material/sort';
import { VisitlistComponent } from './comp/visit/visitlist/visitlist.component'
import { SaveaccountComponent } from './comp/util/dialog/saveaccount/saveaccount.component';
import { TodoComponent } from './comp/customers/cliente/todo/todo.component'
import { CalComponent } from './comp/visit/cal/cal.component';
import { VisitdetailsComponent } from './comp/util/dialog/visitdetails/visitdetails.component';
import { VisitsComponent } from './comp/customers/cliente/visits/visits.component';
import { NewcontactComponent } from './comp/util/dialog/newcontact/newcontact.component';
import { PartsComponent } from './comp/parts/parts.component';
import { NewpartsrequestComponent } from './comp/parts/newpartsrequest/newpartsrequest.component';
import { RequestlistComponent } from './comp/parts/requestlist/requestlist.component';
import { NotificationListComponent } from './comp/notification-list/notification-list.component'
import { MatChipsModule } from '@angular/material/chips';
import { ContactsComponent } from './comp/contacts/contacts.component';
import { ContactfilterPipe } from './pipe/contactfilter.pipe';
import { ListofrequestsComponent } from './comp/parts/listofrequests/listofrequests.component';
import { ImportpartsComponent } from './comp/util/dialog/importparts/importparts.component';
import { NewaddressComponent } from './comp/util/dialog/newaddress/newaddress.component';
import { SubmitvisitComponent } from './comp/util/dialog/submitvisit/submitvisit.component';
import { SjComponent } from './comp/sjhome/sj/sj.component';
import { PartsereqComponent } from './comp/rigs/machine/partsereq/partsereq.component';
import { CustomsnackComponent } from './comp/util/customsnack/customsnack.component';
import { NewdayComponent } from './comp/sjhome/sj/newday/newday.component';
import { SignComponent } from './comp/sjhome/sj/sign/sign.component'
import { SignaturePadModule } from 'angular2-signaturepad';
import { HTMLPipe } from './pipe/html.pipe';
import { RiskassComponent } from './comp/sjhome/sj/riskass/riskass.component';
import { SurveyComponent } from './comp/sjhome/sj/survey/survey.component';
import { SjhomeComponent } from './comp/sjhome/sjhome.component';
import { JobslistComponent } from './comp/sjhome/jobslist/jobslist.component';
import { SpvComponent } from './comp/sjhome/sj/newday/spv/spv.component';
import { SjemailComponent } from './comp/sjhome/sj/sjemail/sjemail.component';
import { SumenuComponent } from './comp/sjhome/sj/sumenu/sumenu.component';
import { HrssplitComponent } from './comp/sjhome/sj/hrssplit/hrssplit.component';
import { SjdialogComponent } from './comp/rigs/machine/sjlist/sjdialog/sjdialog.component';
import { PartsdialogComponent } from './comp/rigs/machine/partsereq/partsdialog/partsdialog.component';
import { SubeqComponent } from './comp/rigs/machine/subeq/subeq.component';
import { GenericComponent } from './comp/util/dialog/generic/generic.component';
import { AppupdComponent } from './comp/util/dialog/appupd/appupd.component'
import { SwupdateService } from './serv/swupdate.service';
import { SubeddialogComponent } from './comp/rigs/machine/subeq/subeddialog/subeddialog.component';
import { NewsubeqComponent } from './comp/rigs/machine/subeq/newsubeq/newsubeq.component';

export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MM YYYY',
  },
};

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
    ComdatedialogComponent,
    ElevationDirective,
    NewvisitcontDirective,
    NewvisitsubcontDirective,
    NewvisitfieldDirective,
    NewvisitspacerDirective,
    NewvisiticoDirective,
    DateconvPipe,
    NewvisitComponent,
    SavevisitComponent,
    PotentialComponent,
    LabFilterPipe,
    ContactComponent,
    ImifabiComponent,
    CopyComponent,
    AddhrsComponent,
    ThousandsPipe,
    VisitlistComponent,
    SaveaccountComponent,
    TodoComponent,
    CalComponent,
    VisitdetailsComponent,
    VisitsComponent,
    NewcontactComponent,
    PartsComponent,
    NewpartsrequestComponent,
    RequestlistComponent,
    NotificationListComponent,
    ContactsComponent,
    ContactfilterPipe,
    ListofrequestsComponent,
    ImportpartsComponent,
    NewaddressComponent,
    SubmitvisitComponent,
    SjComponent,
    PartsereqComponent,
    CustomsnackComponent,
    NewdayComponent,
    SignComponent,
    HTMLPipe,
    RiskassComponent,
    SurveyComponent,
    SjhomeComponent,
    JobslistComponent,
    SpvComponent,
    SjemailComponent,
    SumenuComponent,
    HrssplitComponent,
    SjdialogComponent,
    PartsdialogComponent,
    SubeqComponent,
    GenericComponent,
    AppupdComponent,
    SubeddialogComponent,
    NewsubeqComponent,
  ],
  imports: [
    BrowserModule, FormsModule, MatSidenavModule, MatSortModule, ReactiveFormsModule, MatTableModule,MatSelectModule, MatPaginatorModule, MatDatepickerModule, MatBadgeModule, MatListModule, MatTooltipModule,
    AppRoutingModule, FlexLayoutModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatCheckboxModule, MatStepperModule, MatRadioModule, MatChipsModule,
    BrowserAnimationsModule,MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatAutocompleteModule, MatDialogModule, HttpClientModule, MatNativeDateModule, MatSnackBarModule, SignaturePadModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [SwupdateService, {
    provide: MAT_DATE_LOCALE,
    useValue: 'it',
  },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
