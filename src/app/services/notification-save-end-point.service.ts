import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserSuggestedMovie } from '../models/UserSuggestedMovie';
import { Movie } from './../models/movie'

@Injectable({
  providedIn: 'root'
})
export class NotificationSaveEndPointService {

  private dbPath = '/endPointsDoNotDelete';

  endpointRef: AngularFireList<any> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.endpointRef = db.list(this.dbPath);
  }

  getAllMovies(): AngularFireList<any> {
    return this.endpointRef;
  }

  addEndPoint(obj : any)
  {
    console.log(obj);
    this.endpointRef.push(obj).then(o => console.log("endpoint updated"))
  }

}
