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

  constructor(private movieService : MovieServiceService, 
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private displaymovieservice : DisplayMovieService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {

    var movieKey = this.activatedRoute.snapshot.params.key;

    var prevRating = window.localStorage.getItem(movieKey);
    if(prevRating != null && window.localStorage)
    {
      this.eligibleForRating = false;
      this.rating = Number(prevRating);
    }

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
          console.log(m.ytTrailerLink);
          this.actualMovieEmbedTrailer = "https://www.youtube.com/embed/"+m.ytTrailerLink.slice(32,)
          //add below line to above str to have autoplay feature
          //+"?autoplay=1";
          console.log(this.actualMovieEmbedTrailer);
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.actualMovieEmbedTrailer)
          this.actualMovie = this.displaymovieservice.prepareDisplayMovieList(this.foundMovies)[0];
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
    window.localStorage.setItem(movieKey,""+this.rating);
    this.movieService.updateMovie(movieKey,ratedMovie)
    // .then(()=>alert("rating for "+ratedMovie.title+" is submitted. This will help us to suggest movies better."))
    // .catch(()=>alert("something went wrong, cannot submit rating, please contact admin or try agian later"))
    // window.location.reload();
    alert("Your rating for "+ratedMovie.title+" is successfully submitted.Thank you!")
  }

}
