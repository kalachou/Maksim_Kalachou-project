import { Component, OnInit } from '@angular/core';
import { CurrenciesService} from '../services/currencies.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

  public unseenFavorites: string = localStorage['newItems'];

  public navLinks = [
    {label: 'Currencies', path: '/currencies'},
    {label: 'Calculator', path: '/calculator'},
    {label: 'About', path: '/about'},
    {label: 'Favorite', path: '/favorite'}
  ];

  activeLink = null;

  constructor(private unseenFavoriteCounter: CurrenciesService) {

    this.unseenFavoriteCounter.onToggleFavorite.subscribe(count => {
      this.unseenFavorites = count;
    });

  }

  ngOnInit() {
  }

  clearUnseenFavorites() {
    this.unseenFavoriteCounter.cleanUnseenFavorites();
  }

  showUnseenFavorites() {
    if (!this.unseenFavorites || this.activeLink.label === 'Favorite') {
      return false;
    } else {
      return true;
    }
  }

  firstVisit() {
    localStorage.setItem('firstVisit', 'visited');
  }

}
