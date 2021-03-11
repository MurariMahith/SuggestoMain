import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Movie } from './../models/movie'

@Injectable({
  providedIn: 'root'
})
export class MovieServiceService {

  private dbPath = '/engMovies';

  movieRef: AngularFireList<Movie> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.movieRef = db.list(this.dbPath);
  }

  getAllMovies(): AngularFireList<any> {
    return this.movieRef;
  }

  updateMovie(key: string, value: any): Promise<void> {
    return this.movieRef.update(key, value);
  }

}
