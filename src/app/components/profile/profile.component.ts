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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentCustomer : Customer;

  allCustomers : Customer[] = [];

  allMovies : FMovie[] = [];

  wishlistedMovies : FMovie[] = [];
  ratedMovies : FMovie[] = [];

  wishlistedMoviesDisplay : DisplayMovie[] = [];
  ratedMoviesDisplay : DisplayMovie[] = [];

  loggedIn : boolean = false;

  isMobile : boolean = false;

  genres : string = '';
  languages : string = '';

  wcount : number = 0;
  rcount : number = 0;

  share : boolean = true;

  ratebool : boolean = false;
  wishbool : boolean = true;

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

    ngOnInit() {

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
                console.log(this.currentCustomer)
              }
              this.genres = this.currentCustomer.preferredGenre.join(",")
              this.languages = this.currentCustomer.preferredLanguages.join(",")
            })
      }
  
  
      //getting all movies
      this.movieService.getAllMovies().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o =>
        {
          this.allMovies = o;
          this.allMovies.forEach(element => {
            if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.includes(element.key))
            {
              this.wishlistedMovies.push(element)
            }
            this.currentCustomer.ratedMovies.forEach(x => {
              if(element.key === x.movieId)
              {
                this.ratedMovies.push(element)
              }
            });
          });
          this.wishlistedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.wishlistedMovies)
          this.ratedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.ratedMovies)
          // console.log(this.wishlistedMoviesDisplay)
          // console.log(this.ratedMoviesDisplay)
          this.ratedMoviesDisplay.forEach(x => {
            this.currentCustomer.ratedMovies.forEach(y => {
              
              if(x.key === y.movieId)
              {
                x.rating = y.rating;
              }            
            });
          });
          this.wcount = this.wishlistedMoviesDisplay.length;
          this.rcount = this.ratedMoviesDisplay.length;
          this.share = this.currentCustomer.shareWishlistedMovies;
          console.log(this.wishlistedMoviesDisplay)
          console.log(this.ratedMoviesDisplay)
        })
  
        console.log(this.wishlistedMoviesDisplay)
        console.log(this.ratedMoviesDisplay)
  
    }


  goto(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  wishSelect()
  {
    this.ratebool = false;
    this.wishbool = true;
  }
  rateSelect()
  {
    this.ratebool = true;
    this.wishbool = false;
  }

  logout()
  {
    this.authService.logOut();
  }

}
