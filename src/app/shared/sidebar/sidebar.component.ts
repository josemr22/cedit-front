import { Component, OnInit } from '@angular/core';
import { ItemMenu } from '../../auth/interfaces/AuthenticateResponse.interface';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  get menu(): ItemMenu[] {
    return this.authService.getMenu();
  }

}
