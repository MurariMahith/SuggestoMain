import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Customer } from './../models/Customer'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbPath = '/customers';

  customerRef: AngularFireList<Customer> = null;

  constructor(private db: AngularFireDatabase) 
  { 
    this.customerRef = db.list(this.dbPath);
  }

  getAllCustomers(): AngularFireList<any> {
    return this.customerRef;
  }

  createCustomer(customer: Customer): void {
    this.customerRef.push(customer);;
  }

  updateCustomer(key: string, value: Customer): Promise<void> 
  {
    if(value.hasOwnProperty('key'))
    {
        delete value["key"];
    }
    console.log(value);
    console.log(key);
    if(value.wishlistedMovies)
    {
      value.wishlistedMovies = this.removeDuplicates(value.wishlistedMovies);
    }
    if(value.watchedMovies)
    {
      value.watchedMovies = this.removeDuplicates(value.watchedMovies);
    }
    //console.log(this.removeDuplicateWishlistedMovies(value.wishlistedMovies));    
    console.log(value)
    for( var k in value)
    {
        if(value[k]=== undefined)
        {
          delete value[k];
        }
    }
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
