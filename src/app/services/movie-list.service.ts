import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { MovieList } from '../models/MovieList'

@Injectable({
  providedIn: 'root'
})
export class MovieListService {

  private dbPath = '/movieLists';
 
  movieListRef: AngularFireList<MovieList> = null;
 
  constructor(private db: AngularFireDatabase) {
    this.movieListRef = db.list(this.dbPath);
  }

  createMovieList(movieList: MovieList): void {
    this.movieListRef.push(movieList);
  }
 
  updateMovieList(key: string, value: any): Promise<void> {
    return this.movieListRef.update(key, value);
  }
 
  deleteMovieList(key: string): Promise<void> {
    return this.movieListRef.remove(key);
  }
 
  getAllMovieLists(): AngularFireList<MovieList> {
    return this.movieListRef;
  }
 
  deleteAllMovieLists(): Promise<void> {
    return this.movieListRef.remove();
  }
}
