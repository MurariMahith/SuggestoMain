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
import { FeedItem } from 'src/app/models/FeedItem';
import { UpcomingOtt } from 'src/app/models/UpcomingOtt';
import { WishlistService } from 'src/app/sharedServices/wishlist.service';
import { WatchedService } from 'src/app/sharedServices/watched.service';
import { RatingService } from 'src/app/sharedServices/rating.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {


  allMovies : Array<FMovie> = [];
  allMoviesD : Array<DisplayMovie> = [];
  allMovieLists : Array<MovieList> = [];
  editorsChoice : DisplayMovieList[] = [];
  topRatedCustomList : DisplayMovieList[] = [];

  todayMovie : FMovie;
  topRatedMovieD : DisplayMovie;

  randomMovieD : DisplayMovie;

  corouselWishlistedMovie : FMovie;
  corouselWishlistedMovieD : DisplayMovie;
  corouselWishlistedMovieBool : Boolean = false;

  corouselPersonalisedMovie : FMovie;
  corouselPersonalisedMovieD : DisplayMovie;
  corouselPersonalisedMovieBool : Boolean = false;

  todayMovieD : DisplayMovie;
  //todayBooleanMovie is used to check whether tody we have suggested movie or not
  todayBooleanMovie : boolean = true;
  //loading boolean is for animations to view until our app fetches movies from db
  loading : boolean = true;
  //lists for home page
  homePageList : HomePageLists = new HomePageLists();

  sortedArray : DisplayMovie[] = []

  allGenres : string[] = [];
  genreObj : Genre = new Genre();
  
  isMobile : boolean = false;

  //APIforState = 'https://api.bigdatacloud.net/data/reverse-geocode-client?'

  allCustomers : Customer[] = [];
  verifiedCustomers : Customer[] = [];
  currentCustomer : Customer;

  wishlistedMovies : string[] = [];
  watchedMovies : string[] = [];
  ratedMoviesForThisCustomer : string[] = [];

  personalisedMoviesDisplay : DisplayMovie[] = [];

  loggedIn : boolean = false;

  MovieToBeRated : FMovie = new FMovie();
  rating : number = 0;

  allOttObjs : UpcomingOtt[] = [];

  

  tel=true;
  tam=false;
  mal=false;
  eng=false

  

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private wishlistService : WishlistService,
    private watchedService : WatchedService,
    private ratingService : RatingService,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private customerService : CustomerService) { }

    ngOnInit() 
    {
      // Get the element yourself.
      // var swiper = new Swipe(document.getElementById('#my-element'));
      // swiper.onLeft(function() { alert('You swiped left.') });
      // swiper.run();
      if( screen.width <= 480 ) {     
        this.isMobile = true;
        ////console.log("mobile");
      }
      else{
        ////console.log("laptop")
      }
      if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
      {
        this.customerService.getLoggedInCustomer()
          .subscribe(o =>
            {
              ////console.log(o)
              this.allCustomers = o;
              this.verifiedCustomers.length = 0;
              this.allCustomers.forEach(element => {
                if(element.verifiedAccount)
                  this.verifiedCustomers.push(element);
              });
              if(o.find(x => x.uid === localStorage.getItem("uid")))
              {
                this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
                this.loggedIn = true
                this.getFeedItemsAndFilter();
              }
              if(this.currentCustomer.wishlistedMovies)
              {
                this.wishlistedMovies = this.currentCustomer.wishlistedMovies;
              }
              if(this.currentCustomer.watchedMovies)
              {
                this.watchedMovies = this.currentCustomer.watchedMovies;
              }
              if(this.currentCustomer.ratedMovies)
              {
                this.currentCustomer.ratedMovies.forEach(element => {
                  this.ratedMoviesForThisCustomer.push(element.movieId)
                });
              }
              ////console.log(this.currentCustomer)
              ////console.log(this.loggedIn)
            })
      }
      // else
      // {
      //   this.loading = false
      // }
      //console.log(this.customerService.getLoggedInCustomer())
      //console.log(this.currentCustomer)
  
      this.allGenres = Object.keys(this.genreObj)
      //console.log(this.allGenres)
      this.movieService.getAllMovies().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o => {
        this.allMovies = o;
        this.allMoviesD = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,true,false,false,false);
        this.topRatedMovieD = this.allMoviesD[0];
        this.generateRandomMovie()
        
        //console.log(this.topRatedMovieD);
        if(this.loggedIn)
        {
          this.buildPersonalisedContentForLoggedInCustomer()     
        }
        var shuffledwishlistedMoviesOfCustomer = []
        shuffledwishlistedMoviesOfCustomer = this.shuffleArr(this.wishlistedMovies)
        //this.corouselWishlistedMovie = this.allMovies.find(x => x.key === shuffledwishlistedMoviesOfCustomer[0])
        for(let x=0;x<this.allMovies.length;x++)
        {
          if(this.allMovies[x].key == shuffledwishlistedMoviesOfCustomer[0])
          {
              ////console.log(this.allMovies[x].imageUrl);
              this.corouselWishlistedMovie = this.allMovies[x];
          }
        }
  
        var fakearr2 = [];
        fakearr2.push(this.corouselWishlistedMovie)
        ////console.log(arr)
        if(fakearr2[0])
        {
          this.corouselWishlistedMovieD = this.movieDisplayService.prepareDisplayMovieList(fakearr2)[0]; 
          if(this.corouselPersonalisedMovieD)
          {
            this.corouselWishlistedMovieBool = true;
          }
        }
        // //console.log(shuffledwishlistedMoviesOfCustomer);
        // //console.log(this.corouselPersonalisedMovie)
        
        this.loading = false;
        ////console.log(o);
        for(let i=0;i<this.allMovies.length;i++)
        {
          var newDate = this.buildProperDate(this.allMovies[i].suggestedDate);       
          if(moment().startOf('day').isSame(moment(new Date(newDate))))
          {
            this.todayMovie = this.allMovies[i];          
            this.todayBooleanMovie = false;
            break;
          }
        }
        var arr = [];
        arr.push(this.todayMovie)
        ////console.log(arr)
        if(arr[0])
        {
          this.todayMovieD = this.movieDisplayService.prepareDisplayMovieList(arr)[0]      
        }
        
        this.getMovieListsFromDb();
      })
      this.homelistsservice.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o => {
        ////console.log(o)
        this.homePageList = o[0];
        ////console.log(this.homePageList.listsToIncludeInHomePage)
        this.buildeditorChoiceMovieListForDisplay()
        this.buildRecentlySuggestedMovieList()    
      });

      this.customerService.getAllOtt().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o => {
        var allOtt : UpcomingOtt[] = o;
        // console.log(allOtt)
        // console.log("ott here")
        this.allOttObjs = _.orderBy(allOtt, (x: UpcomingOtt) => {
          return moment(new Date(this.buildProperDate(x.releaseDate)))
        }, ['desc']);

        this.allOttObjs.forEach(a => {
          a.releaseDate = moment(this.buildProperDate(a.releaseDate)).format('DD')+ " "+moment(this.buildProperDate(a.releaseDate)).format('MMMM')
        })

        // console.log(this.allOttObjs);
      })
  
    }


    getCurrentCustomerFollowingUserIds() :string[]
    {
      var arr = [];
      if(!this.currentCustomer.following || this.currentCustomer.following == undefined || this.currentCustomer.following.length == 0)
      {
        this.currentCustomer.following = [];
      }
      this.currentCustomer.following.forEach(element => {
        arr.push(element.followerUserId);
      });
      return arr;
    }

    FeedItems : FeedItem[] = [];

    getFeedItemsAndFilter()
    {
      this.customerService.getAllFeedItems().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o => {
        var allFeedItems : FeedItem[] = o;
        var followingUserIds : string[] = this.getCurrentCustomerFollowingUserIds();
        this.FeedItems.length = 0;
        allFeedItems.forEach(element => {
          if(element.customerUid == 'ADMIN')
          {
            this.FeedItems.push(element);
          }
          if(followingUserIds.includes(element.customerUid))
          {
            //console.log(this.allCustomers.find(x => x.uid = element.customerUid))
            if(element.type == 'WATCHED' && this.allCustomers.find(x => x.uid == element.customerUid).showWatchedListToFollowers)
            {
              this.FeedItems.push(element)
            }
            if(element.type == 'WISHLIST' && this.allCustomers.find(x => x.uid == element.customerUid).showWishlistToFollowers)
            {
              this.FeedItems.push(element)
            }
          }          
        });
        this.FeedItems.reverse();
      })
    }

    longfeed : boolean = false;
    longOtt : boolean = false;

    generateRandomMovie()
    {
      var shuffleD = this.shuffleArr(this.allMoviesD);
      this.randomMovieD = shuffleD[2];
      //console.log(this.randomMovieD);
    }
  
    shuffleArr (array) : any[]
    {
      for (var i = array.length - 1; i > 0; i--) {
          var rand = Math.floor(Math.random() * (i + 1));
          [array[i], array[rand]] = [array[rand], array[i]]
      }
      return array;
    }
  
    buildPersonalisedContentForLoggedInCustomer()
    {
      var i=0;
      var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,false,true,false,false);
      var personalisedMovies = []
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
      var uniqueArray :DisplayMovie[] = personalisedMovies.filter(function(item, pos) {
        return personalisedMovies.indexOf(item) == pos;
      })
      // //console.log(uniqueArray);
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
      this.personalisedMoviesDisplay = LanguageBasedPersonalisedMovies
      //murari
  
      //get any random movie for corousel
      var shuffledpersonalisedmovies = [];
      shuffledpersonalisedmovies = this.shuffleArr(this.personalisedMoviesDisplay)
      this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[0];
      if(this.corouselPersonalisedMovieD)
      {
        this.corouselPersonalisedMovieBool = true;
      }
  
      // var uniqueArray2 :DisplayMovie[] = this.personalisedMoviesDisplay.filter(function(item, pos) {
      //   return this.personalisedMoviesDisplay.indexOf(item) == pos;
      // })
      // this.personalisedMoviesDisplay = uniqueArray2;
      ////console.log(this.personalisedMoviesDisplay)
    }
  
    buildRecentlySuggestedMovieList()
    {
      var allmovies2 = [];
      this.allMovies.forEach(element => {
        var newDate = this.buildProperDate(element.suggestedDate);       
          if(moment().startOf('day').isAfter(moment(new Date(newDate))))
          {
            allmovies2.push(element)
          }
      });
  
      var sortedArrayTS = this.movieDisplayService.prepareDisplayMovieList(allmovies2)
      // //console.log(this.sortedArray)
  
      this.sortedArray = _.orderBy(sortedArrayTS, (o: DisplayMovie) => {
        ////console.log(moment(new Date(this.buildProperDate(o.suggestedDate))))
        return moment(new Date(this.buildProperDate(o.suggestedDate)))
      }, ['desc']);
      
      // this.sortedArray.forEach(element => {
      //   //console.log(element.suggestedDate);
      // });
      
    }
  
    buildProperDate(str : string) :string
    {
      var dateArray = str.split("/");
      // console.log(str)
      // console.log(dateArray)
      return dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    }
  
    getMovieListsFromDb()
    {
      this.listService.getAllMovieLists().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o => {
        this.allMovieLists = o;
        this.buildTopRatedCustomeMovieListsForDisplay();
        //this.buildeditorChoiceMovieListForDisplay()
      })
    }

    buildTopRatedCustomeMovieListsForDisplay()
    {
      ////console.log("here")
      //console.log(this.personalisedMoviesDisplay);
      var fake = this.allMovieLists.filter(x => {
        if(x.createdBy && x.createdBy !== 'ADMIN')
        {
          return true;
        }
      })
      this.topRatedCustomList = this.listDisplayService.BuildMovieListForDisplay(fake,this.allMovies);
      this.topRatedCustomList.sort((a, b) => {
        return b.rating - a.rating;
      });
      ////console.log(fake);
    }
  
    buildeditorChoiceMovieListForDisplay()
    {
      this.editorsChoice = this.listDisplayService.BuildMovieListForDisplay(this.homePageList.listsToIncludeInHomePage,this.allMovies);
      ////console.log(this.editorsChoice[0])
    }
  
    GoToGenre(str:string)
    {
      this.router.navigateByUrl('/all?genre='+str.trim().toLocaleLowerCase())
    }
  
    GoToMovie(key)
    {
      this.router.navigateByUrl('/movie/'+key)
    }
  
    launchModal(key)
    {
      //document.querySelector(".exampleModalCenter").on()
    }

    gotoInstagramPartner(url)
    {
      var con = confirm("You will be redirected to Instagram page of our partner. You want to go?")
      if(con)
      {
        window.location.href = url
      }
    }

    addMovieToWishlist(key)
  {
    //console.log(key)
    //var wishlisted = []
    this.wishlistedMovies.push(key)
    this.wishlistService.addToWishlist(key,this.currentCustomer);
    // wishlisted.push(key)
    // if(!this.currentCustomer.wishlistedMovies)
    // {
    //   //console.log("new");
    //   this.currentCustomer.wishlistedMovies = wishlisted;
    // }
    // else
    // {
    //   this.currentCustomer.wishlistedMovies.push(key);
    // }
    // ////console.log(this.currentCustomer)
    // this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    var feeditm : FeedItem = new FeedItem();
    feeditm.content = this.currentCustomer.name + " added "+this.allMovies.find(x=>x.key == key).title + " to their wishlist . Click to view the movie."
    feeditm.customerName = this.currentCustomer.name;
    feeditm.customerUid = this.currentCustomer.uid;
    feeditm.photoUrl = this.currentCustomer.customerPhotoUrl;
    feeditm.url = '/movie/'+this.allMovies.find(x=>x.key == key).key;
    feeditm.type = 'WISHLIST';
    this.customerService.addFeedItem(feeditm);
  }

  removeFromWishlist(key)
  {
    this.wishlistService.removeFromWishlist(key,this.currentCustomer)
    // //console.log(this.currentCustomer.wishlistedMovies)
    // if(!this.currentCustomer.wishlistedMovies.includes(key))
    // {
    //   // for( var i = 0; i < this.currentCustomer.wishlistedMovies.length; i++)
    //   // {     
    //   //   if (this.currentCustomer.wishlistedMovies[i] == key) 
    //   //   {   
    //   //     this.currentCustomer.wishlistedMovies.splice(i, 1); 
    //   //   }
    //   // }
    //   console.log("not there")
    // }
  }

  addToWatchedMovies(key)
  {
    this.watchedMovies.push(key)
    this.watchedService.addToWatched(key,this.currentCustomer)
    // if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.length >1)
    // {
    //   this.currentCustomer.watchedMovies.push(key);

    // }
    // else
    // {
    //   var arr :string[] = [];
    //   arr.push(key);
    //   this.currentCustomer.watchedMovies = arr;
    // }

    //this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
    var feeditm : FeedItem = new FeedItem();
    feeditm.content = this.currentCustomer.name + " watched "+this.allMovies.find(x=>x.key == key).title + " . Click to view the movie."
    feeditm.customerName = this.currentCustomer.name;
    feeditm.customerUid = this.currentCustomer.uid;
    feeditm.photoUrl = this.currentCustomer.customerPhotoUrl;
    feeditm.url = '/movie/'+this.allMovies.find(x=>x.key == key).key;
    feeditm.type = 'WATCHED';
    this.customerService.addFeedItem(feeditm);
  }

  removeFromWatched(key)
  {
    this.watchedService.removeFromWatched(key,this.currentCustomer)
    // if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(key))
    // {
    //   for( var i = 0; i < this.currentCustomer.watchedMovies.length; i++)
    //   {     
    //     if (this.currentCustomer.watchedMovies[i] == key) 
    //     {   
    //       this.currentCustomer.watchedMovies.splice(i, 1); 
    //     }
    //   }
    //   this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
    // }

  }

  startRateMovie(key)
  {
    this.MovieToBeRated = this.allMovies.find(o => o.key ===key)
    ////console.log(this.MovieToBeRated);
  }

  rateMovie(key)
  {
    this.ratingService.rateMovie(key,this.MovieToBeRated,this.rating,this.currentCustomer,this.loggedIn)
    // this.MovieToBeRated.rating = Number(this.MovieToBeRated.rating) + Number(this.rating);
    // var movieKey = this.MovieToBeRated.key
    // delete this.MovieToBeRated.key
    // this.movieService.updateMovie(movieKey,this.MovieToBeRated)
    // var ratedMovieLocal : RatedMovies = new RatedMovies();
    // var arr = [];
    // ratedMovieLocal.movieId = key;
    // ratedMovieLocal.rating = Number(this.rating)
    // if(!this.currentCustomer.ratedMovies)
    // {
    //   arr.push(ratedMovieLocal)
    //   this.currentCustomer.ratedMovies = arr
    // }
    // else
    // {
    //   this.currentCustomer.ratedMovies.push(ratedMovieLocal)
    // }
    // ////console.log(this.currentCustomer)
    // this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
  }
  
    // addMovieToWishlist(key)
    // {
    //   //console.log(key)
    //   var wishlisted = []
    //   this.wishlistedMovies.push(key)
    //   wishlisted.push(key)
    //   if(!this.currentCustomer.wishlistedMovies)
    //   {
    //     //console.log("new");
    //     this.currentCustomer.wishlistedMovies = wishlisted;
    //   }
    //   else
    //   {
    //     this.currentCustomer.wishlistedMovies.push(key);
    //   }
    //   ////console.log(this.currentCustomer)
    //   this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    // }
  
    // startRateMovie(key)
    // {
    //   this.MovieToBeRated = this.allMovies.find(o => o.key ===key)
    //   ////console.log(this.MovieToBeRated);
    // }
  
    // rateMovie(key)
    // {
    //   this.MovieToBeRated.rating = Number(this.MovieToBeRated.rating) + Number(this.rating);
    //   var movieKey = this.MovieToBeRated.key
    //   delete this.MovieToBeRated.key
    //   this.movieService.updateMovie(movieKey,this.MovieToBeRated)
    //   var ratedMovieLocal : RatedMovies = new RatedMovies();
    //   var arr = [];
    //   ratedMovieLocal.movieId = key;
    //   ratedMovieLocal.rating = Number(this.rating)
    //   if(!this.currentCustomer.ratedMovies)
    //   {
    //     arr.push(ratedMovieLocal)
    //     this.currentCustomer.ratedMovies = arr
    //   }
    //   else
    //   {
    //     this.currentCustomer.ratedMovies.push(ratedMovieLocal)
    //   }
    //   ////console.log(this.currentCustomer)
    //   this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    // }
  
    gotolist(key)
    {
      this.router.navigateByUrl('/list/'+key);
    }
  
  }
  