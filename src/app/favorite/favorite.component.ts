import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { CurrencyRate } from '../classes/currency-rate';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  public favoriteList: Array<Array<any>> = [];
  public showChart = false;
  public showedCurrencyChart: number;
  selectedCurrencyId: number;
  removable = true;
  selectable = true;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit() {
    for (const key in localStorage) {
      if (isFinite(+key)) {
        let currencyEnglishName;
        fetch(`https://www.nbrb.by/API/ExRates/Currencies/${key}`)
          .then(x => x.json())
          .then(data => {
            currencyEnglishName = data['Cur_Name_Eng'];
            this.favoriteList.push([key, localStorage[`${key}`], currencyEnglishName]);
          });

      }
    }
  }

  selectCurrency(id: number, abbr: string, name: string) {
    this.selectedCurrencyId = id;
    this.currenciesService.selectCurrency(id, abbr, name);
  }

  toggleChart(id: number, abbr: string, name: string) {

    if (this.showedCurrencyChart === id) {
      this.showChart = !this.showChart;
      this.showedCurrencyChart = null;
    } else {
      this.selectCurrency(id, abbr, name);
      this.showChart = true;
      this.showedCurrencyChart = id;
    }
  }

  removeFavorite(currency) {
    this.favoriteList = this.favoriteList.filter(x => x[0] !== currency[0]);
    this.currenciesService.removeFavorite(currency);
  }

  dropFavorite(event: CdkDragDrop<string[]>) {
    this.removeFavorite(event.previousContainer.data[event.previousIndex]);
  }

}
