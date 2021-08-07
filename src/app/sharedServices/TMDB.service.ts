import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { DisplayMovie } from '../models/DisplayMovie';
import { FMovie } from '../models/Fmovie';
import { CustomerService } from '../services/customerService';
import { DisplayMovieService } from '../services/display-movie.service';

@Injectable({
  providedIn: 'root'
})
export class TMDBService {

  constructor(
    private customerService : CustomerService,
    private movieDisplayService : DisplayMovieService
    ) { }

    searchMovieUrl : string = 'https://api.themoviedb.org/3/search/movie?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US&page=1&include_adult=false&query='

    findMovieUrl : string = 'https://api.themoviedb.org/3/movie/'
    //add movie Id between these two
    findMovieUrlPart2 : string = '?api_key=ae139cfa4ee9bda14d6e3d7bea092f66&language=en-US'
  
    recommendedMoviesUrl : string = 'https://api.themoviedb.org/3/movie/'
    recommendedMoviesUrlPart2 : string = '/recommendations?api_key=ae139cfa4ee9bda14d6e3d7bea092f66'

}
