import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { DisplayMovie } from '../models/DisplayMovie';
import { FMovie } from '../models/Fmovie';
import { CustomerService } from '../services/customerService';
import { DisplayMovieService } from '../services/display-movie.service';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  constructor(
    private customerService : CustomerService,
    private movieDisplayService : DisplayMovieService
    ) { }

  addToWatched(key:string, customer:Customer)
  {
    //console.log(customer.watchedMovies)
    if(customer.watchedMovies && customer.watchedMovies.length >1)
    {
      customer.watchedMovies.push(key);
    }
    else
    {
      var arr :string[] = [];
      arr.push(key);
      customer.watchedMovies = arr;
    }

    //update customer
    console.log("customer key from watched service: "+customer['key'])
    this.customerService.updateCustomer(customer['key'],customer)
  }

  removeFromWatched(key:string, customer:Customer)
  {
    //console.log(customer.watchedMovies)
    if(customer.watchedMovies && customer.watchedMovies.includes(key))
    {
      for( var i = 0; i < customer.watchedMovies.length; i++)
      {     
        if (customer.watchedMovies[i] == key) 
        {   
          customer.watchedMovies.splice(i, 1); 
        }
      }

      //update customer
      this.customerService.updateCustomer(customer['key'],customer)
    }
  }

  getAllWatchedMoviesByCustomer(customer : Customer,allMovies : FMovie[]) : DisplayMovie[]
  {
    if(customer.watchedMovies && customer.watchedMovies != undefined && customer.watchedMovies != null && customer.watchedMovies.length>0)
    {
      var watchedMovies :FMovie[] = [];
      allMovies.forEach(element => {
        if(customer.watchedMovies.includes(element.key))
        {
          watchedMovies.push(element);
        }
      });

      return this.movieDisplayService.prepareDisplayMovieList(watchedMovies)
    }
    else
    {
      return [];
    }

  }

}
