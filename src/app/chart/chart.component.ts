import { Input, Component, OnInit, NgModule } from '@angular/core';
import { Chart } from 'chart.js';
import { CurrenciesService} from '../services/currencies.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

private selectedCurrencyID = 145;
private selectedCurrencyName = 'USD';
private currentDate: Date = new Date();
public finishDate: Date = new Date();
public startDate: Date = new Date(this.currentDate.setDate(this.currentDate.getDate() - 30));

    date = new FormControl(this.startDate);
  serializedDate = new FormControl(this.finishDate.toISOString().split('T')[0]);

	ctx;
	myChart;

  constructor(private share: CurrenciesService) {

  this.share.onSelectCurrency.subscribe(id => {
  this.selectedCurrencyName = id[1];
  this.selectedCurrencyID = id[0];
  this.updateCurrency(); });

  }

  ngOnInit() {
     this.ctx = document.querySelector('#myChart');
    this.myChart = new Chart(this.ctx, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: [],
        datasets: []
      },
      // Configuration options go here
      options: {}
    });
  this.updateCurrency();
}

updateCurrency() {
    const finishDateString = this.finishDate.toISOString().split('T')[0];
    const startDateString = this.startDate.toISOString().split('T')[0];
    let a;

  fetch(`http://www.nbrb.by/API/ExRates/Rates/Dynamics/${this.selectedCurrencyID}?startDate=${startDateString}&endDate=${finishDateString}`)
  .then(x => x.json())
  .then(x => {
    a = x;
    const dates = a.reduce((p, x) => {p.push(x['Date'].slice(0, 10)); return p; }, []);
    const rates = a.reduce((p, x) => {p.push(x['Cur_OfficialRate']); return p; }, []);

    this.myChart['data']['labels'] = dates;
    this.myChart['data']['datasets'] = [{}];
    this.myChart['data']['datasets'][0]['label'] = this.selectedCurrencyName;
    this.myChart['data']['datasets'][0]['data'] = rates;
    this.myChart['data']['datasets'][0]['borderColor'] = '#7b1fa2';

    this.myChart.update();
  });
}

  toggleFavorite() {
    this.share.toggleFavorite();
  }

  isFavorite() {
    return localStorage[`${this.selectedCurrencyID}`];
  }

}
