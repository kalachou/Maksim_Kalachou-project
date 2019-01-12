import { BrowserModule } from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material';
import {MaterialModule} from './material/material.module';





import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CurrencySearchComponent } from './currency-search/currency-search.component';
import { CurrenciesListComponent } from './currencies-list/currencies-list.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { ChartComponent } from './chart/chart.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CurrenciesService} from './services/currencies.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CalculatorComponent,
    CurrenciesComponent,
    FavoriteComponent,
    HomeComponent,
    NotFoundComponent,
    CurrencySearchComponent,
    CurrenciesListComponent,
    PreloaderComponent,
    ChartComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [CurrenciesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
