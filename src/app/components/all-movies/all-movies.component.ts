import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss']
})
export class AllMoviesComponent implements OnInit {

  allMovies : FMovie[] = [];

  DisplayMovieList : DisplayMovie[] = [];

  constructor(private movieService : MovieServiceService,private router : Router) { }

  ngOnInit() {

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o);
      this.allMovies = o;
      console.log(this.allMovies[0].language)
      this.prepareDisplayMovieList(this.allMovies)
      //this.prepareDisplayMovieList(this.allMovies)
      console.log(this.DisplayMovieList)
    })


  }

  prepareDisplayMovieList(array : FMovie[])
  {
    //var DisplayMovieArray : DisplayMovie[] = [];
    array.forEach(o => {
      var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.key = o.key;
      obj.rating = o.rating;
      if(o.language.english)
        obj.language += ' English'
      if(o.language.telugu)
        obj.language += ' Telugu'
      if(o.language.tamil)
        obj.language += ' Tamil'
      if(o.language.malayalam)
        obj.language += ' Malayalam'
      if(o.language.kannada)
        obj.language += ' Kannada'
      for(var key in o.movieGenre)
      {
        if(o.movieGenre[key])
          obj.genre += key +','
      }
      this.DisplayMovieList.push(obj);    
    });
    //sorting display movie array in descending order based on rating
    this.DisplayMovieList.sort((a, b) => {
      return b.rating - a.rating;
  });
    //return DisplayMovieArray;
  }

  GoToEditMovie(key)
  {
    console.log(key)
    this.router.navigateByUrl('add/'+key)
  }

}
