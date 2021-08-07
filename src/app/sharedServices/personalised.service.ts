import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { RatedMovies } from '../models/Customer Related/RatedMovies';
import { FMovie } from '../models/Fmovie';
import { CustomerService } from '../services/customerService';
import { MovieServiceService } from '../services/movie-service.service';
import { DisplayMovieService } from '../services/display-movie.service';
import { DisplayMovie } from '../models/DisplayMovie';
import { WatchedService } from './watched.service';
import { ArrayHelperService } from '../services/array-helper.service';
import _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PersonalisedService {

  constructor(
    private customerService : CustomerService,
    private movieService : MovieServiceService,
    private movieDisplayService : DisplayMovieService,
    private watchedService : WatchedService,
    private arrayHelper : ArrayHelperService
    ) { }


    getPersonalisedMoviesForCustomer(
        allMovies : FMovie[], 
        customer : Customer, 
        allWatchedMovies : FMovie[] = [], 
        allwishListedMovies : FMovie[] = []
        ) :DisplayMovie[]
    {
        console.log("called personalised here")
        //variables
        var i =0;
        var personalisedMovies = []
        var LanguageBasedPersonalisedMovies = [];
        var watchedMoviesByCustomer : DisplayMovie[] = []

        //convert Fmovie to displayMovie
        var allDisplayMovies : DisplayMovie[] = this.movieDisplayService.prepareDisplayMovieList(allMovies,false,true,false,false);

        // movies based on genres
        personalisedMovies = this.getMoviesWithGenres(allDisplayMovies,customer.preferredGenre);

        //movies based on languages sorted from genre shortlist
        personalisedMovies.forEach(o => {
            customer.preferredLanguages.forEach(element => {
              if(o.language.includes(element))
              {
                LanguageBasedPersonalisedMovies.push(o)
              }
            });
        });

        //check if language based list is less than 15 do some more stuff
        if(LanguageBasedPersonalisedMovies.length < 15)
        {
            watchedMoviesByCustomer = this.watchedService.getAllWatchedMoviesByCustomer(customer,allMovies);
            //extract all genres from wached movies
            var genresFromWatchedMovies = []
            watchedMoviesByCustomer.forEach(m => {

                m.genre.split(" ").forEach(element => {
                    
                    genresFromWatchedMovies.push(element);

                });
                                
            });

            genresFromWatchedMovies = this.arrayHelper.removeDuplicates(genresFromWatchedMovies);

            LanguageBasedPersonalisedMovies.push(...this.getMoviesWithGenres(allDisplayMovies,genresFromWatchedMovies,true))
        }

        var uniqueArray :DisplayMovie[] = LanguageBasedPersonalisedMovies.filter(function(item, pos) {
            return LanguageBasedPersonalisedMovies.indexOf(item) == pos;
        })

        //if final movies length is less than 10 add random movies
        for(var randomNum = 20;randomNum< allDisplayMovies.length;randomNum = randomNum+3)
        {
            uniqueArray.push(allDisplayMovies[randomNum])
            
          if(uniqueArray.length >= 15)
            break;
        }

        return uniqueArray;
    }

    getMoviesWithGenres(allDisplayMovies : DisplayMovie[], genres : string[], addOnly : boolean = false) :DisplayMovie[]
    {
        var returnVar : DisplayMovie[] = [];
        var i = 0;
        
        allDisplayMovies.forEach(o => {

            var genresForMovie = o.genre.trim().split(' ')
            
            genresForMovie.forEach(element => {
              if(genres != undefined && genres !== null && genres.length > 0 && genres.includes(element))
              {
                i=i+1;
                returnVar.push(o);
              }      
            });      
        });

        if(addOnly && returnVar.length > 10)
        {
            returnVar = returnVar.slice(0,9)
        }

        return returnVar;
    }

    getRecentlySuggestedMoviesList(allMovies : FMovie[]) : DisplayMovie[]
    {
        var allmovies2 = [];
        var sortedArray : DisplayMovie[] = [];
        allMovies.forEach(element => {
          var newDate = this.buildProperDate(element.suggestedDate);       
            if(moment().startOf('day').isAfter(moment(new Date(newDate))))
            {
              allmovies2.push(element)
            }
        });
    
        var unsorted = this.movieDisplayService.prepareDisplayMovieList(allmovies2)
        sortedArray = _.orderBy(unsorted, (o: DisplayMovie) => {
          return moment(new Date(this.buildProperDate(o.suggestedDate)))
        }, ['desc']);

        return sortedArray;
    }

    buildProperDate(str : string) :string
    {
      var dateArray = str.split("/");
      return dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    }
}
