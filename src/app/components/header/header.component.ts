import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn : boolean = false;
  isMobile : boolean = false;
  DomPageLoadDone : boolean = true;
  
  internetStatusOnline : boolean = false;

  constructor(private authService : AuthService) {

    this.DomPageLoadDone = false;
    this.internetStatusOnline = true;

    // document.addEventListener('DOMContentLoaded',()=>{console.log("page loaded")})
    // document.addEventListener('load',()=>{console.log("page fully loaded")})
    // document.addEventListener('unload',()=>{console.log("unloaded")});
    // if (document.readyState === 'complete') {
    //   console.log("page load 2")
    // }
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        //console.log("page load 2")
        this.DomPageLoadDone = true;
        clearInterval(stateCheck);
        // document ready
      }
    }, 100);

    let internetCheck = setInterval(() => {
      if (navigator.onLine) 
      {
        this.internetStatusOnline = true; 
      }
      else
      {
        this.internetStatusOnline = false;
      }
      //console.log(this.internetStatusOnline)
    }, 10000);

   }

  ngOnInit() {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //this.pushSubscription()
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
    this.authService.logOut();
  }

  reload()
  {
    window.location.reload();
  }

  home()
  {
    window.location.href = '/';
  }

  openSideBar() 
  {
    document.getElementById("mySidebar").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
  }
  
  closeSideBar() 
  {
    document.getElementById("mySidebar").style.width = "0";
    //document.getElementById("main").style.marginLeft= "0";
  }

}
