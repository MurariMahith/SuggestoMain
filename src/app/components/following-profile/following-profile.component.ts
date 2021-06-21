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
import { Location } from '@angular/common';
import { PeopleServiceService } from 'src/app/sharedServices/people-service.service';
import { WishlistService } from 'src/app/sharedServices/wishlist.service';
import { WatchedService } from 'src/app/sharedServices/watched.service';
import { RatingService } from 'src/app/sharedServices/rating.service';

@Component({
  selector: 'app-following-profile',
  templateUrl: './following-profile.component.html',
  styleUrls: ['./following-profile.component.scss']
})
export class FollowingProfileComponent implements OnInit {

  
  currentCustomer : Customer;
  customerToDisplay : Customer;
  loading : boolean = true;

  allCustomers : Customer[] = [];

  wishBool : boolean = false;
  watchBool : boolean = false;

  isMobile : boolean = true;

    
  allLists : MovieList[] = []
  allMovies : FMovie[] = [];

  listsByThisCustomer : MovieList[] = [];

  SHOWPROFILE : boolean = false;

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private peopleService : PeopleServiceService,
    private wishlistService : WishlistService,
    private watchedService : WatchedService,
    private ratingService : RatingService,
    private homelistsservice : HomePageListsService,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private location: Location,
    private authService : AuthService,
    private customerService : CustomerService) { }

  ngOnInit(): void {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      this.isMobile = false;
    }

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            this.loading = false;
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              if(!this.currentCustomer.wishlistedMovies)
                this.currentCustomer.wishlistedMovies = [];
              if(!this.currentCustomer.ratedMovies)
                this.currentCustomer.ratedMovies = [];
              if(!this.currentCustomer.watchedMovies)
                this.currentCustomer.watchedMovies = [];
            }
            if(o.find(x => x.uid === this.activatedRoute.snapshot.params.key))
            {
              this.customerToDisplay = o.find(x => x.uid === this.activatedRoute.snapshot.params.key)
              if(this.customerToDisplay.uid == this.currentCustomer.uid)
              {
                this.router.navigateByUrl('/profile')
              }

              if(!this.customerToDisplay.wishlistedMovies)
                this.customerToDisplay.wishlistedMovies = [];
              if(!this.customerToDisplay.ratedMovies)
                this.customerToDisplay.ratedMovies = [];
              if(!this.customerToDisplay.watchedMovies)
                this.customerToDisplay.watchedMovies = [];

              var followingByCurrentCustomer =[];

              this.currentCustomer.following.forEach(element => {                
                followingByCurrentCustomer.push(element.followerUserId);
              });
              //console.log(followingByCurrentCustomer)
              if(followingByCurrentCustomer.includes(this.customerToDisplay.uid))
              {
                this.SHOWPROFILE = true;
              }
              if(!this.customerToDisplay.shareWishlistedMovies && !this.SHOWPROFILE)
              {
                alert("Either this profile is private profile or Something went wrong on our side. Please log a complaint in complaint section. Fix will be released as soon as possible. Thank you")
                this.location.back();
              }
              ////console.log(this.SHOWPROFILE)
              this.getMovieLists();
              this.getMovies();            
              if(this.customerToDisplay.showWishlistToFollowers)
              {
                this.wishBool = true;
              }
              else if(this.customerToDisplay.showWatchedListToFollowers)
              {
                this.watchBool = true;
              }
            }

            //console.log(this.currentCustomer.name)
            //console.log(this.customerToDisplay.name)
          })
    }

  }
  GoToSocialAccount()
  {
    window.location.href = this.customerToDisplay.socialMediaAccountUrl
  }

  getMovies()
  {
    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.allMovies = o;
      this.getCategorisedMoviesForCustomer()
    })
  }

  getMovieLists()
  {
    //getting all movie-lists
    this.listService.getAllMovieLists().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => 
      {
        this.allLists = o;
        //console.log(this.allLists)
        this.listsByThisCustomer.length = 0;
        this.allLists.forEach(x => {
          if(x.createdBy && x.createdBy === this.customerToDisplay.uid)
          {
            this.listsByThisCustomer.push(x);              
          }
        });
        this.listsByThisCustomer.sort((x,y) => y.rating - x.rating);
      })
  }

  wishlistedMovies : FMovie[] = [];
  watchedMovies : FMovie[] = [];
  wishlistedMoviesDisplay : DisplayMovie[] = [];
  watchedMoviesDisplay : DisplayMovie[] = [];

  getCategorisedMoviesForCustomer()
  {
    this.wishlistedMovies.length = 0;
    this.watchedMovies.length = 0;
    // this.allMovies.forEach(element => {
    //   if(this.customerToDisplay.wishlistedMovies && this.customerToDisplay.wishlistedMovies.includes(element.key))
    //   {
    //     this.wishlistedMovies.push(element)
    //   }
    //   if(this.customerToDisplay.watchedMovies && this.customerToDisplay.watchedMovies.includes(element.key))
    //   {
    //     this.watchedMovies.push(element)
    //   }
      
    // });
    this.getCategorisedMoviesForCustomerForDisplay();
  }

  getCategorisedMoviesForCustomerForDisplay()
  {
    this.wishlistedMoviesDisplay = this.wishlistService.getAllWishlistedMoviesByCustomer(this.currentCustomer,this.allMovies)
    this.watchedMoviesDisplay = this.watchedService.getAllWatchedMoviesByCustomer(this.currentCustomer,this.allMovies)
    //console.log(this.wishlistedMovies);
  }

  //use this method to send request dont use service method here
  sendFollowRequest(key)
  {
    //console.log("sending")
    //this.peopleService.sendFollowRequest(key,this.allCustomers,this.currentCustomer);
    var receiverCustomer = this.customerToDisplay
    //console.log(receiverCustomer);

    if(receiverCustomer)
    {
      var request : FollowObject = new FollowObject();
      request.followerName = this.currentCustomer.name;
      request.followerUserId = this.currentCustomer.uid;
      request.followerphotoUrl = this.currentCustomer.customerPhotoUrl;
      if(receiverCustomer.followRequestReceived)
      {
        receiverCustomer.followRequestReceived.push(request)
      }
      else
      {
        var requestobj : FollowObject[] = [];
        requestobj.push(request)
        receiverCustomer.followRequestReceived = requestobj;
      }
      
      this.customerService.updateCustomer(receiverCustomer['key'],receiverCustomer)
      
      if(this.currentCustomer.followRequestSent)
      {
        this.currentCustomer.followRequestSent.push(receiverCustomer.uid);
      }
      else
      {
        var strarr :string[] = [];
        strarr.push(receiverCustomer.uid);
        this.currentCustomer.followRequestSent = strarr
      }
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      ////console.log(receiverCustomer)
      //console.log(this.currentCustomer)
    } 
  }

  //use this method to unfollow dont use service method here
  UnfollowCustomer(key)
  {
    
    var customerToUnfollow = this.customerToDisplay
    if(customerToUnfollow.followers)
    {
      for( var i = 0; i < customerToUnfollow.followers.length; i++)
      {     
        if (customerToUnfollow.followers[i].followerUserId == this.currentCustomer.uid) 
        {   
          customerToUnfollow.followers.splice(i, 1); 
        }
      }     
      
      for( var i = 0; i < this.currentCustomer.following.length; i++)
      {     
        if (this.currentCustomer.following[i].followerUserId == customerToUnfollow.uid) 
        {   
          this.currentCustomer.following.splice(i, 1); 
        }
      } 

      //console.log(customerToUnfollow)
      //console.log(this.currentCustomer)

      

      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer).then(() => {
        this.customerService.updateCustomer(customerToUnfollow['key'],customerToUnfollow).then(() => {
          window.location.reload();
          //this.router.onSameUrlNavigation = 'reload';
          //this.router.navigateByUrl('following/'+this.activatedRoute.snapshot.params.key)
        })
      })
      
      //alert("You are about to unfollow "+this.customerToDisplay.name);
      //reload component 

      
      
      //update other customer
      //delete follow object from following in current customer
      //update current customer
    }

  }

  //use this method to delete follow request dont use service method here
  //delete other customer uid from followrequestsent array of current customer
  //delete follow object with current customer uid from followrequestreceived array of other customer
  deleteFollowRequest(key)
  {
    //this.peopleService.unsendFollowRequest(key,this.allCustomers,this.currentCustomer)
    var requestedCustomer = this.customerToDisplay
    if(requestedCustomer)
    {
      if(this.currentCustomer.followRequestSent.includes(key))
      {
        for( var i = 0; i < this.currentCustomer.followRequestSent.length; i++)
        {     
          if (this.currentCustomer.followRequestSent[i] == key) 
          {   
            this.currentCustomer.followRequestSent.splice(i, 1); 
          }
        }
      }

      for( var i = 0; i < requestedCustomer.followRequestReceived.length; i++)
      {     
        if (requestedCustomer.followRequestReceived[i].followerUserId == this.currentCustomer.uid) 
        {   
          requestedCustomer.followRequestReceived.splice(i, 1); 
        }
      }

      //console.log(this.currentCustomer)
      //console.log(requestedCustomer)
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      this.customerService.updateCustomer(requestedCustomer['key'],requestedCustomer)
    }
  }



}
