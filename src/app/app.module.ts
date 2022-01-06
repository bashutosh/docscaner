import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import {OpenCVConfig} from 'ngx-document-scanner';
import {NgxDocumentScannerModule} from 'ngx-document-scanner';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// set the location of the OpenCV files
const openCVConfig: OpenCVConfig = {
  openCVDirPath: '/assets/opencv'  
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    NgxDocumentScannerModule.forRoot(openCVConfig),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }