import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FMovie } from '../models/Fmovie';
import { DisplayMovie } from '../models/DisplayMovie';
import { MovieList } from '../models/MovieList'

@Injectable({
  providedIn: 'root'
})
export class DisplayMovieService {

  prepareDisplayMovieList(allMoviesFromDb : FMovie[],sort = true,random = false,sortYearDesc = false,sortYearAsc = false,sortVisitedCountDesc = false) : DisplayMovie[]
  {
    var MovieListForDisplay : DisplayMovie[] = [];
    //console.log(allMoviesFromDb)
    allMoviesFromDb.forEach(o => {
      var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.suggestedDate = o.suggestedDate;
      obj.description = o.description;
      obj.key = o.key;
      obj.rating = o.rating;
      obj.ottLink = o.ottLink;
      obj.torrentDownloadLink = o.torrentDownloadLink;
      obj.torrentOnlineLink = o.torrentOnlineLink;
      obj.runTime = o.runTime;
      obj.visitedCount = o.visitedCount;

      for(const p in o.availableIn)
      {
        if(o.availableIn[p])
        {
          obj.ott[p] = o.availableIn[p];
          break;
        }
      }

      // obj.ott.Netflix = o.availableIn.Netflix;
      // obj.ott.Aha = o.availableIn.Aha;
      // obj.ott.Hotstar = o.availableIn.Hotstar;
      // obj.ott.JioCinema = o.availableIn.JioCinema;
      // obj.ott.Prime_Video = o.availableIn.Prime_Video;
      // obj.ott.Sony_Liv = o.availableIn.Sony_Liv;
      // obj.ott.Sun_Next = o.availableIn.Sun_Next;
      // obj.ott.Youtube = o.availableIn.Youtube;
      // obj.ott.Zee5 = o.availableIn.Zee5
      obj.cast = o.cast.join(",")
      obj.cast = obj.cast + " etc.,."
      obj.subTags = o.subTags.join(",")
      if(o.language.english)
        obj.language += 'English, '
      if(o.language.telugu)
        obj.language += 'Telugu, '
      if(o.language.tamil)
        obj.language += 'Tamil, '
      if(o.language.malayalam)
        obj.language += 'Malayalam, '
      if(o.language.kannada)
        obj.language += 'Kannada, '
      for(var key in o.movieGenre)
      {
        if(o.movieGenre[key])
          obj.genre += key +','
      }

      for(var key in o.availableIn)
      {
        if(o.availableIn[key])
          obj.availableIn += key +','
      }

      MovieListForDisplay.push(obj);    
    });
    //sorting display items based on rating
    if(sort)
    {
      MovieListForDisplay.sort((a, b) => {
        return b.rating - a.rating;
    });
    }

    //console.log(random)
    
    //randomising display array items
    if(random)
    {
      MovieListForDisplay = this.shuffleArr(MovieListForDisplay);
    }

    //sorting based on release year descending order
    if(sortYearDesc)
    {
      MovieListForDisplay.sort((a, b) => {
        return Number(b.releaseYear) - Number(a.releaseYear);
      });
    }

    //sorting based on release year ascending order
    if(sortYearDesc)
    {
      MovieListForDisplay.sort((a, b) => {
        return Number(a.releaseYear) - Number(b.releaseYear);
      });
      MovieListForDisplay.sort((a, b) => {
        return Number(b.visitedCount) - Number(a.visitedCount);
      });
    }

    if(sortVisitedCountDesc)
    {
      MovieListForDisplay.sort((a, b) => {
        return Number(b.visitedCount) - Number(a.visitedCount);
      });
    }
    

    return MovieListForDisplay;
  }

  shuffleArr (array) : any[]
  {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
    return array;
  }


  prepareDisplayMovieSingle(o :FMovie) :DisplayMovie
  {
    var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.suggestedDate = o.suggestedDate;
      obj.description = o.description;
      obj.key = o.key;
      obj.rating = o.rating;
      obj.ottLink = o.ottLink;
      obj.torrentDownloadLink = o.torrentDownloadLink;
      obj.torrentOnlineLink = o.torrentOnlineLink;
      obj.runTime = o.runTime;
      obj.cast = o.cast.join(",")
      obj.cast = obj.cast + " etc.,."
      obj.ott.Netflix = o.availableIn.Netflix;
      obj.ott.Aha = o.availableIn.Aha;
      obj.ott.Hotstar = o.availableIn.Hotstar;
      obj.ott.JioCinema = o.availableIn.JioCinema;
      obj.ott.Prime_Video = o.availableIn.Prime_Video;
      obj.ott.Sony_Liv = o.availableIn.Sony_Liv;
      obj.ott.Sun_Next = o.availableIn.Sun_Next;
      obj.ott.Youtube = o.availableIn.Youtube;
      obj.ott.Zee5 = o.availableIn.Zee5
      obj.subTags = o.subTags.join(",")
      if(o.language.english)
        obj.language += 'English, '
      if(o.language.telugu)
        obj.language += 'Telugu, '
      if(o.language.tamil)
        obj.language += 'Tamil, '
      if(o.language.malayalam)
        obj.language += 'Malayalam, '
      if(o.language.kannada)
        obj.language += 'Kannada, '
      for(var key in o.movieGenre)
      {
        if(o.movieGenre[key])
          obj.genre += key +','
      }

      for(var key in o.availableIn)
      {
        if(o.availableIn[key])
          obj.availableIn += key +','
      }

      return obj;

  }
}
