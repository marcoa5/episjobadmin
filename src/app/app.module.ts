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
import { NavbargComponent } from './comp/navbarg/navbarg.component';
import { MatSelectModule } from '@angular/material/select';
import { SjlistComponent } from './comp/sjlist/sjlist.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { TechniciansComponent } from './comp/technicians/technicians.component'

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
    NavbargComponent,
    SjlistComponent,
    TechniciansComponent
  ],
  imports: [
    BrowserModule, FormsModule, MatSidenavModule, ReactiveFormsModule, MatTableModule,MatSelectModule,
    AppRoutingModule, FlexLayoutModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatExpansionModule,
    BrowserAnimationsModule,MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: appearance,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
