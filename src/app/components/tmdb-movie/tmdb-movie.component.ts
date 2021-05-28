import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tmdb-movie',
  templateUrl: './tmdb-movie.component.html',
  styleUrls: ['./tmdb-movie.component.scss']
})
export class TmdbMovieComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private http : HttpClient,private location: Location) { }

  movieDetailsUrl : string = 'https://api.themoviedb.org/3/movie/'
  movieDetailsUrlPart2 : string = '?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US'

  moreAboutMovie : string = 'https://www.google.com/search?q='

  actualMovie : DisplayMovie = new DisplayMovie();

  ngOnInit(): void {

    var movieKey = this.activatedRoute.snapshot.params.key;

    this.http.get(this.movieDetailsUrl+movieKey+this.movieDetailsUrlPart2).toPromise()
    .then(res =>
      {
        console.log(res);
        this.actualMovie.title = res['title'];
        this.actualMovie.language = res['original_language']
        this.actualMovie.ottLink = res['homepage'];
        this.actualMovie.description = res['overview'];
        this.actualMovie.smallImageUrl = 'https://image.tmdb.org/t/p/w500'+res['poster_path'];
        this.actualMovie.releaseYear = res['release_date'];
        this.actualMovie.runTime = res['runtime'];
        this.actualMovie.bigImageUrl = 'https://image.tmdb.org/t/p/w500'+res['backdrop_path']
        for(let i=0;i<res['genres'].length;i++)
        {
          this.actualMovie.genre += " "+res['genres'][i]['name']
        }
        console.log(this.actualMovie.description)
      }
    )

  }

  MoreAboutMovie()
  {
    window.location.href = this.moreAboutMovie+this.actualMovie.title+" movie";
  }

}
