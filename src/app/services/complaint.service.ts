import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Complaint } from './../models/Complaint'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private dbPath = '/complaints';

  hitsRef: AngularFireList<Complaint> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.hitsRef = db.list(this.dbPath);
  }

  getHits(): AngularFireList<Complaint> {
    return this.hitsRef;
  }

  create(complaint: Complaint): void {
    this.hitsRef.push(complaint);
  }

  updateCustomer(key: string, value: Complaint): Promise<void> 
  {
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    return this.hitsRef.update(key, value);
  }
}
