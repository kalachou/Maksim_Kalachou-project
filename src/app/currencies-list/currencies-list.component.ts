import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { CurrenciesService } from '../services/currencies.service';
import { CurrencyRate } from '../classes/currency-rate';

@Component({
  selector: 'app-currencies-list',
  templateUrl: './currencies-list.component.html',
  styleUrls: ['./currencies-list.component.css']
})

export class CurrenciesListComponent implements OnInit {
  selectedCurrencyID = 145;
  selectedCurrencyName = 'USD';

  showPreloader = true;
  chartIsShowed = false;
  abbreviation;

  dailyRates: any;
  previousDailyRates: any;
  monthlyRates: any;
  previousMonthlyRates: any;

  filteredDailyRates: any;
  filteredMonthlyRates: any;

  constructor(private currenciesService: CurrenciesService) {
    this.currenciesService.onToggleChart.subscribe(x => this.chartIsShowed = x);
  }

  dropDailyRate(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filteredDailyRates, event.previousIndex, event.currentIndex);
  }

  dropMonthlyRate(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filteredMonthlyRates, event.previousIndex, event.currentIndex);
  }

  selectCurrency(id: number, abbr: string, name: string): void {
    this.chartIsShowed = true;
    this.selectedCurrencyName = abbr;
    this.currenciesService.selectCurrency(id, abbr, name);
  }

  assignCopyDailyRates(): void {
    this.filteredDailyRates = Object.assign([], this.dailyRates);
  }

  assignCopyMonthlyRates(): void {
    this.filteredMonthlyRates = Object.assign([], this.monthlyRates);
  }

  assignCopy(): void {
    this.assignCopyDailyRates();
    this.assignCopyMonthlyRates();
  }

  ngOnInit() {
    this.currenciesService.getCurrentDailyRates().subscribe(data => {
      this.dailyRates = data[0];
      this.previousDailyRates = data[1];
      const currenciesInfo: any = data[2];
      this.dailyRates.forEach((item, index) => {
        const difference = (item.Cur_OfficialRate - this.previousDailyRates[index].Cur_OfficialRate).toFixed(4);
        let differenceString;
        if (+difference >= 0) {
          differenceString = '+' + difference;
        } else {
          differenceString = difference.toString();
        }
        item.Difference = differenceString;

        item.Cur_Name_Eng = currenciesInfo.find(x => x['Cur_ID'] === item.Cur_ID)['Cur_Name_Eng'];
      });
      this.assignCopyDailyRates();
    });

    this.currenciesService.getCurrentMonthlyRates().subscribe(data => {
      this.monthlyRates = data[0];
      this.previousMonthlyRates = data[1];
      const currenciesInfo: any = data[2];
      this.monthlyRates.forEach((item, index) => {
        const difference: number = +(item.Cur_OfficialRate - this.previousMonthlyRates[index].Cur_OfficialRate).toFixed(4);
        let differenceString;
        if (difference >= 0) {
          differenceString = '+' + difference;
        } else {
          differenceString = difference.toString();
        }
        item.Difference = differenceString;

        item.Cur_Name_Eng = currenciesInfo.find(x => x['Cur_ID'] === item.Cur_ID)['Cur_Name_Eng'];
      });
      this.assignCopyMonthlyRates();
      this.showPreloader = false;
    });
  }

  filterList(value) {
    // when nothing has typed
    if (!value) {
      this.assignCopy();
    } else {
      this.filteredDailyRates = Object.assign([], this.dailyRates).filter(
        item => item.Cur_Abbreviation.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      this.filteredMonthlyRates = Object.assign([], this.monthlyRates).filter(
        item => item.Cur_Abbreviation.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    }
  }

  disableHint() {
    if (!localStorage['currenciesVisited']) {
      localStorage.setItem('currenciesVisited', 'true');
    }
  }

}
