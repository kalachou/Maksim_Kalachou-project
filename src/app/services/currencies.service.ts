import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {EventEmitter} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

	private selectedCurrencyID = 145;
	private selectedCurrencyAbbreviation = 'USD';
    onSelectCurrency: EventEmitter<Array<any>> = new EventEmitter();

	private currentDate = new Date(Date.now());
	private year = this.currentDate.getFullYear();
	private month = this.currentDate.getMonth();
	private date = this.currentDate.getDate();

    constructor(private http: HttpClient) { }

    public selectCurrency(id, abbreviation) {
	    this.selectedCurrencyID = id;
	    this.selectedCurrencyAbbreviation = abbreviation;
	    this.onSelectCurrency.emit([this.selectedCurrencyID, this.selectedCurrencyAbbreviation]);
  	}

    getCurrentDailyRates() {
	    const previousDate = new Date(this.year, this.month, this.date - 1);
	    const result = forkJoin(
	        this.http.get('http://www.nbrb.by/API/ExRates/Rates?Periodicity=0'),
	        this.http.get(`http://www.nbrb.by/API/ExRates/Rates?onDate=${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}&Periodicity=0`)
	        );
	    return result;
    }

    getCurrentMonthlyRates() {
	    const previousDate = new Date(this.year, this.month - 1, 1);
	    const result = forkJoin(
	        this.http.get('http://www.nbrb.by/API/ExRates/Rates?Periodicity=1'),
	        this.http.get(`http://www.nbrb.by/API/ExRates/Rates?onDate=${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}&Periodicity=1`)
	        );
	    return result;
    }

}

