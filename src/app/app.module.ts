import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginserviceService } from './services/loginservice.service';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import { FaqComponent } from './faq/faq.component';
import { TodaysdetailComponent } from './todaysdetail/todaysdetail.component';

@NgModule({
  declarations: [
    AppComponent, 
    routingComponents, FaqComponent, TodaysdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [LoginserviceService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
