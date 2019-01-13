import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { CurrenciesService} from '../services/currencies.service';



@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
	isChartShowed: boolean = false;

  constructor(private currenciesService: CurrenciesService) { 
  	this.currenciesService.onToggleChart.subscribe( event => this.isChartShowed = event);
  }

  ngOnInit() {
  }

  isCurrenciesVisited(): boolean {
	return !!localStorage['currenciesVisited'];
  }

  disableArrowHint(){
  	localStorage.setItem('currenciesVisited','true');
  	
  }

}
