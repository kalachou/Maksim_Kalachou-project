import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  public navLinks = [
    {label: 'Currencies', path: '/currencies'},
    {label: 'Calculator', path: '/calculator'},
    {label: 'About', path: '/about'},
    {label: 'Favorite', path: '/favorite'}
  ];
  activeLink = this.navLinks[0];
  ngOnInit() {
  }

}
