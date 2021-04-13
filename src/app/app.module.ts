import { NgModule } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput, MatInputModule } from '@angular/material/input';
import { SnfilterPipe } from './snfilter.pipe'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RigsComponent,
    SnfilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, FlexLayoutModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule,
    BrowserAnimationsModule,MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
