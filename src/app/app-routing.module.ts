import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AboutComponent } from './about/about.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChartComponent } from './chart/chart.component';

const currencyRoutes: Routes = [
    { path: 'chart', component: ChartComponent}
];

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'currencies', component: CurrenciesComponent, children: currencyRoutes},
  { path: 'calculator', component: CalculatorComponent},
  { path: 'about', component: AboutComponent},
  { path: 'favorite', component: FavoriteComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
