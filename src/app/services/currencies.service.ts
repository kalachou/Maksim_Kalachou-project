import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CurrenciesService {

  private selectedCurrencyID = 145;
  private selectedCurrencyAbbreviation = 'USD';
  private selectedCurrencyName = 'US Dollar';

  private currentDate = new Date(Date.now());
  private year = this.currentDate.getFullYear();
  private month = this.currentDate.getMonth();
  private date = this.currentDate.getDate();

  private propertyString = this.selectedCurrencyID.toString();
  private unseenFavoritesList: Array<number> = localStorage['unseenFavoritesList']
    ? JSON.parse(localStorage['unseenFavoritesList'])
    : [];

  public onSelectCurrency: EventEmitter<Array<any>> = new EventEmitter();
  public  onToggleFavorite: EventEmitter<number> = new EventEmitter();
  public  onToggleChart: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public enableShowedChartCurrencyMark() {
    this.onToggleChart.emit(true);
  }

  public getSelectedCurrency(): Array<any> {
    return [this.selectedCurrencyID, this.selectedCurrencyAbbreviation, this.selectedCurrencyName];
  }

  public removeFavorite(currency: Array<any>) {
    localStorage.removeItem(currency[0]);
    if (this.unseenFavoritesList.indexOf(currency[0]) > -1) {
      this.unseenFavoritesList = this.unseenFavoritesList.filter(x => x[0] !== currency[0]);
      localStorage.setItem('unseenFavoritesList', JSON.stringify(this.unseenFavoritesList));
      localStorage.setItem('newItems', (Number(localStorage['newItems'] || 1) - 1).toString());
    }
  }

  public addFavorite() {
    this.unseenFavoritesList.push(this.selectedCurrencyID);
    localStorage.setItem(this.selectedCurrencyID.toString(), this.selectedCurrencyAbbreviation);
    localStorage.setItem('unseenFavoritesList', JSON.stringify(this.unseenFavoritesList));
    localStorage.setItem('newItems', (Number(localStorage['newItems'] || 0) + 1).toString());
  }

  public toggleFavorite() {
    if (localStorage.hasOwnProperty(this.selectedCurrencyID.toString())) {
      const currencyToDelete = [this.selectedCurrencyID, this.selectedCurrencyAbbreviation];
      this.removeFavorite(currencyToDelete);
    } else {
      this.addFavorite();
    }
    this.onToggleFavorite.emit(Number(localStorage['newItems'] || 0));
  }

  public cleanUnseenFavorites() {
    this.unseenFavoritesList.length = 0;
    localStorage.removeItem('newItems');
    localStorage.removeItem('unseenFavoritesList');
    this.onToggleFavorite.emit(0);
  }

  public selectCurrency(id: number, abbreviation: string, name: string) {
    this.selectedCurrencyID = id;
    this.selectedCurrencyAbbreviation = abbreviation;
    this.selectedCurrencyName = name;
    this.onSelectCurrency.emit([this.selectedCurrencyID, this.selectedCurrencyAbbreviation, this.selectedCurrencyName]);
  }

  getCurrentDailyRates() {
    const previousDate = new Date(this.year, this.month, this.date - 1);
    const result = forkJoin(
      this.http.get('https://www.nbrb.by/API/ExRates/Rates?Periodicity=0'),
      this.http.get(`https://www.nbrb.by/API/ExRates/Rates?onDate=${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}&Periodicity=0`),
      this.http.get('https://www.nbrb.by/API/ExRates/Currencies')
    );
    return result;
  }

  getCurrentMonthlyRates() {
    const previousDate = new Date(this.year, this.month - 1, 1);
    const result = forkJoin(
      this.http.get('https://www.nbrb.by/API/ExRates/Rates?Periodicity=1'),
      this.http.get(`https://www.nbrb.by/API/ExRates/Rates?onDate=${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}&Periodicity=1`),
      this.http.get('https://www.nbrb.by/API/ExRates/Currencies')
    );
    return result;
  }

}
