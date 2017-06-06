import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DemoComponent, DialogContent } from './components/demo/demo.component';
import { NeatapticService } from './services/neataptic/neataptic.service';
@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    DialogContent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  entryComponents: [DialogContent],
  bootstrap: [AppComponent],
  providers: [
    NeatapticService
  ]
})
export class AppModule {}
