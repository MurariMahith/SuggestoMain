import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Movie } from './../models/movie'

@Injectable({
  providedIn: 'root'
})
export class MovieServiceService {

  private dbPath = '/movies';

  movieRef: AngularFireList<Movie> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.movieRef = db.list(this.dbPath);
  }

  getMoviesList(): AngularFireList<any> {
    return this.movieRef;
  }

}
