import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from '../../models/FMovie'
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { MovieListService } from 'src/app/services/movie-list.service';
import { AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import { Router, Params, ActivatedRoute } from '@angular/router';
import {Inject} from '@angular/core';
import { MovieList } from 'src/app/models/MovieList';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomerService } from 'src/app/services/customerService';
import { Customer } from 'src/app/models/Customer';
import { RatedMovies } from 'src/app/models/Customer Related/RatedMovies';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-movie',
  templateUrl: './main-movie.component.html',
  styleUrls: ['./main-movie.component.scss']
})
export class MainMovieComponent implements OnInit {

  allMovies : FMovie[] = [];
  foundMovies : FMovie[] = [];
  movieHere : FMovie;
  actualMovie : DisplayMovie = new DisplayMovie();
  actualMovieEmbedTrailer : string = '';
  safeSrc: SafeResourceUrl;
  loading : boolean = true;

  rating : number = 0;

  eligibleForRating : boolean = true;
  eligibleForWishList : boolean = true;
  eligibleForWatched : boolean = true;

  moreAboutMovie : string = 'https://www.google.com/search?q='

  currentCustomer : Customer;

  loggedIn : boolean = false;

  isMobile : boolean = false;

  constructor(private movieService : MovieServiceService, 
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private displaymovieservice : DisplayMovieService,
    private customerService : CustomerService,
    private http : HttpClient,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }

    var elmnt = document.getElementById("scrollhere");
    elmnt.scrollIntoView({ behavior: 'smooth'});

    var movieKey = this.activatedRoute.snapshot.params.key;

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            //console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
            }
            //console.log(this.currentCustomer) 
            if(this.currentCustomer)
            {
              this.loggedIn = true;
              ////console.log(this.currentCustomer.wishlistedMovies.includes(movieKey))
              if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(movieKey))
              {
                this.eligibleForWatched = false;
              }
              else
              {
                this.eligibleForWatched = true;
              }
              if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.includes(movieKey))
              {
                //console.log("here eligible is false")
                this.eligibleForWishList = false
                //console.log(this.eligibleForWishList);
              }
              else
              {
                //console.log("eligible is rtrue")
                this.eligibleForWishList = true;
                //console.log(this.eligibleForWishList);
              }
            }
            else
            {
              this.loggedIn = false;
              this.eligibleForWishList = false;
            }
            
            var prevRating;
            
            if(this.loggedIn && this.currentCustomer.ratedMovies)
            {
              this.currentCustomer.ratedMovies.forEach(element => {
                if(element.movieId === movieKey)
                {
                  prevRating = element.rating
                }
              });
            }
            else
            {              
            }
            
            if(prevRating != null && window.localStorage)
            {
              this.eligibleForRating = false;
              this.rating = Number(prevRating);
            }
          })
    }


    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.loading = false;
      //console.log(o);
      this.allMovies = o;
      if(this.activatedRoute.snapshot.params.key)
      {
        var movieKey = this.activatedRoute.snapshot.params.key
        var m = this.allMovies.find(o => o.key === movieKey)
        if(m)
        {
          // if(m.visitedCount)
          // {
          //   m.visitedCount = m.visitedCount+1;
          //   this.movieService.updateMovie(m.key,m);
          //   console.log(m)
          //   obs.unsubscribe();
          // }
          // else
          // {
          //   m.visitedCount = 1;
          //   this.movieService.updateMovie(m.key,m);
          //   //console.log(m)
          //   obs.unsubscribe();
          // }
          this.foundMovies.push(m);
          this.movieHere = m;
          //console.log(this.movieHere.availableIn.Aha)
          //console.log(m.ytTrailerLink);
          this.actualMovieEmbedTrailer = "https://www.youtube.com/embed/"+m.ytTrailerLink.slice(32,)
          //add below line to above str to have autoplay feature
          //+"?autoplay=1";
          // console.log(this.actualMovieEmbedTrailer);
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.actualMovieEmbedTrailer)
          this.actualMovie = this.displaymovieservice.prepareDisplayMovieList(this.foundMovies)[0];
          this.findSimilarMovies()
          //console.log(this.actualMovie)
          if(!this.loggedIn)
          {
            //console.log(movieKey)
            //console.log(window.localStorage.getItem(movieKey))
            //console.log(localStorage.getItem("loggedIn"))
            //console.log(window.localStorage.getItem(movieKey))
            var prevRating = window.localStorage.getItem(movieKey);
            if(prevRating != null && window.localStorage)
            {
              this.eligibleForRating = false;
              this.rating = Number(prevRating);
            }
          }
        }
        else
        {
          this.router.navigateByUrl('/home')
        }
          
      }
    })
  }

  ngOnDestroy()
  {
    var movieKey = this.activatedRoute.snapshot.params.key;
    var m = this.allMovies.find(o => o.key === movieKey)
    if(m)
    {
      if(m.visitedCount)
      {
        m.visitedCount = m.visitedCount+1;
        this.movieService.updateMovie(m.key,m);
        //console.log(m)
      }
      else
      {
        m.visitedCount = 1;
        this.movieService.updateMovie(m.key,m);
        //console.log(m)
      }
    }
  }

  GoToMovieExternalSite()
  {
    if(!this.actualMovie.ottLink || this.actualMovie.ottLink == "")
    {
      alert("Sorry External Site link un-available for "+this.actualMovie.title+". We are working on this, we will update External site link soon. You can Find "+this.actualMovie.title+" in "+this.actualMovie.availableIn)
    }
    else
    {
      if(localStorage.getItem("ottalert") == "true")
      {
        window.location.href = this.actualMovie.ottLink;
      }
      else
      {
        alert("Please Sign In into your OTT platforms in your chrome browser to automatically see movies when navigated from our app. This is one time process.")
        localStorage.setItem("ottalert","true");
        window.location.href = this.actualMovie.ottLink;
      }
      
    }
    
  }

  MoreAboutMovie()
  {
    window.location.href = this.moreAboutMovie+this.actualMovie.title+" movie";
  }

  trailer()
  {
    
    if(this.isMobile)
    {
      document.getElementById("trailer-mobile").scrollIntoView({ behavior: "smooth",block: "center"})
      document.getElementById("trailer-mobile").style.border = "5px solid white";
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "3px solid white";},200)
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "none";},400)
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "3px solid white";},600)
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "none";},800)
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "3px solid white";},1000)
      setTimeout(()=>{document.getElementById("trailer-mobile").style.border = "none";},1200)
    }
    else
    {
      document.getElementById("yt-trailermm").scrollIntoView({ behavior: "smooth",block: "center"})
    }
  }

  rateMovie(key :string)
  {
    var movieKey = this.activatedRoute.snapshot.params.key
    var ratedMovie = this.foundMovies[0];
    delete ratedMovie.key;
    if(this.rating === 0)
    {
      alert("You must give rating before clicking submit.")
      return;
    }

    ratedMovie.rating = Number(ratedMovie.rating) + Number(this.rating);
    //console.log(Number("10")+Number("20"))
    // console.log(ratedMovie);
    //window.localStorage.setItem(movieKey,""+this.rating);
    this.movieService.updateMovie(movieKey,ratedMovie)
    if(!this.loggedIn)
    {
      window.localStorage.setItem(movieKey,""+this.rating);
    }
    // .then(()=>alert("rating for "+ratedMovie.title+" is submitted. This will help us to suggest movies better."))
    // .catch(()=>alert("something went wrong, cannot submit rating, please contact admin or try agian later"))
    // window.location.reload();
    //alert("Your rating for "+ratedMovie.title+" is successfully submitted.Thank you!")

    if(this.loggedIn)
    {
      var ratedMovieLocal : RatedMovies = new RatedMovies();
      ;
      ratedMovieLocal.movieId = key;
      ratedMovieLocal.rating = Number(this.rating)
      if(this.currentCustomer.ratedMovies)
      {
        this.currentCustomer.ratedMovies.push(ratedMovieLocal)
      }
      else
      {
        var arr = [];
        arr.push(ratedMovieLocal)
        this.currentCustomer.ratedMovies = arr
      }
      //console.log(this.currentCustomer)
      this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    }
  }

  wishListMovie(key)
  {
    //console.log(this.currentCustomer)
    //console.log(key);
    if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.length >0)
    {
      this.currentCustomer.wishlistedMovies.push(key);
    }
    else
    {
      var arr :string[] = [];
      arr.push(key);
      this.currentCustomer.wishlistedMovies = arr;
    }
    //this.currentCustomer.wishlistedMovies.push(key);
    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer);
    //console.log(this.currentCustomer);
  }

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

    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer).then(() => this.eligibleForWatched = false)
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
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer).then(() => this.eligibleForWatched = true)
    }

  }

  searchMovieUrl : string = 'https://api.themoviedb.org/3/search/movie?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US&page=1&include_adult=false&query='

  findMovieUrl : string = 'https://api.themoviedb.org/3/movie/'
  //add movie Id between these two
  findMovieUrlPart2 : string = '?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US'

  recommendedMoviesUrl : string = 'https://api.themoviedb.org/3/movie/'
  recommendedMoviesUrlPart2 : string = '/recommendations?api_key=ae139cfa4ee9bda14d6e3d7bea092f66'

  foundMovieID : string = '';

  recommendationsBool : boolean = false;

  recommendedMovieTitles = [];
  similarTitles = [];

  findSimilarMovies()
  {
    this.http.get(this.searchMovieUrl+this.actualMovie.title).toPromise()
    .then(res => {
      for(let i=0;i<res['results'].length;i++)
      {
        // if(this.spotLightMovie.title === res['results'][i]['title'])
        if(this.actualMovie.title === res['results'][i]['title'])
        {
          this.foundMovieID = res['results'][i]['id'];
          break;
        }
      }
      if(this.foundMovieID === "")
      {
        //console.log("movie not found");
        this.recommendationsBool = false;
      }
      else{
        this.recommendationsBool = true;
        this.getRecommendedMoviesFromTMDB(this.foundMovieID)
      }
    })
  }

  getRecommendedMoviesFromTMDB(id)
  {
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
          this.recommendedMovieTitles.push({ "title" : res['results'][i]['title'], "id" : res['results'][i]['id']})
          if(this.recommendedMovieTitles.length>=10)
          {
            //console.log(this.recommendedMovieTitles);
            break;
          }
        }
        //console.log(this.recommendedMovieTitles);
      })
    }
  }

  goToRecommendedMovieImdb(id,title)
  {
    var link = "https://www.imdb.com/title/"
    var movFromOurDb = this.allMovies.find(x => x.title === title)
    //console.log(movFromOurDb);
    if(movFromOurDb && movFromOurDb !== null)
    {
      //this.router.navigate('/movie/'+movFromOurDb.key)
      window.location.href = '/movie/'+movFromOurDb.key
    }
    else
    {
      this.http.get(this.findMovieUrl+id+this.findMovieUrlPart2).toPromise()
      .then(res => {
        //console.log("imdb forward")
        //console.log(res);
        var go = confirm(title+" is not available on our Database, redirecting you to external site.You want to go?")
        if(go)
        {
          window.location.href = link+res['imdb_id'];
        }
        
      })
    }  
  }


}
