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

  constructor(private  authService : AuthService,private afAuth : AngularFireAuth,private customerService : CustomerService) { }

  ngOnInit(): void {
  }

  submit()
  {
    console.log(this.email);
    console.log(this.password);
    this.loginTheUser();
  }

  async  loginWithGoogle(){
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
    this.customer.uid = this.user.uid;
    this.customer.name = this.user.displayName;
    this.customer.email = this.user.email;
    this.customer.emailVerified = this.user.emailVerified;
    console.log(this.customer)
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
            console.log("customer created")
          }
          else
          {
            console.log("customer already present in our db")
          }
          window.location.href = "/personalisation"
        }) 
    
  }

}
