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

@Component({
  selector: 'app-main-movie',
  templateUrl: './main-movie.component.html',
  styleUrls: ['./main-movie.component.scss']
})
export class MainMovieComponent implements OnInit {

  allMovies : FMovie[] = [];
  foundMovies : FMovie[] = [];
  actualMovie : DisplayMovie = new DisplayMovie();
  actualMovieEmbedTrailer : string = '';
  safeSrc: SafeResourceUrl;
  loading : boolean = true;

  rating : number = 0;

  eligibleForRating : boolean = true;

  moreAboutMovie : string = 'https://www.google.com/search?q='

  currentCustomer : Customer;

  loggedIn : boolean = false;

  constructor(private movieService : MovieServiceService, 
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private displaymovieservice : DisplayMovieService,
    private customerService : CustomerService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {


    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
            }
            console.log(this.currentCustomer) 
            this.loggedIn = true;
            var prevRating;
            
            if(this.loggedIn)
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



    var movieKey = this.activatedRoute.snapshot.params.key;

    

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.loading = false;
      console.log(o);
      this.allMovies = o;
      if(this.activatedRoute.snapshot.params.key)
      {
        var movieKey = this.activatedRoute.snapshot.params.key
        var m = this.allMovies.find(o => o.key === movieKey)
        if(m)
        {
          this.foundMovies.push(m);
          //console.log(m.ytTrailerLink);
          this.actualMovieEmbedTrailer = "https://www.youtube.com/embed/"+m.ytTrailerLink.slice(32,)
          //add below line to above str to have autoplay feature
          //+"?autoplay=1";
          // console.log(this.actualMovieEmbedTrailer);
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.actualMovieEmbedTrailer)
          this.actualMovie = this.displaymovieservice.prepareDisplayMovieList(this.foundMovies)[0];
          if(!this.loggedIn)
          {
            console.log(movieKey)
            console.log(window.localStorage.getItem(movieKey))
            console.log(localStorage.getItem("loggedIn"))
            console.log(window.localStorage.getItem(movieKey))
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

  GoToMovieExternalSite()
  {
    window.location.href = this.actualMovie.ottLink;
  }

  MoreAboutMovie()
  {
    window.location.href = this.moreAboutMovie+this.actualMovie.title+" movie";
  }

  trailer()
  {
    document.getElementById("yt-trailermm").scrollIntoView({ behavior: "smooth",block: "center"})
  }

  rateMovie(key :string)
  {
    var movieKey = this.activatedRoute.snapshot.params.key
    var ratedMovie = this.foundMovies[0];
    delete ratedMovie.key;

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
    alert("Your rating for "+ratedMovie.title+" is successfully submitted.Thank you!")

    if(this.loggedIn)
    {
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
      console.log(this.currentCustomer)
      this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    }
  }

}
