import { Component, OnInit } from '@angular/core';
import { CurrenciesService} from '../services/currencies.service';
import { CurrencyRate} from '../classes/currency-rate';

@Component({
  selector: 'app-currencies-list',
  templateUrl: './currencies-list.component.html',
  styleUrls: ['./currencies-list.component.css']
})

export class CurrenciesListComponent implements OnInit {
	selectedCurrencyID = 145;
	selectedCurrencyName = 'USD';

  showPreloader = true;
  abbreviation;

  dailyRates: any;
  previousDailyRates: any;
  monthlyRates: any;
  previousMonthlyRates: any;

  filteredDailyRates: any;
  filteredMonthlyRates: any;

  constructor(private currenciesService: CurrenciesService) {}

	selectCurrency(id, abbr) {
		this.currenciesService.selectCurrency(id, abbr);
	}

 	assignCopyDailyRates() {
	   this.filteredDailyRates = Object.assign([], this.dailyRates);
	}

   	assignCopyMonthlyRates() {
	   this.filteredMonthlyRates = Object.assign([], this.monthlyRates);
	}

	assignCopy() {
		this.assignCopyDailyRates();
		this.assignCopyMonthlyRates();
	}

  ngOnInit() {
	  this.currenciesService.getCurrentDailyRates().subscribe(data => {
		  this.dailyRates = data[0];
		  this.previousDailyRates = data[1];
		  this.dailyRates.forEach((item, index) => {
		  	const difference = (item.Cur_OfficialRate - this.previousDailyRates[index].Cur_OfficialRate).toFixed(4);
		  	let differenceString;
		  	if (+difference >= 0) {
		  		differenceString = '+' + difference;
		  	} else {
		  		differenceString = difference.toString();
		  	}
		  	item.Difference = differenceString;
		  });
		  this.assignCopyDailyRates();
	  });

	  this.currenciesService.getCurrentMonthlyRates().subscribe(data => {
		  this.monthlyRates = data[0];
		  this.previousMonthlyRates = data[1];
		  this.monthlyRates.forEach((item, index) => {
		  	const difference: number = +(item.Cur_OfficialRate - this.previousMonthlyRates[index].Cur_OfficialRate).toFixed(4);
		  	let differenceString;
		  	if (difference >= 0) {
		  		differenceString = '+' + difference;
		  	} else {
		  		differenceString = difference.toString();
		  	}
		  	item.Difference = differenceString;
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

}
