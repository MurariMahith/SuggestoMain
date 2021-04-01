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
  //lists for home page
  homePageList : HomePageLists = new HomePageLists();

  sortedArray : DisplayMovie[] = []

  allGenres : string[] = [];
  genreObj : Genre = new Genre();
  
  isMobile : boolean = false;

  APIforState = 'https://api.bigdatacloud.net/data/reverse-geocode-client?'


  latitude : string = '';
  longitude : string = '';
  locationAccess : boolean = false;
  locationPreferreLanguage : string = "";

  locationBasedMovies : DisplayMovie[] = [];

  currentCustomer : Customer;

  wishlistedMovies : string[] = [];
  ratedMoviesForThisCustomer : string[] = [];

  personalisedMoviesDisplay : DisplayMovie[] = [];

  loggedIn : boolean = false;

  MovieToBeRated : FMovie = new FMovie();
  rating : number = 0;

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private customerService : CustomerService
    ) { }

  ngOnInit() 
  {
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
            //console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loggedIn = true
            }
            if(this.currentCustomer.wishlistedMovies)
            {
              this.wishlistedMovies = this.currentCustomer.wishlistedMovies;
            }
            if(this.currentCustomer.ratedMovies)
            {
              this.currentCustomer.ratedMovies.forEach(element => {
                this.ratedMoviesForThisCustomer.push(element.movieId)
              });
            }
            console.log(this.currentCustomer)
            //console.log(this.loggedIn)
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
            //console.log(this.allMovies[x].imageUrl);
            this.corouselWishlistedMovie = this.allMovies[x];
        }
      }

      var fakearr2 = [];
      fakearr2.push(this.corouselWishlistedMovie)
      //console.log(arr)
      if(fakearr2[0])
      {
        this.corouselWishlistedMovieD = this.movieDisplayService.prepareDisplayMovieList(fakearr2)[0]; 
        if(this.corouselPersonalisedMovieD)
        {
          this.corouselWishlistedMovieBool = true;
        }
      }
      // console.log(shuffledwishlistedMoviesOfCustomer);
      // console.log(this.corouselPersonalisedMovie)
      
      this.loading = false;
      //console.log(o);
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
      //console.log(arr)
      if(arr[0])
      {
        this.todayMovieD = this.movieDisplayService.prepareDisplayMovieList(arr)[0]      
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
      //console.log(o)
      this.homePageList = o[0];
      //console.log(this.homePageList.listsToIncludeInHomePage)
      this.buildeditorChoiceMovieListForDisplay()
      this.buildRecentlySuggestedMovieList()
      if(navigator.geolocation)
        this.locationAccess = true;
      else
        this.locationAccess = false;
      if(this.locationAccess)
      {
        this.buildMovieSuggestionBasedOnLocation()
      }      
    });
    //this.buildeditorChoiceMovieListForDisplay()

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
    //console.log("inside")
    //console.log(this.currentCustomer)
    //console.log(this.allMovies)
    var i=0;
    var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(this.allMovies,false,true,false,false);
    var personalisedMovies = []
    allDisplayMovies.forEach(o => {

      var genresForMovie = o.genre.trim().split(',')
      //console.log(genresForMovie)
      
      genresForMovie.forEach(element => {

        //console.log(this.currentCustomer.preferredGenre.includes(element))
        //console.log(element)
        
        if(this.currentCustomer.preferredGenre && this.currentCustomer.preferredGenre.includes(element))
        {
          i=i+1;
          personalisedMovies.push(o)
        }

      });

    });
    //console.log(i)
    //console.log(personalisedMovies)
    var uniqueArray :DisplayMovie[] = personalisedMovies.filter(function(item, pos) {
      return personalisedMovies.indexOf(item) == pos;
    })
    // console.log(uniqueArray);
    this.personalisedMoviesDisplay = uniqueArray;
    var LanguageBasedPersonalisedMovies = [];
    uniqueArray.forEach(o => {
      this.currentCustomer.preferredLanguages.forEach(element => {
        //console.log(o.language.includes(element))
        if(o.language.includes(element))
        {
          LanguageBasedPersonalisedMovies.push(o)
        }
      });
    });
    // console.log(LanguageBasedPersonalisedMovies)
    // console.log(this.personalisedMoviesDisplay)
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
    //console.log(this.personalisedMoviesDisplay)
  }

  showPosition(position) {
    //console.log(position)
    this.latitude = position.coords["latitude"]
    this.longitude = position.coords["longitude"];
    //console.log(this.latitude+","+this.longitude)
  }

  buildMovieSuggestionBasedOnLocation()
  {
    var telugu : boolean = false;
    var tamil : boolean = false;
    var malayalam : boolean = false;
    var kannada : boolean = false;
    var english : boolean = false; 

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
      this.locationAccess = true;
      //console.log(this.latitude+","+this.longitude)
    } else { 
      this.locationAccess = false;
      alert("Location access is needed to suggest movies based on location, Its not mandatory to give location access to us.")
    }
    this.http.get(this.APIforState+"latitude="+this.latitude+"&longitude="+this.longitude+"&localityLanguage=en").toPromise()
          .then(a => {
            //console.log(a)
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
            //console.log(this.locationBasedMovies)

          })
          .catch(() => {
              console.log("location access denied user can't get location based content")
          });
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
    // console.log(this.sortedArray)

    this.sortedArray = _.orderBy(sortedArrayTS, (o: DisplayMovie) => {
      //console.log(moment(new Date(this.buildProperDate(o.suggestedDate))))
      return moment(new Date(this.buildProperDate(o.suggestedDate)))
    }, ['desc']);
    
    // this.sortedArray.forEach(element => {
    //   console.log(element.suggestedDate);
    // });
    
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

  addMovieToWishlist(key)
  {
    console.log(key)
    var wishlisted = []
    this.wishlistedMovies.push(key)
    wishlisted.push(key)
    if(!this.currentCustomer.wishlistedMovies)
    {
      console.log("new");
      this.currentCustomer.wishlistedMovies = wishlisted;
    }
    else
    {
      this.currentCustomer.wishlistedMovies.push(key);
    }
    //console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
  }

  startRateMovie(key)
  {
    this.MovieToBeRated = this.allMovies.find(o => o.key ===key)
    //console.log(this.MovieToBeRated);
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
    //console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
  }

  gotolist(key)
  {
    this.router.navigateByUrl('/list/'+key);
  }

}
