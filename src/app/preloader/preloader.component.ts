import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})

export class PreloaderComponent implements OnInit {
  color = 'green';
  mode = 'indeterminate';
  value = 50;

  constructor() { }

  ngOnInit() {
  }

}
