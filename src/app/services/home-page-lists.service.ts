import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { HomePageLists } from '../models/HomePageLists'

@Injectable({
  providedIn: 'root'
})
export class HomePageListsService {

  private dbPath = '/homePageLists';
 
  movieRef: AngularFireList<HomePageLists> = null;
 
  constructor(private db: AngularFireDatabase) {
    this.movieRef = db.list(this.dbPath);
  }
 
  create(movie: HomePageLists): void {
    this.movieRef.push(movie);
  }
 
  update(key: string, value: any): Promise<void> {
    return this.movieRef.update(key, value);
  }
 
  delete(key: string): Promise<void> {
    return this.movieRef.remove(key);
  }
 
  getAll() : AngularFireList<HomePageLists> {
    return this.movieRef;
  }
 
  deleteAll(): Promise<void> {
    return this.movieRef.remove();
  }
}

