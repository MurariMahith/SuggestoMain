import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// import { AuthService } from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor( public router: Router) {}
  
  canActivate(): boolean {

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
        
    }
    else
    {
        this.router.navigateByUrl('/login')
        console.log(localStorage.getItem("loggedIn"))
        alert("You should be logged In to see personalised Movies just for you")
        return false;
    }
    return true;
  }
}