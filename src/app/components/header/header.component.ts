import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn : boolean = false;

  constructor(private authService : AuthService) { }

  ngOnInit() {

    if(!(localStorage.getItem("loggedIn") === null))
    {
      if(localStorage.getItem("loggedIn") === "true")
      {
        this.loggedIn = true;
      }
    }
  }

  logout()
  {
    this.authService.logOut();
  }

}
