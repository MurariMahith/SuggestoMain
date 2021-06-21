import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { DisplayMovie } from '../models/DisplayMovie';
import { FMovie } from '../models/Fmovie';
import { CustomerService } from '../services/customerService';
import { DisplayMovieService } from '../services/display-movie.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private customerService : CustomerService,
    private movieDisplayService : DisplayMovieService
    ) { }

  addToWishlist(movieKey : string, customer : Customer)
  {
    //console.log(customer.wishlistedMovies)
    //add movie key to wishlist array of customer object
    //console.log(customer.wishlistedMovies)
    if(customer.wishlistedMovies == null || customer.wishlistedMovies == undefined || customer.wishlistedMovies.length==0)
    {
      var wishlisted = []
      wishlisted.push(movieKey)
      customer.wishlistedMovies = wishlisted;
    }
    else
    {
      customer.wishlistedMovies.push(movieKey);
    }
    console.log(customer)

    //update customer
    this.customerService.updateCustomer(customer["key"],customer).then(()=>console.log("success"))

    //add feed item.

  }

  removeFromWishlist(movieKey : string, customer : Customer)
  {
    //console.log(customer.wishlistedMovies)
    //remove movieKey from wishlist array of customer
    if(customer.wishlistedMovies && customer.wishlistedMovies != undefined && customer.wishlistedMovies.includes(movieKey))
    {
      for( var i = 0; i < customer.wishlistedMovies.length; i++)
      {     
        if (customer.wishlistedMovies[i] == movieKey) 
        {   
          customer.wishlistedMovies.splice(i, 1); 
        }
      }

      //update customer
      this.customerService.updateCustomer(customer['key'],customer);
    }
    else
    {
      console.log("Something wrong with customer")
    }
  }

  getAllWishlistedMoviesByCustomer(customer : Customer,allMovies : FMovie[]) : DisplayMovie[]
  {
    if(customer.wishlistedMovies && customer.wishlistedMovies != undefined && customer.wishlistedMovies != null && customer.wishlistedMovies.length>0)
    {
      var wishlistedMovies :FMovie[] = [];
      allMovies.forEach(element => {
        if(customer.wishlistedMovies.includes(element.key))
        {
          wishlistedMovies.push(element);
        }
      });

      return this.movieDisplayService.prepareDisplayMovieList(wishlistedMovies)
    }
    else
    {
      return [];
    }
  }

}
