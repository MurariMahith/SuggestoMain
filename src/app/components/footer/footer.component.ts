import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  isMobile : boolean = false;
  loggedIn: boolean = false;

  constructor(private authService : AuthService) { }

  ngOnInit() {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }

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
    if(confirm("You want to log out from Suggesto?"))
    {
      this.authService.logOut();
    }
    
  }

}
