import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Customer } from './../models/Customer'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FeedItem } from '../models/FeedItem';
import { UpcomingOtt } from '../models/UpcomingOtt';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbPath = '/customers';

  private feedItemdbpath = '/feeditems';

  private upcomingOttPath = '/upcomingOtt'

  customerRef: AngularFireList<Customer> = null;

  feedItemRef : AngularFireList<FeedItem> = null;

  ottRef : AngularFireList<UpcomingOtt> = null;

  constructor(private db: AngularFireDatabase, private feeddb : AngularFireDatabase) 
  { 
    this.customerRef = db.list(this.dbPath);
    this.feedItemRef = feeddb.list(this.feedItemdbpath);
    this.ottRef = db.list(this.upcomingOttPath);
  }

  getAllCustomers(): AngularFireList<any> {
    return this.customerRef;
  }

  deleteCustomer(key: string): Promise<void> {
    return this.customerRef.remove(key);
  }

  getAllOtt() : AngularFireList<any>
  {
    return this.ottRef;
  }

  createOtt(obj : UpcomingOtt):void 
  {
    this.ottRef.push(obj);
  }

  deletOtt(key: string): Promise<void> {
    return this.ottRef.remove(key);
  }

  getAllFeedItems(): AngularFireList<any>
  {
    return this.feedItemRef;
  }

  addFeedItem(item :FeedItem): void
  {
    //console.log(item);
    this.feedItemRef.push(item);
  }

  createCustomer(customer: Customer): void {
    this.customerRef.push(customer);;
  }

  updateCustomer(key: string, value: Customer): Promise<void> 
  {
    console.log(key)
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    // //console.log(value);
    // //console.log(key);
    if(value.wishlistedMovies)
    {
      value.wishlistedMovies = this.removeDuplicates(value.wishlistedMovies);
    }
    if(value.watchedMovies)
    {
      value.watchedMovies = this.removeDuplicates(value.watchedMovies);
    }
    ////console.log(this.removeDuplicateWishlistedMovies(value.wishlistedMovies));    
    ////console.log(value)
    for( var k in value)
    {
        if(value[k]=== undefined)
        {
          delete value[k];
        }
    }
    console.log(key)
    //console.log(value);
    return this.customerRef.update(key, value);
  }

  removeDuplicates(arr)
  {
    var uniqueArray
    uniqueArray = arr.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    })
    return uniqueArray;
  }

  getLoggedInCustomer() : Observable<Customer[]>
  {
    var uid : string = '';
    if(!(localStorage.getItem("uid") === null))
    {
      uid = localStorage.getItem("uid")
    }
    return this.customerRef
    .snapshotChanges().pipe(
        map(changes => 
            changes.map(c =>
                ({key: c.payload.key, ...c.payload.val() })
                )
            )
        )
        // .subscribe(o => 
        //     {
        //         //var uid = localStorage.getItem("uid");
        //         this.currentCustomer = o.filter(x => x.uid = uid)[0];
        //     })
  }

  checkCustomerInDb(uid :string) : Observable<Customer[]>
  {
    var bool : boolean;
    return this.customerRef.snapshotChanges().pipe(
        map(changes => 
          changes.map(c =>
              ({key: c.payload.key, ...c.payload.val() })
              )
          )
      );
  }

}
