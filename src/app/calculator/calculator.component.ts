import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { CurrencyRate } from '../classes/currency-rate';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  providers: [CurrenciesService]
})

export class CalculatorComponent implements OnInit {

  // why dailyRates: Array<CurrencyRate> = []; isn't working????
  dailyRates: any = [];
  monthlyRates: any = [];
  rates: any = [];

  initialValue: number;
  initialCurrency: number;
  targetCurrency: number;
  targetValue = 0;

  constructor(private currenciesService: CurrenciesService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.currenciesService.getCurrentDailyRates().subscribe(data => {
      this.dailyRates = data[0];
    });

    this.currenciesService.getCurrentMonthlyRates().subscribe(data => {
      this.monthlyRates = data[0];
    });
  }

  calculate() {
    this.rates = this.dailyRates.concat(this.monthlyRates);
    const initialCurrencyRate = this.rates.find(x => x.Cur_Abbreviation === this.initialCurrency);
    const targetCurrencyRate = this.rates.find(x => x.Cur_Abbreviation === this.targetCurrency);
    this.targetValue = +(this.initialValue
      * initialCurrencyRate.Cur_OfficialRate
      / initialCurrencyRate.Cur_Scale
      / targetCurrencyRate.Cur_OfficialRate
      * targetCurrencyRate.Cur_Scale
      ).toFixed(4);

  }

}
