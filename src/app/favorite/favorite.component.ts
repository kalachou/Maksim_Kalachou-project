import { Component, OnInit } from '@angular/core';
import { CurrenciesService} from '../services/currencies.service';
import { CurrencyRate} from '../classes/currency-rate';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  public favoriteList: Array<Array<any>> = [];
  public showChart: boolean = false;
  private showedCurrencyChart: number;
  selectedCurrencyId: number;
  removable: boolean = true;
  selectable: boolean = true;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit() {
	  for (let key in localStorage) { 
	  	if(isFinite(+key)) {
	  			this.favoriteList.push([key,localStorage[`${key}`]]);
	  		}
	  	}
  }

  selectCurrency(id, abbr) {
    this.selectedCurrencyId = id;
		this.currenciesService.selectCurrency(id, abbr);
	}

  toggleChart(id, abbr) {
  	
    if (this.showedCurrencyChart === id) {
        this.showChart = !this.showChart;
        this.showedCurrencyChart = null;
    } else {
        this.selectCurrency(id, abbr);
        this.showChart = true;
        this.showedCurrencyChart = id;
    }
  }

  removeFavorite(currency) {
    this.favoriteList = this.favoriteList.filter(x=>x[0]!=currency[0]);
    this.currenciesService.removeFavorite(currency);
  }

}
