import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserSuggestedMovie } from '../models/UserSuggestedMovie';
import { Movie } from './../models/movie'

@Injectable({
  providedIn: 'root'
})
export class UserMovieSuggestService {

  private dbPath = '/userSuggestedMovies';

  userMovieRef: AngularFireList<UserSuggestedMovie> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.userMovieRef = db.list(this.dbPath);
  }

  getAllMovies(): AngularFireList<any> {
    return this.userMovieRef;
  }

  createUserSuggestedMovie(movie : UserSuggestedMovie)
  {
      this.userMovieRef.push(movie);
  }
}
