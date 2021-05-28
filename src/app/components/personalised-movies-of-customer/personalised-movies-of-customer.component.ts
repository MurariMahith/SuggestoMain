import { combineAll, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
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
import { HitsService } from 'src/app/services/hits.service';
import { Customer } from 'src/app/models/Customer';
import { RatedMovies } from 'src/app/models/Customer Related/RatedMovies';

import { AngularFireMessaging } from 'angularfire2/messaging';

import {Inject} from '@angular/core';

import { SwPush } from '@angular/service-worker';
import { NotificationSaveEndPointService } from 'src/app/services/notification-save-end-point.service';
import { ArrayHelperService } from 'src/app/services/array-helper.service';
import { Language } from 'src/app/models/Language';
import { MoviePlatForm } from 'src/app/models/MoviePlatform';
import { Hits } from 'src/app/models/Hits';
import { AuthService } from 'src/app/services/authService';
import { FeedItem } from 'src/app/models/FeedItem';


@Component({
  selector: 'app-personalised-movies-of-customer',
  templateUrl: './personalised-movies-of-customer.component.html',
  styleUrls: ['./personalised-movies-of-customer.component.scss']
})
export class PersonalisedMoviesOfCustomerComponent implements OnInit {

  loading : boolean = true;

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private customerService : CustomerService,
    private hitsService : HitsService,
    private swPush : SwPush,
    private endPointService : NotificationSaveEndPointService,
    private sanitizer: DomSanitizer,
    private arrayHelper : ArrayHelperService,
    private authService : AuthService,
    @Inject(AngularFireMessaging) private afMessaging: AngularFireMessaging
    ) { }

    currentCustomer : Customer;
    loggedIn : boolean = false; 

    personalisedMoviesDisplay : DisplayMovie[] = [];

    allMovies : Array<FMovie> = [];

  ngOnInit(): void {

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            ////console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))              
              this.loggedIn = true
              this.getAllMovies();
            }
            else
            {
              //console.log("undefined")
              //console.log("undefined above")
              localStorage.removeItem("uid");
              localStorage.removeItem("loggedIn")
              this.authService.logOut();
              this.loggedIn = false;
              location.reload();

            }
            //console.log(this.currentCustomer);
            if(this.currentCustomer === undefined)
            {
              //console.log("undefined")
              //console.log("undefined above")
              localStorage.removeItem("uid");
              localStorage.removeItem("loggedIn")
              this.authService.logOut();
              this.loggedIn = false;
              location.reload();

            }

            //here write code for getting personalised movies.


          })
    }


  }

  getAllMovies()
  {
    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.allMovies = o;
      this.buildPersonalisedContentForLoggedInCustomer();
    })
  }

  // personalisedMoviesForDisplay : DisplayMovie[] = [];

  buildPersonalisedContentForLoggedInCustomer()
  {
    this.loading = false;
    var i=0;
    var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,false,true,false,false);
    var personalisedMovies = []
    console.log(this.currentCustomer.preferredGenre)
    //console.log()
    allDisplayMovies.forEach(o => {

      var genresForMovie = o.genre.trim().split(' ')
      
      genresForMovie.forEach(element => {
        if(this.currentCustomer.preferredGenre && this.currentCustomer.preferredGenre.includes(element))
        {
          i=i+1;
          personalisedMovies.push(o)
        }

      });

    });
    console.log(personalisedMovies);
    var uniqueArray :DisplayMovie[] = personalisedMovies.filter(function(item, pos) {
      return personalisedMovies.indexOf(item) == pos;
    })
    this.personalisedMoviesDisplay = uniqueArray;
    var LanguageBasedPersonalisedMovies = [];
    uniqueArray.forEach(o => {
      this.currentCustomer.preferredLanguages.forEach(element => {
        ////console.log(o.language.includes(element))
        if(o.language.includes(element))
        {
          LanguageBasedPersonalisedMovies.push(o)
        }
      });
    });
    // //console.log(LanguageBasedPersonalisedMovies)
    // //console.log(this.personalisedMoviesDisplay)
    this.personalisedMoviesDisplay = LanguageBasedPersonalisedMovies
    //murari

    //get any random movie for corousel
    var shuffledpersonalisedmovies = [];
    console.log(LanguageBasedPersonalisedMovies);
    //this.personalisedMoviesDisplay
    // if(this.personalisedMoviesDisplay.length>0)
    // {

    // }
    // shuffledpersonalisedmovies = this.shuffleArr(this.personalisedMoviesDisplay)
    // console.log(this.personalisedMoviesDisplay)
    // this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[0];
    // console.log(this.corouselPersonalisedMovieD)
    // if(this.todayMovieD && this.corouselWishlistedMovieD && this.todayMovieD.key === this.corouselPersonalisedMovieD.key)
    // {
    //   this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[1];
    // }    
  }

}
