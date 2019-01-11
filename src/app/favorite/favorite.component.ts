import { Component, OnInit } from '@angular/core';
import { CurrenciesService} from '../services/currencies.service';
import { CurrencyRate} from '../classes/currency-rate';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  public favoriteList: Array<Array<any>> = [];
  public showChart: boolean = false;

  constructor(private currenciesService: CurrenciesService) { }

  ngOnInit() {
	  for (let key in localStorage) { 
	  	if(isFinite(+key)) {
	  			this.favoriteList.push([key,localStorage[`${key}`]]);
	  		}
	  	}
  }

  	selectCurrency(id, abbr) {
		this.currenciesService.selectCurrency(id, abbr);
	}

  toggleChart(id, abbr) {
  	this.selectCurrency(id, abbr);
  	this.showChart = !this.showChart;
  }



}
