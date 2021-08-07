import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { AuthService } from 'src/app/services/authService';
import { CustomerService } from 'src/app/services/customerService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  isMobile : boolean = false;
  loggedIn: boolean = false;
  currentCustomer : Customer

  constructor(private authService : AuthService,private customerService : CustomerService,private router :Router) { }

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
        this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            ////console.log(o)
            //this.allCustomers = o;
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loggedIn = true
            }
            //console.log(this.currentCustomer.customerPhotoUrl)
            ////console.log(this.loggedIn)
          })
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

  goto(str)
  {
    this.router.navigateByUrl(str)
    //this.router.navigateByUrl(str);
    if(document.getElementById(str))
    {
      document.getElementById(str).classList.add("animated")
      document.getElementById(str).classList.add("tada");
      //document.getElementById(str).classList.add("tada");
    }
    setTimeout(()=>{
      document.getElementById(str).classList.remove("animated")
      document.getElementById(str).classList.remove("tada");      
    },500)
  }

}
