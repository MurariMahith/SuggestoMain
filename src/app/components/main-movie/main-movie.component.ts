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

  constructor(private movieService : MovieServiceService, 
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private displaymovieservice : DisplayMovieService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {

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
    window.location.href = this.actualMovie.movieLink;
  }

}
