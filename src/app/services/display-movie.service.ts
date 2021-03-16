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

  prepareDisplayMovieList(allMoviesFromDb : FMovie[]) : DisplayMovie[]
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
      obj.key = o.key;
      obj.rating = o.rating;
      obj.ottLink = o.ottLink;
      obj.torrentDownloadLink = o.torrentDownloadLink;
      obj.torrentOnlineLink = o.torrentOnlineLink;
      obj.cast = o.cast.join(",")
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
      MovieListForDisplay.push(obj);    
    });
    //sorting display items based on rating
    MovieListForDisplay.sort((a, b) => {
        return b.rating - a.rating;
    });

    return MovieListForDisplay;
  }
}
