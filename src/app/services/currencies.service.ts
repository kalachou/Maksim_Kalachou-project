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
    onToggleFavorite: EventEmitter<number> = new EventEmitter();

	private currentDate = new Date(Date.now());
	private year = this.currentDate.getFullYear();
	private month = this.currentDate.getMonth();
	private date = this.currentDate.getDate();

    constructor(private http: HttpClient) { }

    public toggleFavorite() {

        let propertyString = this.selectedCurrencyID.toString();
        let unseenFavoritesList: Array<number> = localStorage['unseenFavoritesList'] 
        ? JSON.parse(localStorage['unseenFavoritesList']) 
        : [];

    	if(localStorage.hasOwnProperty(propertyString)) {
      		localStorage.removeItem(propertyString);
      		if (unseenFavoritesList.indexOf(this.selectedCurrencyID) > -1) {
      			unseenFavoritesList = unseenFavoritesList.filter(x=>x!==this.selectedCurrencyID);
      			localStorage.setItem('unseenFavoritesList', JSON.stringify(unseenFavoritesList));
      			localStorage.setItem('newItems', (Number(localStorage["newItems"]||1)-1).toString());
      		}
    	} else {
    		unseenFavoritesList.push(this.selectedCurrencyID);
      		localStorage.setItem(propertyString, this.selectedCurrencyAbbreviation);
      		localStorage.setItem('unseenFavoritesList', JSON.stringify(unseenFavoritesList));
      		localStorage.setItem('newItems', (Number(localStorage["newItems"]||0)+1).toString());
    	}
    	this.onToggleFavorite.emit(unseenFavoritesList.length);
    }

    public cleanUnseenFavorites() {
    	localStorage.removeItem('newItems');
    	localStorage.removeItem('unseenFavoritesList');
    	this.onToggleFavorite.emit(0);
    }

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

