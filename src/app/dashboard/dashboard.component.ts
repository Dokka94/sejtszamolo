import { Component, OnInit } from '@angular/core';
import { ImageToAppService } from '../image-to-app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (localStorage.length>0) {
      localStorage.clear();
      window.location.reload();
    }

  }
}