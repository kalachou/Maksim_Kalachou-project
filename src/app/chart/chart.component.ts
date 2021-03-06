import { Input, Component, OnInit, NgModule } from '@angular/core';
import { Chart } from 'chart.js';
import { CurrenciesService } from '../services/currencies.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {

  private selectedCurrencyID: number;
  private selectedCurrencyName: string;
  private selectedCurrencyFullName: string;
  private currentDate: Date = new Date();
  public finishDate: Date = new Date();
  public startDate: Date = new Date(this.currentDate.setDate(this.currentDate.getDate() - 30));

  ctx;
  myChart;

  constructor(private share: CurrenciesService) {
    this.selectedCurrencyID = this.share.getSelectedCurrency()[0];
    this.selectedCurrencyName = this.share.getSelectedCurrency()[1];
    this.selectedCurrencyFullName = this.share.getSelectedCurrency()[2];
    this.updateCurrency();
    this.share.onSelectCurrency.subscribe(id => {
      this.selectedCurrencyName = id[1];
      this.selectedCurrencyID = id[0];
      this.selectedCurrencyFullName = this.share.getSelectedCurrency()[2];
      this.updateCurrency();
    });
  }

  ngOnInit() {
    this.share.enableShowedChartCurrencyMark();

    this.ctx = document.querySelector('#myChart');
    this.ctx.getContext('2d');

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

    // this.updateCurrency();
  }

  updateCurrency() {
    const finishDateString = this.finishDate.toISOString().split('T')[0];
    const startDateString = this.startDate.toISOString().split('T')[0];
    let a;

    fetch(`https://www.nbrb.by/API/ExRates/Rates/Dynamics/${this.selectedCurrencyID}?startDate=${startDateString}&endDate=${finishDateString}`)
      .then(x => x.json())
      .then(x => {
        a = x;
        const dates = a.reduce((p, x) => { p.push(x['Date'].slice(0, 10)); return p; }, []);
        const rates = a.reduce((p, x) => { p.push(x['Cur_OfficialRate']); return p; }, []);

        this.myChart['data']['labels'] = dates;
        this.myChart['data']['datasets'] = [{}];
        this.myChart['data']['datasets'][0]['label'] = `${this.selectedCurrencyName} ${this.selectedCurrencyFullName}`;
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
