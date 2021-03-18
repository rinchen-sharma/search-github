import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/store.reducer';
import { GridComponent } from './grid/grid.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    // tslint:disable-next-line: object-literal-shorthand
    StoreModule.forRoot({ appReducer: appReducer }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx App'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
