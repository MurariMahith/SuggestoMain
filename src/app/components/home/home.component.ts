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
import { SharedMovie } from 'src/app/models/SharedMovie';
import { FollowObject } from 'src/app/models/FollowObject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allMovies : Array<FMovie> = [];
  allMovieLists : Array<MovieList> = [];
  editorsChoice : DisplayMovieList[] = [];

  todayMovie : FMovie;

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
  loading2 : boolean = true;
  //lists for home page
  homePageList : HomePageLists = new HomePageLists();

  sortedArray : DisplayMovie[] = []

  allGenres : string[] = [];
  allPlatforms : string[] = [];
  genreObj : Genre = new Genre();
  platformObj : MoviePlatForm = new MoviePlatForm();
  
  isMobile : boolean = false;

  APIforState = 'https://api.bigdatacloud.net/data/reverse-geocode-client?'


  latitude : string = '';
  longitude : string = '';
  locationAccess : boolean = false;
  locationPreferreLanguage : string = "";

  locationBasedMovies : DisplayMovie[] = [];

  currentCustomer : Customer;

  wishlistedMovies : string[] = [];
  watchedMovies : string[] = [];
  ratedMoviesForThisCustomer : string[] = [];

  personalisedMoviesDisplay : DisplayMovie[] = [];

  moviesNotYetWatchedDisplay : DisplayMovie[] = [];

  moviesNotYetWatchedKeys : string[] = [];

  loggedIn : boolean = false;

  MovieToBeRated : FMovie = new FMovie();
  rating : number = 0;

  notificationEnabled : boolean = false;

  safeSrc: SafeResourceUrl;

  //quickViewMovie : FMovie = new FMovie();
  langq : Language = {english: true, kannada: false, malayalam: false, tamil: false, telugu: false};
  genreq : Genre = new Genre()
  availableInq : MoviePlatForm = new MoviePlatForm();
  //{Action:true,Adventure:false,Alien_and_Space:false,Animated:false,Comedy:false,Drama:false,Fantasy:false,Horror:false,Korean:false,Mystery:false,Romance:false,Science_Fiction:false,Super_Hero:true,Thriller:false,Western:false}
  quickViewMovie : FMovie = {
    key:"-MV6DO_eTJW28Kc5E3dI",
    runTime:"180",
    availableIn:
    this.availableInq,
    cardImageUrl:"https://firebasestorage.googleapis.com/v0/b/weekendmoviesuggestion.appspot.com/o/images%2Faveners3.jpg?alt=media&token=2d1949a1-6419-43d8-ba9b-90a089c4e359",
    cast:["robert downey Jr","Chris Evans"," Chris Hemsworth","Scarlett Johanson","samuel jackson"],"description":"the movie where iron man earns respect",
    imageUrl:"https://firebasestorage.googleapis.com/v0/b/weekendmoviesuggestion.appspot.com/o/images%2Favengers%204%20big.jfif?alt=media&token=b813dc40-e61e-45ae-82a0-cd3ecbea83f8",
    language:this.langq,
    movieGenre:this.genreq,
    ottLink : "",
    torrentDownloadLink : "",
    torrentOnlineLink : '',
    rating:30,
    releaseYear:"2019",
    subTags:["best movie","ironman","hulk","thunder","thanos","infinity stones","captain marvel"],
    suggestedDate:"06/04/2021",
    title:"Avengers : Endgame",
    ytTrailerLink:"https://www.youtube.com/watch?v=TcMBFSGVi1c",
    visitedCount :0
  };
  quickViewSafeSrc : SafeResourceUrl;

  private readonly publicKey = "BG1i0UoQR6wtBE2_nedxVu9DgQNXwGJptees-P3Wds4NuEXLQCTdlkVt17M56UsVxEurDX7GzOoCFErjQcpMEtI";

  display = 'none';
  newCustomer : boolean = false;
  oldCustomer : boolean = false;
  alertCount = 0;

  NotYetWatchedBool : boolean = false;

  topCustomer : Customer;
  allCustomers : Customer[] = [];

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private messageService : HitsService,
    private customerService : CustomerService,
    private hitsService : HitsService,
    private swPush : SwPush,
    private endPointService : NotificationSaveEndPointService,
    private sanitizer: DomSanitizer,
    private arrayHelper : ArrayHelperService,
    private authService : AuthService,
    @Inject(AngularFireMessaging) private afMessaging: AngularFireMessaging
    ) {
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/odM92ap8_c0")
     }

  pushSubscription()
  {
    if(!this.swPush.isEnabled)
    {
      //console.log("notification not enabled");
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey : this.publicKey,
    }).then(sub => {
      //console.log(JSON.stringify(sub))
      this.endPointService.addEndPoint({"name":this.currentCustomer.name,"endPoint":JSON.stringify(sub)})
      window.localStorage.setItem("notify","true");
      this.notificationEnabled = true;
    })
    .catch(err => console.log(err))
    //console.log("over")
  }

  onCloseHandled(){
    this.display='none';
  }

  allWatchedMoviesByCustomer :string[] = [];

  
  ngOnDestroy()
  { 

    this.hitsService.getHits()
    .snapshotChanges().pipe(
      map(changes => 
          changes.map(c =>
              ({key: c.payload.key, ...c.payload.val() })
              )
          )
      )
    .subscribe(o => {
      var hits : Hits = o[0]
      if(localStorage.getItem("visited") !== "true" || !(localStorage.getItem("visited") !== null))
      {
        hits.visitedNumber = hits.visitedNumber+1;
        this.hitsService.updateCustomer(hits['key'],hits);
        localStorage.setItem("visited","true");
      }
    });

    this.quickViewedMovies.forEach(element => {
      //console.log(element.visitedCount)
      if(element.visitedCount || element.visitedCount === undefined)
      {
        element.visitedCount = element.visitedCount+1;
        try
        {
          this.movieService.updateMovie(element.key,element);
        }
        catch
        {

        }
        
        //console.log(element)
      }
      else
      {
        element.visitedCount = 1;
        try
        {
          this.movieService.updateMovie(element.key,element);
        }
        catch
        {

        }
      }
    });
  }



  ngOnInit() 
  {
    console.log("oninit" + new Date())
    this.BuildTrendingMoviesFromTMDB();
    if( screen.width <= 480 ) {     
      this.isMobile = true;
      this.loading = false;
      //console.log(this.loading2)
      //this.pushSubscription()
      ////console.log("mobile");
    }
    else{
      ////console.log("laptop")
    }
    //get today movie from localstorage until it loads from db.
    console.log(localStorage.getItem("editorchoiceList") == null)
    if(localStorage.getItem("todayMovie") === null || localStorage.getItem("recently") === null || localStorage.getItem("editorchoiceList") === null)
    {
      //console.log("inside");
      this.loading = true;
    }
    this.todayMovieD = JSON.parse(localStorage.getItem("todayMovie"))
    this.sortedArray = JSON.parse(localStorage.getItem("recently"));
    this.editorsChoice = JSON.parse(localStorage.getItem("editorchoiceList"));
    //console.log(this.todayMovieD);


    this.randomTip();

    //loggingout user if loading is true for more than 30 seconds
    // setTimeout(()=> {
    //   if(this.loading)
    //   {
    //     //alert("Either your network connection is slow or something wrong on our side, Please check your internet connection. If you feel something wrong on our side please log a complaint.")
    //     //this.authService.logOut();
    //     //localStorage.removeItem("load30");
    //     // //console.log(localStorage.getItem("load30"))
    //     // //console.log(Number(localStorage.getItem("load30")) == 2)
    //     // //console.log(Number(localStorage.getItem("load30")) <2)

    //     // if(Number(localStorage.getItem("load30")) == 2)
    //     // {
    //     //   alert("Either your network connection is slow or something wrong on our side, we are logging you out please log in again.")
    //     //   this.authService.logOut();
    //     // }
    //     // else if(Number(localStorage.getItem("load30")) <2)
    //     // {
    //     //   var add = Number(localStorage.setItem("load30","1"))+1
    //     //   localStorage.setItem("load30",add.toString())
    //     //   //location.reload();
    //     // }
    //     // else
    //     // {
    //     //   //console.log("start")
    //     //   localStorage.setItem("load30","1");
          
    //     // }
    //   }
    // },40000)
    

    
    {
    // var hit = new Hits();
    // hit.visitedNumber = 1;
    // this.hitsService.create(hit);
    //opening modal after 15 seconds
    // if(!(localStorage.getItem("loggedIn") == "true") && (localStorage.getItem("onceLoggedIn") == "true") && !(localStorage.getItem("alertedOnce") == "true"))
    // //if(!(localStorage.getItem("loggedIn") == "true") && (localStorage.getItem("onceLoggedIn") == "true"))
    // {
    //   this.oldCustomer = true;
    //   var interval = setTimeout(()=> {
    //     this.display = 'block';
    //     localStorage.setItem("alertedOnce","true");
    //     document.getElementById("top").scrollIntoView({ behavior: "smooth"})
    //     //console.log("opening modal")
    //     this.alertCount++;
    //     //console.log(this.alertCount);
    //     if(this.alertCount==1 || this.alertCount>1)
    //     {
    //       clearInterval(interval);
    //     }
    //     //localStorage.setItem("alertedOnce","true");
    //   },15000)
    // }
    // else if(!(localStorage.getItem("loggedIn") == "true") && !(localStorage.getItem("onceLoggedIn") == "true"))
    // {
    //   this.newCustomer = true;
    //   var interval = setInterval(()=> {
    //     this.display = 'block';
    //     localStorage.setItem("alertedOnce","true");
    //     //console.log("opening modal")
    //     document.getElementById("top").scrollIntoView({ behavior: "smooth"})
    //     this.alertCount++;
    //     if(this.alertCount==1 || this.alertCount>1)
    //     {
    //       clearInterval(interval);
    //     }
        
    //   },15000)
    // }
    

    // if(!(localStorage.getItem("onceLoggedIn") == "true"))
    // {
      
    //   setTimeout(()=> {
    //     this.display = 'block';
    //     //console.log("opening modal")
    //   },15000)
    // }
    
    // localStorage.setItem("date",moment().format("DD/MM/YYYY"))
    // if(localStorage.getItem("notify") && localStorage.getItem("notify") == "true")
    // {
    //   this.notificationEnabled = true;
    // }
    //this.notificationEnabled = this.swPush.isEnabled;
    //console.log(this.notificationEnabled)
    // this.swPush.messages.subscribe(o => {
    //   window.location.href = o['notification']['data']['url'];
    // })
    // this.swPush.notificationClicks.subscribe((res) => {
    //   window.location.href = res['notification']['data']['url'];
    // })
    }
    //console.log("oninit" + new Date())
    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            //console.log("oninit" + new Date())
            ////console.log(o)
            this.allCustomers = o;
            this.allCustomers.forEach(c => 
              {
                if(!c.wishlistedMovies)
                  c.wishlistedMovies = [];
                if(!c.ratedMovies)
                  c.ratedMovies = [];
                if(!c.watchedMovies)
                  c.watchedMovies = [];
                if(!c.following)
                  c.following = [];
                if(!c.followers)
                  c.followers = [];
              })
            
            this.topCustomer = this.allCustomers.sort((a,b) => (b.wishlistedMovies.length + b.ratedMovies.length + b.watchedMovies.length) - (a.wishlistedMovies.length + a.ratedMovies.length + a.watchedMovies.length))[0];
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              //console.log(this.currentCustomer);

              this.loggedIn = true
              this.loading = false;
              //this.loading2 = false;
              //console.log("customer found" + this.loading2)


              //checking for all kinds of follow attributes present or not and if not making them empty arrays
              if(!this.currentCustomer.followRequestSent || this.currentCustomer.followRequestSent == undefined)
              {
                this.currentCustomer.followRequestSent = [];
              }
              if(!this.currentCustomer.following || this.currentCustomer.following == undefined)
              {
                this.currentCustomer.following = [];
              }
              if(!this.currentCustomer.followers || this.currentCustomer.followers == undefined)
              {
                this.currentCustomer.followers = [];
              }
              if(!this.currentCustomer.followRequestReceived || this.currentCustomer.followRequestReceived == undefined)
              {
                this.currentCustomer.followRequestReceived = [];
              }
              var friends :FollowObject[] = this.currentCustomer.followers.concat(this.currentCustomer.following);
              // this.allFriends.filter((v,i,a)=>a.findIndex(t=>(t.followerUserId === v.followerUserId))===i)
              this.allFriends = Array.from(new Set(friends.map(a => a.followerUserId)))
                .map(id => {
                  return friends.find(a => a.followerUserId === id)
                })
              this.allFriendsOriginal = this.allFriends;
              //console.log(this.allFriends);



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
    else
    {
      this.customerService.getLoggedInCustomer()
      .subscribe(o =>
        {
          this.allCustomers =o;
          this.allCustomers.forEach(c => 
            {
              if(!c.wishlistedMovies)
                c.wishlistedMovies = [];
              if(!c.ratedMovies)
                c.ratedMovies = [];
              if(!c.watchedMovies)
                c.watchedMovies = [];
              if(!c.following)
                c.following = [];
              if(!c.followers)
                c.followers = [];
            })
          this.topCustomer = this.allCustomers.sort((a,b) => (b.wishlistedMovies.length + b.ratedMovies.length + b.watchedMovies.length) - (a.wishlistedMovies.length + a.ratedMovies.length + a.watchedMovies.length))[0];
        })
    }
    //this.loading2 = false;
    // else
    // {
    //   this.loading = false
    // }
    ////console.log(this.customerService.getLoggedInCustomer())
    ////console.log(this.currentCustomer)

    this.allGenres = Object.keys(this.genreObj)
    this.allPlatforms = Object.keys(this.platformObj)
    ////console.log(this.allGenres)
    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.allMovies = o; 
      this.loading = false;
      this.loading2 = false;
     
      if(this.loggedIn)
      {
        setTimeout(()=>{
          this.buildPersonalisedContentForLoggedInCustomer()
        },1000)
          

          this.buildNotYetWatchedMovies()
          this.buildRecommendedMoviesFromTMDB()
    
        
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

      var fakearr2 :FMovie[] = [];
      fakearr2.push(this.corouselWishlistedMovie)
      ////console.log(arr)
      if(fakearr2[0])
      {
        if(localStorage.getItem("today-wish") && localStorage.getItem("date") == moment().format("DD/MM/YYYY") && this.currentCustomer.wishlistedMovies.includes(localStorage.getItem("today-wish")) && false)
        {
          ////console.log("inside");
          var wish = localStorage.getItem("today-wish")
          var mov = this.allMovies.find(x => x.key === wish);
          this.corouselWishlistedMovie = this.allMovies.find(x => x.key === wish);
          var fakearr3 = [];
          fakearr3.push(mov);
          ////console.log(fakearr3)
          this.corouselWishlistedMovieD = this.movieDisplayService.prepareDisplayMovieList(fakearr3)[0]; 
          if(this.corouselWishlistedMovieD)
          {
            this.corouselWishlistedMovieBool = true;
          }
        }
        else
        {
          localStorage.setItem("today-wish",fakearr2[0].key)
          this.corouselWishlistedMovieD = this.movieDisplayService.prepareDisplayMovieList(fakearr2)[0]; 
          //console.log(this.corouselWishlistedMovieD)
          if(this.corouselWishlistedMovieD)
          {
            this.corouselWishlistedMovieBool = true;
          }
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
        localStorage.setItem("todayMovie",JSON.stringify(this.todayMovieD))

        //here add this todaymovieD obj to storage check from storage and render data until it loads.
      }

      
      //this.getMovieListsFromDb();
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
      //uncomment below code if location based movies doesn't work and remove or condition in below if actual if condition : if(this.locationAccess)
      // if(navigator.geolocation)
      //   this.locationAccess = true;
      // else
      //   this.locationAccess = false;
      if(this.locationAccess || !this.locationAccess)
      {
        this.buildMovieSuggestionBasedOnLocation()
      }      
    });
    //this.buildeditorChoiceMovieListForDisplay()

  }

  searchMovieUrl : string = 'https://api.themoviedb.org/3/search/movie?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US&page=1&include_adult=false&query='

  findMovieUrl : string = 'https://api.themoviedb.org/3/movie/'
  //add movie Id between these two
  findMovieUrlPart2 : string = '?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US'

  recommendedMoviesUrl : string = 'https://api.themoviedb.org/3/movie/'
  recommendedMoviesUrlPart2 : string = '/recommendations?api_key=ae139cfa4ee9bda14d6e3d7bea092f66'
  
  spotLightMovie

  recommendationsBool : boolean = false;

  buildRecommendedMoviesFromTMDB()
  {
    if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.length>0)
    {
      var shuffledWatchedMovies = this.shuffleArr(this.currentCustomer.watchedMovies);
      this.spotLightMovie = this.allMovies.find(x => x.key === shuffledWatchedMovies[0])
      //console.log(this.spotLightMovie.title)
      var foundMovieID : string = '';
      this.http.get(this.searchMovieUrl+this.spotLightMovie.title).toPromise()
      .then(res => {
        ////console.log(res);
        for(let i=0;i<res['results'].length;i++)
        {
          // if(this.spotLightMovie.title === res['results'][i]['title'])
          if(this.spotLightMovie.title === res['results'][i]['title'])
          {
            foundMovieID = res['results'][i]['id'];
            ////console.log(res['results'][i])
            break;
          }
        }
        if(foundMovieID === "")
        {
          //console.log("movie not found");
          this.recommendationsBool = false;
        }
        else{
          this.recommendationsBool = true;
          this.getRecommendedMoviesFromTMDB(foundMovieID)
        }
      })
    }

  }

  getRecommendedMoviesFromTMDB(id)
  {
    var imagesPath : string = 'https://image.tmdb.org/t/p/w500'
    if(id !== '' && id !== null)
    {
      this.http.get(this.recommendedMoviesUrl+id+this.recommendedMoviesUrlPart2).toPromise()
      .then(res => {
        //console.log(res);
        if(res['results'].length<=2)
        {
          this.recommendationsBool = false
          //console.log(res['results'].length<=2)
        }
        for(let i=0;i<res['results'].length;i++)
        {
          this.recommendedMovieTitles.push({ 
            "title" : res['results'][i]['title'], 
            "id" : res['results'][i]['id'],
            "imageUrl" : imagesPath+res['results'][i]["poster_path"]
          })
          //murari
          if(this.recommendedMovieTitles.length>=10)
          {
            ////console.log(this.recommendedMovieTitles);
            break;
          }
        }
      })
    }

  }

  goToRecommendedMovieImdb(id,title)
  {
    var link = "https://www.imdb.com/title/"
    var movFromOurDb = this.allMovies.find(x => x.title === title)
    if(movFromOurDb && movFromOurDb !== null)
    {
      this.router.navigateByUrl('/movie/'+movFromOurDb.key)
    }
    else
    {
      this.router.navigateByUrl('/extmovie/'+id);
      // this.http.get(this.findMovieUrl+id+this.findMovieUrlPart2).toPromise()
      // .then(res => {
      //   //console.log("imdb forward")
      //   //console.log(res);
      //   var go = confirm(title+" is not available on our Database, redirecting you to external site.You want to go?")
      //   if(go)
      //   {
      //     window.location.href = link+res['imdb_id'];
      //   }
        
      // })
    }  
  }

  recommendedMovieTitles = [];

  shuffleArr (array) : any[]
  {
    if(array.length && array.length == 0)
    {
      return [];
    }
    else
    {
      for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
      }
    return array;
    }
    
  }

  trendingMovies : any[] = [];

  BuildTrendingMoviesFromTMDB()
  {
    var url = 'https://api.themoviedb.org/3/trending/movie/week?api_key=ae139cfa4ee9bda14d6e3d7bea092f66';
    var imagesPath : string = 'https://image.tmdb.org/t/p/w500'
    this.http.get(url).toPromise()
    .then(res => {
      //console.log(res)
      for(let i=0;i<res['results'].length;i++)
      {
        //console.log(res['results'][i])
        this.trendingMovies.push({
          'title' : res['results'][i]['title'],
          'releasedYear' : res['results'][i]['release_date'],
          'imageUrl' : imagesPath+res['results'][i]['poster_path'],
          'language' : res['results'][i]['original_language'],
          'id' : res['results'][i]['id']       
        })
      }
      //console.log(this.trendingMovies)
      
    })
  }

  buildNotYetWatchedMovies()
  {
    var allkeys : string[] = [];
    
    this.allMovies.forEach(element => {
      allkeys.push(element.key)
    });

    var notWatched = allkeys;
    //var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,false,true,false,false);

    if(this.currentCustomer.watchedMovies)
    {
      notWatched = notWatched.filter( ( el ) => !this.currentCustomer.watchedMovies.includes( el ) );
      var notWatchedMovies = [];

      notWatched.forEach(element => {
        ////console.log(allMoviesFromDb.find(a => a.key===element))        
        notWatchedMovies.push(this.allMovies.find(a => a.key===element));
      });
      this.moviesNotYetWatchedDisplay = this.movieDisplayService.prepareDisplayMovieList(notWatchedMovies,true,false,false,false);
      if(this.moviesNotYetWatchedDisplay.length>0)
      {
        this.NotYetWatchedBool = true;
      }
    }
    else
    {
      this.moviesNotYetWatchedDisplay = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,true,false,false,false);
    }
    
    
    ////console.log(this.moviesNotYetWatchedDisplay)
  }

  buildPersonalisedContentForLoggedInCustomer()
  {
    this.loading = false;
    var i=0;
    var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,false,true,false,false);
    var personalisedMovies = []
    //console.log(this.currentCustomer.preferredGenre)
    //console.log()
    var watched = this.currentCustomer.watchedMovies;
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
    //console.log(personalisedMovies);

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

    //console.log("here")

    //this.personalisedMoviesDisplay.filter(x => watched.includes(x.key))
    //console.log(this.personalisedMoviesDisplay);
    
    if(this.personalisedMoviesDisplay.length<10)
    {
      var randomNum;

      for(randomNum = 20;randomNum< allDisplayMovies.length;randomNum = randomNum+3)
      {
        //loadconsole.log(allDisplayMovies[randomNum])
        // this.currentCustomer.preferredLanguages.forEach(element => {
        //   if(element.search(allDisplayMovies[randomNum].language) != -1)
        //   {
        //     this.personalisedMoviesDisplay.push(allDisplayMovies[randomNum])
        //   }
        // });
        //if(this.currentCustomer.preferredLanguages.includes(allDisplayMovies[randomNum].language))
        this.personalisedMoviesDisplay.push(allDisplayMovies[randomNum])
          
        if(this.personalisedMoviesDisplay.length>20)
          break;
      }
    }

    //get any random movie for corousel
    var shuffledpersonalisedmovies = [];
    if(this.personalisedMoviesDisplay.length>0)
    {

    }
    shuffledpersonalisedmovies = this.shuffleArr(this.personalisedMoviesDisplay)
    //console.log(this.personalisedMoviesDisplay)
    this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[0];
    //console.log(this.corouselPersonalisedMovieD)
    if(this.todayMovieD && this.corouselWishlistedMovieD && this.todayMovieD.key === this.corouselPersonalisedMovieD.key)
    {
      this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[1];
    }
    //murari
    if(localStorage.getItem("today-personal") && localStorage.getItem("date") == moment().format("DD/MM/YYYY") && false)
    {
      ////console.log("inside 2");
      var personal = localStorage.getItem("today-personal")
      var mov = this.allMovies.find(x => x.key === personal);
      this.corouselPersonalisedMovie = this.allMovies.find(x => x.key === personal);
      var fakearr3 = [];
      fakearr3.push(mov);
      ////console.log(fakearr3)
      this.corouselPersonalisedMovieD = this.movieDisplayService.prepareDisplayMovieList(fakearr3)[0]; 
      if(this.corouselPersonalisedMovieD)
      {
        this.corouselPersonalisedMovieBool = true;
      }
    }
    else
    {
      this.corouselPersonalisedMovieD = shuffledpersonalisedmovies[0];
      localStorage.setItem("today-personal",this.corouselPersonalisedMovieD.key)
      if(this.corouselPersonalisedMovieD)
      {
        this.corouselPersonalisedMovieBool = true;
      }
    }

    if(this.corouselPersonalisedMovieD)
    {
      this.corouselPersonalisedMovieBool = true;
    }
  }

  showPosition(position) {
    ////console.log(position)
    this.latitude = position.coords["latitude"]
    this.longitude = position.coords["longitude"];
    ////console.log(this.latitude+","+this.longitude)
  }

  buildMovieSuggestionBasedOnLocation()
  {
    var telugu : boolean = false;
    var tamil : boolean = false;
    var malayalam : boolean = false;
    var kannada : boolean = false;
    var english : boolean = false; 
    //uncomment below code if location based movies doesn't work
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    //   this.locationAccess = true;
    //   ////console.log(this.latitude+","+this.longitude)
    // } else { 
    //   this.locationAccess = false;
    //   alert("Location access is needed to suggest movies based on location, Its not mandatory to give location access to us.")
    // }
    this.locationAccess = true;
    this.http.get(this.APIforState+"latitude="+this.latitude+"&longitude="+this.longitude+"&localityLanguage=en").toPromise()
          .then(a => {
            ////console.log(a)
            if(a["principalSubdivision"] == "Karnataka")
            {
              telugu = true;
              kannada = true;
            }
            else if(a["principalSubdivision"] == "Tamil Nadu")
            {
              tamil = true;
            }
            else if(a["principalSubdivision"] == "Andhra Pradesh" || a["principalSubdivision"] == "Telangana")
            {
              telugu = true;
            }
            else if(a["principalSubdivision"] == "Kerala")
            {
              malayalam = true;
            }
            else
            {
              english = true;
            }

            var allmovies2 = [];
            this.allMovies.forEach(element => {
              if(telugu)
              {
                this.locationPreferreLanguage = "Telugu"
                if(element.language.telugu == true)
                  allmovies2.push(element)
              }
              else if(tamil)
              {
                this.locationPreferreLanguage = "Tamil"
                if(element.language.tamil == true)
                  allmovies2.push(element)
              }
              else if(malayalam)
              {
                this.locationPreferreLanguage = "Malayalam"
                if(element.language.malayalam == true)
                  allmovies2.push(element)
              }
              else if(english)
              {
                this.locationPreferreLanguage = "English"
                if(element.language.english == true)
                  allmovies2.push(element)
              }
              if(kannada)
              {
                this.locationPreferreLanguage = "Telugu, Kannada not supported in this version"
              }              
            });

            this.locationBasedMovies = this.movieDisplayService.prepareDisplayMovieList(allmovies2,true,false,false,false)
            ////console.log(this.locationBasedMovies)

          })
          .catch(() => {
              //console.log("location access denied user can't get location based content")
          });
  }

  buildRecentlySuggestedMovieList()
  {
    var allmovies2 = [];
    //this.sortedArray.length = 0;
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

    //store this array in storage and load this until data loads 
    localStorage.setItem("recently",JSON.stringify(this.sortedArray));
  }

  buildProperDate(str : string) :string
  {
    var dateArray = str.split("/");
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
      this.buildeditorChoiceMovieListForDisplay()
    })
  }

  buildeditorChoiceMovieListForDisplay()
  {
    this.editorsChoice = this.listDisplayService.BuildMovieListForDisplay(this.homePageList.listsToIncludeInHomePage,this.allMovies);
    localStorage.setItem("editorchoiceList",JSON.stringify(this.editorsChoice));
  }

  GoToGenre(str:string)
  {
    this.router.navigateByUrl('/all?genre='+str.trim().toLocaleLowerCase())
  }

  GoToPlatform(str:string)
  {
    this.router.navigateByUrl('/all?ott='+str.trim().toLocaleLowerCase())
  }

  GoToMovie(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  GoToMovieHref(key)
  {
    if(this.loading2)
    {
      alert("please wait while data is loading its one time process")
    }
    else
    {
      window.location.href = '/movie/'+key
    }
  }

  launchModal(key)
  {
    //document.querySelector(".exampleModalCenter").on()
  }

  addMovieToWishlist(key)
  {
    if(this.loggedIn)
    {
      //console.log(key)
      var wishlisted = []
      this.wishlistedMovies.push(key)
      wishlisted.push(key)
      if(!this.currentCustomer.wishlistedMovies)
      {
        //console.log("new");
        this.currentCustomer.wishlistedMovies = wishlisted;
      }
      else
      {
        this.currentCustomer.wishlistedMovies.push(key);
      }
      ////console.log(this.currentCustomer)
      this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
      var feeditm : FeedItem = new FeedItem();
      feeditm.content = this.currentCustomer.name + " added "+this.allMovies.find(x=>x.key == key).title + " to their wishlist . Click to view the movie."
      feeditm.customerName = this.currentCustomer.name;
      feeditm.customerUid = this.currentCustomer.uid;
      feeditm.photoUrl = this.currentCustomer.customerPhotoUrl;
      feeditm.url = '/movie/'+this.allMovies.find(x=>x.key == key).key;
      feeditm.type = 'WISHLIST';
      this.customerService.addFeedItem(feeditm);
    }
    else
    {
      this.loginModalBool = true;
      alert("Sorry!, You should Login to use Wishlisted feature.")
    }
    
  }

  loginModalBool : boolean = false;

  removeFromWishlist(key)
  {
    //console.log(this.currentCustomer.wishlistedMovies)
    if(this.currentCustomer.wishlistedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.wishlistedMovies.length; i++)
      {     
        if (this.currentCustomer.wishlistedMovies[i] == key) 
        {   
          this.currentCustomer.wishlistedMovies.splice(i, 1); 
        }
      }
      //console.log(this.currentCustomer.wishlistedMovies)
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer);
    }
  }

  addToWatchedMovies(key)
  {
    if(!this.loggedIn)
    {
      alert("Sorry!, You should Login to add Movie to Watched List. Based on your watched movies we will suggest recommended movie.");
      return;
    }
    this.watchedMovies.push(key)
    if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.length >1)
    {
      this.currentCustomer.watchedMovies.push(key);

    }
    else
    {
      var arr :string[] = [];
      arr.push(key);
      this.currentCustomer.watchedMovies = arr;
    }
    if(this.currentCustomer.watchedMovies)
    {
      this.buildNotYetWatchedMovies()
    }
    
    // if(this.moviesNotYetWatchedKeys.includes(key))
    // {
    //   for( var i = 0; i < this.moviesNotYetWatchedDisplay.length; i++)
    //   {     
    //     if (this.moviesNotYetWatchedDisplay[i].key == key) 
    //     {   
    //       this.moviesNotYetWatchedDisplay.splice(i, 1); 
    //     }
    //   }
    // }

    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
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
    if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.watchedMovies.length; i++)
      {     
        if (this.currentCustomer.watchedMovies[i] == key) 
        {   
          this.currentCustomer.watchedMovies.splice(i, 1); 
        }
      }
        this.buildNotYetWatchedMovies()
      
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
    }

  }

  startRateMovie(key)
  {
    this.MovieToBeRated = this.allMovies.find(o => o.key ===key)
    var str = "https://www.youtube.com/embed/"+this.MovieToBeRated.ytTrailerLink.slice(32,)
          //add below line to above str to have autoplay feature
          //+"?autoplay=1";
          // //console.log(this.actualMovieEmbedTrailer);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(str)
    //this.safeSrc= ""
    ////console.log(this.MovieToBeRated);
  }

  rateMovie(key)
  {
    this.MovieToBeRated.rating = Number(this.MovieToBeRated.rating) + Number(this.rating);
    var movieKey = this.MovieToBeRated.key
    delete this.MovieToBeRated.key
    this.movieService.updateMovie(movieKey,this.MovieToBeRated)
    var ratedMovieLocal : RatedMovies = new RatedMovies();
    var arr = [];
    ratedMovieLocal.movieId = key;
    ratedMovieLocal.rating = Number(this.rating)
    if(!this.currentCustomer.ratedMovies)
    {
      arr.push(ratedMovieLocal)
      this.currentCustomer.ratedMovies = arr
    }
    else
    {
      this.currentCustomer.ratedMovies.push(ratedMovieLocal)
    }
    ////console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
  }

  gotolist(key)
  {
    this.router.navigateByUrl('/list/'+key);
  }

  quickViewDisplay : DisplayMovie;

  startQuickView(key)
  {
    console.log("quick view started")
    this.quickViewMovie = this.allMovies.find(x => x.key === key);
    var tariler = "https://www.youtube.com/embed/"+this.quickViewMovie.ytTrailerLink.slice(32,)
          //add below line to above str to have autoplay feature
          //+"?autoplay=1";
          // //console.log(this.actualMovieEmbedTrailer);
    this.quickViewSafeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tariler)
    this.quickViewDisplay = this.movieDisplayService.prepareDisplayMovieSingle(this.quickViewMovie);
    ////console.log(JSON.stringify(this.quickViewMovie));
    // //console.log(this.quickViewMovie.language)
    // //console.log(this.quickViewMovie.movieGenre)
    // //console.log(this.quickViewMovie.availableIn)
    // const player = new window['YT'].Player('ytplayer')
    // //console.log(player);
    //window.onYouTubeIframeAPIReady
  }

  closeQuickView()
  {

    this.quickViewedMovies.push(this.quickViewMovie);
    var tariler = "https://www.youtube.com/embed/"+this.quickViewMovie.ytTrailerLink.slice(32,)
    this.quickViewSafeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tariler)
    //console.log(this.quickViewMovie.visitedCount);
    //console.log(this.quickViewSafeSrc);
  }

  quickViewedMovies : FMovie[] = [];


  GoToMovieExternalSiteQuickView()
  {
    if(!this.quickViewMovie['ottLink'] || this.quickViewMovie["ottLink"] == "")
    {
      alert("Sorry External Site link un-available for "+this.quickViewMovie.title+". We are working on this, we will update External site link soon. You can Find "+this.quickViewMovie.title+" in "+this.quickViewDisplay.availableIn)
    }
    else
    {
      window.location.href = this.quickViewMovie["ottLink"];
    }
    
  }

  GoToMovieExternalSite(key)
  {
    var link = this.allMovies.find(x => x.key === key).ottLink
    var mov = this.allMovies.find(x => x.key === key)
    var movD = this.movieDisplayService.prepareDisplayMovieSingle(mov);
    if(mov)
    {
      window.location.href = link;
    }
    else
    {
      alert("Sorry External Site link un-available for "+mov.title+". We are working on this, we will update External site link soon. You can Find "+mov.title+" in "+movD.availableIn)
    }
    
  }

  tips : string[] = [
    "If you don't like dark mode please log a complaint <a href='/complaint' style='color: #007BFF;'>here</a>. We will revert back to light mode (original state).",
    "Go To <a href='/profile' style='color: #007BFF;'>Profile</a> page and you can create custom movie lists and share them to your friends.",
    "Edit your personalisation <a href='/personalisation' style='color: #007BFF;'>here</a> to see personalised content unique for you.",
    "Search for your desired movie <a href='/all' style='color: #007BFF;'>here</a>, you can search with movie name, cast, key words,release year,genre etc. You can also use our filters.",
    "Check out <a href='/news-feed' style='color: #007BFF;'>feed</a> section for a random movie generator.",  
    "Please check out MovieBuff Board our kind of leaderboard in <a href='/board' style='color: #007BFF;'>MovieBuff Board</a> section inside Suggesto.",
    "You can check out 'Wishlisted Movies','Watched Movies' and 'Rated Movies' in <a href='/profile' style='color: #007BFF;'>Profile</a> section.",
    "Login to use full potential of Suggesto. You are only using 60% of features as a logged out user.",
    "You can know more about Suggesto in <a href='/aboutus' style='color: #007BFF;'>About Suggesto</a> section.",
    "If Something goes wrong click refresh icon in the header."
  ]

  tip :SafeHtml;

  randomTip()
  {
    var content = this.shuffleArr(this.tips)[1];
    this.tip = this.sanitizer.bypassSecurityTrustHtml(content)
  }

  tipVisible : boolean = true;

  allFriends : FollowObject[] = [];
  allFriendsOriginal : FollowObject[] = [];

  shareWindowBool : boolean = false;
  movieToBeShared : DisplayMovie = new DisplayMovie();

  //sharing movie with friends.
  sendObj : SharedMovie = new SharedMovie();

  startSharedWindow(mve)
  {
    this.shareWindowBool = true;
    this.movieToBeShared = mve;
    //console.log(mve)
  }

  sendMovie(friend : FollowObject,mve : DisplayMovie)
  {
    mve = this.movieToBeShared;
    for( var i = 0; i < this.allFriends.length; i++)
    {     
      if (this.allFriends[i].followerUserId == friend.followerUserId) 
      {   
        this.allFriends.splice(i, 1); 
      }
    }
    console.log(this.allFriends)
    console.log(friend.followerUserId);
    this.sendObj.movieName = mve.title;
    this.sendObj.movieKey = mve.key;
    this.sendObj.movieImageUrl = mve.smallImageUrl;
    this.sendObj.language = mve.language;
    this.sendObj.genre = mve.genre;
    this.sendObj.platform = mve.availableIn;
    this.sendObj.receiverUid = friend.followerUserId;
    this.sendObj.senderName = this.currentCustomer.name;
    this.sendObj.senderPhotoUrl = this.currentCustomer.customerPhotoUrl;
    this.sendObj.senderUid = this.currentCustomer.uid;
    this.messageService.createMessage(this.sendObj);
    console.log(this.sendObj);
  }

  //when shared window is closed, reset friends list
  closedShareWindow()
  {
    if(this.loggedIn)
    {
      console.log("close")
      this.allFriends.length = 0;
      var friends :FollowObject[] = this.currentCustomer.followers.concat(this.currentCustomer.following);
      // this.allFriends.filter((v,i,a)=>a.findIndex(t=>(t.followerUserId === v.followerUserId))===i)
      this.allFriends = Array.from(new Set(friends.map(a => a.followerUserId)))
        .map(id => {
          return friends.find(a => a.followerUserId === id)
        })
      this.sendObj = new SharedMovie();
      this.shareWindowBool = false
      this.movieToBeShared = new DisplayMovie();
      //this.allFriends = this.allFriendsOriginal;
    }
    else
    {
      this.shareWindowBool = false
    }

  }

}
