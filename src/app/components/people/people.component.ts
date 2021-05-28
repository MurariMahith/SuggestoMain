import { combineAll, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import * as moment from 'moment';
import { MovieListService } from 'src/app/services/movie-list.service';
import { MovieList } from 'src/app/models/MovieList';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { DisplayListService } from 'src/app/services/display-list.service';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';
import { Router,ActivatedRoute } from '@angular/router';
import { $ } from 'protractor';
import { HomePageLists } from 'src/app/models/HomePageLists';
import { HomePageListsService } from 'src/app/services/home-page-lists.service';
import _ from 'lodash'
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { Genre } from 'src/app/models/Genre';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/app/services/customerService';
import { Customer } from 'src/app/models/Customer';
import { RatedMovies } from 'src/app/models/Customer Related/RatedMovies';
import { concat } from 'rxjs';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  currentCustomer : Customer;

  allCustomers : Customer[] = [];

  allCustomersWithoutCurrentCustomer : Customer[] = [];

  allCustomersScoreSorted : Customer[] = [];

  loggedIn : boolean = false;

  isMobile : boolean = false;

  loading : boolean = true;

  myWCount : number = 0;

  share : boolean = true;

  leaderbool : boolean = true;
  wishbool : boolean = false;

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    private customerService : CustomerService) { }


  checkInBetween(num1,subject,num2)
  {
    if(num1<=subject && subject<=num2)
    {
      return true;
    }
    else
      return false;    
  }

  ngOnInit(): void {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }
    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            this.allCustomers = o;
            this.allCustomers.sort((a,b) => {
              if(a.wishlistedMovies && b.wishlistedMovies)
              {
                return b.wishlistedMovies.length - a.wishlistedMovies.length;
              } 
            })
            this.allCustomers.forEach(element => {
              if(!element.watchedMovies)
              {
                element.watchedMovies = [];
              }
            });

            

            //console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loggedIn = true
              this.loading = false;
              this.share = this.currentCustomer.shareWishlistedMovies;
              console.log(this.allCustomers)
              this.allCustomers.forEach(element => {


                //removing duplicates from wishlisted movies of other customers
                let chars = element.wishlistedMovies;
                let uniqueChars;
                if(chars)
                {
                  uniqueChars = chars.filter((c, index) => {
                    return chars.indexOf(c) === index;
                  });
                }

                element.wishlistedMovies = uniqueChars;

                if(element.name == null || element.name == '')
                  element.name = 'Not Provided';
                if(element.customerPhotoUrl == null || element.customerPhotoUrl == '')
                  element.customerPhotoUrl = '../../../assets/images/defaultuser.png'
              });


              //remove current customer from customer list
              // for( var i = 0; i < this.allCustomers.length; i++)
              // {     
              //   if (this.allCustomers[i].uid == this.currentCustomer.uid) 
              //   {   
              //     this.allCustomers.splice(i, 1); 
              //     break;
              //   }
              // }

              if(this.currentCustomer.customerPhotoUrl === null || this.currentCustomer.customerPhotoUrl === '' || this.currentCustomer.customerPhotoUrl === '../../../assets/images/defaultuser.png')
              {
                this.currentCustomer.customerPhotoUrl = '../../../assets/images/logo.jpg'
              }
              if(this.currentCustomer.wishlistedMovies)
              {
                this.myWCount = this.currentCustomer.wishlistedMovies.length;
              }              
              this.allCustomersWithoutCurrentCustomer = this.allCustomers
              this.allCustomers = this.allCustomers.filter(x => x.shareWishlistedMovies)
              console.log(this.allCustomers);
            }

            var customersWhoEnabledSharing = this.allCustomersWithoutCurrentCustomer;
            customersWhoEnabledSharing.forEach(element => {


              //edit below when something goes wrong in 

              if(!element.shareWishlistedMovies && element.uid != this.currentCustomer.uid)
              {
                element.name = "Name Hidden";
                element.customerPhotoUrl = "../../../assets/images/defaultuser.png"
              }
              if(!element.watchedMovies || element.watchedMovies == undefined)
              {
                element.watchedMovies = []
              }
              if(!element.wishlistedMovies || element.wishlistedMovies == undefined)
              {
                element.wishlistedMovies = []
              }
              if(!element.ratedMovies || element.ratedMovies == undefined)
              {
                element.ratedMovies = [];
              }
            });

            this.allCustomersScoreSorted = customersWhoEnabledSharing.sort((a,b) => {
                return (b.watchedMovies.length + b.wishlistedMovies.length + b.ratedMovies.length) - (a.watchedMovies.length + a.wishlistedMovies.length + a.ratedMovies.length);             
            })
            // this.allCustomersScoreSorted.forEach(element => {
            //   console.log(element.name + element.watchedMovies.length + element.wishlistedMovies.length + element.ratedMovies.length)
            // });
            // console.log(this.allCustomers);
          })
    }
  }

  goto(key)
  {
    //we will navigate to mail-list component with customer key as parameter
    this.router.navigateByUrl('/wlist/'+key)
  }

  UpdateCustomerWhenSharingEvent()
  {
    console.log(this.share);
    this.currentCustomer.shareWishlistedMovies = this.share;
    console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
  }

  wishSelect()
  {
    this.leaderbool = false;
    this.wishbool = true;
  }
  leaderSelect()
  {
    this.leaderbool = true
    this.wishbool = false;
  }

}
