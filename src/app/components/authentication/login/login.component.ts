import { Component, OnInit } from '@angular/core';
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "angularfire2/auth";
import { User } from  'firebase';
import { AuthService } from './../../../services/authService';
import { Customer } from 'src/app/models/Customer';
import { CustomerService } from 'src/app/services/customerService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user : User;

  email : string = '';
  password : string = '';

  customer : Customer = new Customer();

  dbCust : boolean = false;

  loginLoad : boolean = false;

  constructor(private  authService : AuthService,private afAuth : AngularFireAuth,private customerService : CustomerService) { }

  ngOnInit(): void {
  }

  submit()
  {
    console.log(this.email);
    console.log(this.password);
    this.loginLoad = true;
    this.loginTheUser();
  }

  async  loginWithGoogle(){
    this.loginLoad = true;
    await  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(a => 
        {
          this.user = a.user;
          this.buildCustomer();
          localStorage.setItem("loggedIn","true");
          localStorage.setItem("uid",this.user.uid);
          this.email = '';
          this.password = '';
        });    
  }

  async  loginWithFacebook(){
    this.loginLoad = true;
    await  this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(a => 
        {
          this.user = a.user;
          this.buildCustomer();
          localStorage.setItem("loggedIn","true");
          localStorage.setItem("uid",this.user.uid);
          this.email = '';
          this.password = '';
          console.log(a)
        });    
  }

  async loginWithGithub()
  {
    this.loginLoad = true;
    await  this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider())
      .then(a => 
        {
          this.user = a.user;
          this.buildCustomer();
          localStorage.setItem("loggedIn","true");
          localStorage.setItem("uid",this.user.uid);
          this.email = '';
          this.password = '';
          console.log(a)
        })
      .catch(e =>
        {
          console.log(e);
          alert(e['message']+" Email address used to login : "+e['email']);
          this.loginLoad = false;
        })
  }

  async loginTheUser()
  {
    this.authService.logIn(this.email,this.password)
    .then(a => 
        {
          this.user = a.user;
          this.buildCustomer();
          localStorage.setItem("loggedIn","true");
          localStorage.setItem("uid",this.user.uid);
          this.email = '';
          this.password = '';
        })
  }

  buildCustomer()
  {
    //alert("please wait while we log you In, We will redirect you to home page once login is successfull. Thank you !")
    this.customer.uid = this.user.uid;
    this.customer.name = this.user.displayName;
    this.customer.email = this.user.email;
    this.customer.emailVerified = this.user.emailVerified;
    this.customer.customerPhotoUrl = this.user.photoURL;
    this.customer.preferredGenre = [];
    this.customer.preferredLanguages = [];
    this.customer.wishlistedMovies = [];
    console.log(this.user)
    this.checkCustomer()
  }

  //this function checks if customer already exists in our db or else adds new customer to our db
  checkCustomer()
  {
    console.log(this.customerService.checkCustomerInDb(this.customer.uid).toPromise())
    this.customerService.checkCustomerInDb(this.customer.uid)
      .subscribe(o => 
        {
          console.log(o)
          if(!(o.find(x => x.uid == this.customer.uid)))
          {
            this.customerService.createCustomer(this.customer);
            //window.location.href = "/personalisation"
            this.dbCust = true;
            console.log("customer created")
          }
          else
          {
            console.log("customer already present in our db")
            window.location.href = "/home"
          }
          if(this.dbCust)
          {
            window.location.href = "/personalisation"
          }

          
        }) 
    
  }

}
