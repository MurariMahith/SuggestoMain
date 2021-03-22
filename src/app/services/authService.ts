import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from "firebase/app";
import { first } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  loggedIn : boolean = false;

  constructor(@Inject(AngularFireAuth) private afAuth :AngularFireAuth) {  }

  Signup(email:string,password:string)
  {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password)
  }
  logIn(email:string,password:string)
  {
      console.log(email);
    console.log(firebase.auth().currentUser);
    return this.afAuth.auth.signInWithEmailAndPassword(email,password)   
  }
  logOut()
  {
    this.afAuth.auth.signOut()
        .then(a =>
            {
                localStorage.setItem("loggedIn","false");
                localStorage.removeItem("uid");
                window.location.href = "/home"
            })
  }
  getAuthState() :any
  {
    // return firebase.auth().currentUser;
    return this.loggedIn;
  }
  setAuthState()
  {
      this.loggedIn = true;
  }
  resetAuthState()
  {
      this.loggedIn = false;
  }

}