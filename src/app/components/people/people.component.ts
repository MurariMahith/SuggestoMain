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

  allCustomers : Customer[] = []

  loggedIn : boolean = false;

  isMobile : boolean = false;

  loading : boolean = true;

  myWCount : number = 0;

  share : boolean = true;

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
            //console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loggedIn = true
              this.loading = false;
              this.share = this.currentCustomer.shareWishlistedMovies;
              console.log(this.allCustomers)
              this.allCustomers.forEach(element => {

                let chars = element.wishlistedMovies
                let uniqueChars = chars.filter((c, index) => {
                    return chars.indexOf(c) === index;
                });
                element.wishlistedMovies = uniqueChars;

                if(element.name == null || element.name == '')
                  element.name = 'Not Provided';
                if(element.customerPhotoUrl == null || element.customerPhotoUrl == '')
                  element.customerPhotoUrl = '../../../assets/images/defaultuser.png'
              });


              //remove current customer from customer list
              for( var i = 0; i < this.allCustomers.length; i++)
              {     
                if (this.allCustomers[i].uid == this.currentCustomer.uid) 
                {   
                  this.allCustomers.splice(i, 1); 
                  break;
                }
              }

              if(this.currentCustomer.customerPhotoUrl === null || this.currentCustomer.customerPhotoUrl === '' || this.currentCustomer.customerPhotoUrl === '../../../assets/images/defaultuser.png')
              {
                this.currentCustomer.customerPhotoUrl = '../../../assets/images/logo.jpg'
              }
              this.myWCount = this.currentCustomer.wishlistedMovies.length;
            }
          })
    }
  }

  goto(key)
  {
    //we will navigate to mail-list component with customer key as parameter
    this.router.navigateByUrl('/wlist/'+key)
  }

}
