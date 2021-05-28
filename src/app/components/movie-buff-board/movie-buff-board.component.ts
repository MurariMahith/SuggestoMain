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
// import { $ } from 'protractor';
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
import { FollowObject } from 'src/app/models/FollowObject';
import { FeedItem } from 'src/app/models/FeedItem';


@Component({
  selector: 'app-movie-buff-board',
  templateUrl: './movie-buff-board.component.html',
  styleUrls: ['./movie-buff-board.component.scss']
})
export class MovieBuffBoardComponent implements OnInit {

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    private customerService : CustomerService) { }

    loading : boolean = true;

    allCustomers : Customer[] = [];

    currentCustomer : Customer;

    allFriends : Customer[] = [];

    allFollowing : string[] = [];

    all : boolean = true;
    friends : boolean = false;

    loggedIn : boolean = false;

  ngOnInit(): void {

    this.customerService.getLoggedInCustomer()
    .subscribe(o =>
    {
      this.loading = false;
      this.allCustomers = o;
      this.allCustomers.forEach(c => 
        {
          if(!c.wishlistedMovies)
            c.wishlistedMovies = [];
          if(!c.ratedMovies)
            c.ratedMovies = [];
          if(!c.watchedMovies)
            c.watchedMovies = [];
        })
      this.allCustomers.sort((a,b) => {
        return (b.watchedMovies.length + b.ratedMovies.length + b.wishlistedMovies.length) - (a.watchedMovies.length + a.ratedMovies.length + a.wishlistedMovies.length)
      })
      if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
      {
        
        if(this.allCustomers.find(x => x.uid == localStorage.getItem("uid")))
        {
          this.currentCustomer = this.allCustomers.find(x => x.uid == localStorage.getItem("uid"))
          this.loggedIn = true;
          this.allFriends.length = 0;
          var friendsIds = [];
          this.allCustomers.forEach(c =>
            {
              this.currentCustomer.following.forEach(x => {
                if(x.followerUserId == c.uid && !this.allFriends.includes(c))
                {
                  this.allFollowing.push(x.followerUserId)
                  this.allFriends.push(c)
                }
              });
              this.currentCustomer.followers.forEach(x => {
                if(x.followerUserId == c.uid && !this.allFriends.includes(c))
                {
                  this.allFriends.push(c)
                }
              })
            })
          // //console.log(friendsIds)
          this.allFriends.push(this.currentCustomer)
          //console.log(this.allFollowing)
          this.allFriends.sort((a,b) => {
            return (b.watchedMovies.length + b.ratedMovies.length + b.wishlistedMovies.length) - (a.watchedMovies.length + a.ratedMovies.length + a.wishlistedMovies.length)
          })
          //console.log(this.allFriends)

          //unique array
          this.allFriends.filter((v,i,a)=>a.findIndex(t=>(t.uid === v.uid))===i)
        }
      }
    })



    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            this.loading = false;
          })
    }
  }

  GoToFollowing(key : string)
  {
    this.router.navigateByUrl('/following/'+key)
  }

}
