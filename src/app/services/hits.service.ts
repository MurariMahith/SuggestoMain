import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Hits } from './../models/Hits'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HitsService {

  private dbPath = '/hits';

  hitsRef: AngularFireList<Hits> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.hitsRef = db.list(this.dbPath);
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
