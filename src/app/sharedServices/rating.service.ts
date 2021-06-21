import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { RatedMovies } from '../models/Customer Related/RatedMovies';
import { FMovie } from '../models/Fmovie';
import { CustomerService } from '../services/customerService';
import { MovieServiceService } from '../services/movie-service.service';
import { DisplayMovieService } from '../services/display-movie.service';
import { DisplayMovie } from '../models/DisplayMovie';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    private customerService : CustomerService,
    private movieService : MovieServiceService,
    private movieDisplayService : DisplayMovieService
    ) { }

  rateMovie(movieKey : string, movie : FMovie, rating : number,customer : Customer,loggedIn : boolean)
  {
    //add rating to movie and update movie
    movie.rating = Number(movie.rating) + Number(rating);
    //var movieKey = movieKey
    delete movie.key
    this.movieService.updateMovie(movieKey,movie)

    if(loggedIn)
    {
      //add that movie key to customer ratedMovies array
      var ratedMovieLocal : RatedMovies = new RatedMovies();
      var arr = [];
      ratedMovieLocal.movieId = movieKey;
      ratedMovieLocal.rating = Number(rating)
      if(!customer.ratedMovies)
      {
        arr.push(ratedMovieLocal)
        customer.ratedMovies = arr
      }
      else
      {
        customer.ratedMovies.push(ratedMovieLocal)
      }
      this.customerService.updateCustomer(customer["key"],customer)
    }



  }

  getAllRatedMoviesByCustomer(customer : Customer,allMovies : FMovie[]) : DisplayMovie[]
  {
    if(customer.ratedMovies && customer.ratedMovies != undefined && customer.ratedMovies != null && customer.ratedMovies.length>0)
    {
      var ratedMovies :FMovie[] = [];
      
      allMovies.forEach(element => {

        customer.ratedMovies.forEach(x => {
          if(element.key === x.movieId)
          {
            element.rating = x.rating
            ratedMovies.push(element)
          }
        });
        
      });

      return this.customerService.removeDuplicates(this.movieDisplayService.prepareDisplayMovieList(ratedMovies))
    }
    else
    {
      return [];
    }
  }
}
