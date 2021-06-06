import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Hits } from './../models/Hits'
import { DailyHits } from './../models/Hits'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedMovie } from '../models/SharedMovie';


@Injectable({
  providedIn: 'root'
})
export class HitsService {

  private dbPath = '/hits';
  private dailyHitsDbPath = '/dailyHits';
  private messagesDbPath = '/messages';

  hitsRef: AngularFireList<Hits> = null;
  dailyhitsRef: AngularFireList<DailyHits> = null;
  messagesRef: AngularFireList<SharedMovie> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.hitsRef = db.list(this.dbPath);
    this.dailyhitsRef = db.list(this.dailyHitsDbPath)
    this.messagesRef = db.list(this.messagesDbPath);
  }

  getAllDailyHits(): AngularFireList<DailyHits>
  {
    return this.dailyhitsRef;
  }
  createDailyHits(dailyHit : DailyHits) : void
  {
    this.dailyhitsRef.push(dailyHit);
  }
  updateDailyHits(key: string, value: DailyHits)
  {
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    return this.dailyhitsRef.update(key, value);
  }


  getAllMessages(): AngularFireList<SharedMovie>
  {
    return this.messagesRef;
  }

  createMessage(msg : SharedMovie): void
  {
    this.messagesRef.push(msg);
  }

  updateMessage(key: string, value: SharedMovie)
  {
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    return this.messagesRef.update(key, value);
  }

  deleteMessage(key: string): Promise<void> {
    return this.messagesRef.remove(key);
  }

  getHits(): AngularFireList<Hits> {
    return this.hitsRef;
  }

  create(hit: Hits): void {
    this.hitsRef.push(hit);
  }

  updateCustomer(key: string, value: Hits): Promise<void> 
  {
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    return this.hitsRef.update(key, value);
  }
}
