import { Component, OnInit } from '@angular/core';
import { DashboardDataResponse } from '../interfaces/dashboard-data-response.interface';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  data!: DashboardDataResponse;

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.getDashboardData().subscribe(d => this.data = d);
  }

}
