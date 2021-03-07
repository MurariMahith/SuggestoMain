import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FMovie } from '../models/Fmovie';
import { DisplayMovie } from '../models/DisplayMovie';
import { MovieList } from '../models/MovieList'
import { DisplayMovieList } from '../models/DisplayMovieList';
import { DisplayMovieService } from './display-movie.service';

@Injectable({
  providedIn: 'root'
})
export class DisplayListService {

    displaymovieservice = new DisplayMovieService();    
    //allMovies : FMovie[] = [];

    getAllMoviesFromdb()
    {

    }

    BuildMovieListForDisplay(allMovieListsFromDb : MovieList[],allMoviesFromDb : FMovie[]) : DisplayMovieList[]
    {
        var MovieListsForView : DisplayMovieList[] = [];
        allMovieListsFromDb.forEach(o => {
            var obj = new DisplayMovieList();
            var movieListForDisplay : FMovie[] = []
            obj.listName = o.listName;
            obj.key = o["key"]
            o.moviesInThisList.forEach(element => {
                console.log(allMoviesFromDb.find(a => a.key===element))        
                movieListForDisplay.push(allMoviesFromDb.find(a => a.key===element));
            });
            console.log(movieListForDisplay);
            obj.moviesInList = this.displaymovieservice.prepareDisplayMovieList(movieListForDisplay); 
            MovieListsForView.push(obj);            
        });
        return MovieListsForView;
    }

}
