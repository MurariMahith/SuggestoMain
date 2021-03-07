import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from 'src/app/models/FMovie';
import { MovieList } from 'src/app/models/MovieList';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { MovieListService } from 'src/app/services/movie-list.service';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { Router,Params, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  allMovieLists : MovieList[] = [];
  allMovies : FMovie[] = [];  

  MovieListsForView : DisplayMovieList[] = [];

  constructor(private movieService : MovieServiceService,private listService : MovieListService,private router : Router) { }

  ngOnInit() {

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o)
      this.allMovies = o;
      this.xyz();      
    })    

  }

  xyz()
  {
    this.listService.getAllMovieLists().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o)
      this.allMovieLists = o;
      this.BuildMovieListForDisplay(this.allMovieLists);
      console.log(this.MovieListsForView)
    })
  }

  BuildMovieListForDisplay(lst : MovieList[])
  {
    lst.forEach(o => {
      var obj = new DisplayMovieList();
      var movieListForDisplay : FMovie[] = []
      obj.listName = o.listName;
      obj.key = o["key"]
      o.moviesInThisList.forEach(element => {
        console.log(this.allMovies.find(a => a.key===element))        
        movieListForDisplay.push(this.allMovies.find(a => a.key===element));
      });
      console.log(movieListForDisplay);
      obj.moviesInList = this.prepareDisplayMovieList(movieListForDisplay); 
      this.MovieListsForView.push(obj);     
    });
  }

  prepareDisplayMovieList(arr : FMovie[]) : DisplayMovie[]
  {
    var MovieListForDisplay2 : DisplayMovie[] = [];
    console.log(arr)
    arr.forEach(o => {
      var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      if(o.language.english)
        obj.language += 'English, '
      if(o.language.telugu)
        obj.language += 'Telugu, '
      if(o.language.tamil)
        obj.language += 'Tamil, '
      if(o.language.malayalam)
        obj.language += 'Malayalam, '
      if(o.language.kannada)
        obj.language += 'Kannada, '
      for(var key in o.movieGenre)
      {
        if(o.movieGenre[key])
          obj.genre += key +','
      }
      MovieListForDisplay2.push(obj);    
    });

    return MovieListForDisplay2;
  }

  GoToEditList(key)
  {
    console.log(key)
    this.router.navigateByUrl('/editList/'+key)
  }

}
