import { Injectable } from '@angular/core';
import { DisplayMovie } from '../models/DisplayMovie';
import { FMovie } from '../models/Fmovie';

@Injectable({
  providedIn: 'root'
})
export class ArrayHelperService {

  constructor() { }

  removeDuplicates(arr)
  {
    var uniqueArray
    uniqueArray = arr.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    })
    return uniqueArray;
  }

  removeElementFromArray(arr,element)
  {
    for( var i = 0; i < arr.length; i++)
      {     
        if (arr[i] == element) 
        {   
          arr.splice(i, 1); 
        }
      }
    return arr;
  }

  shuffleArr (array) : any[]
  {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
    return array;
  }

  sortMovieBasedOnRating(arr : FMovie[])
  {
    arr.sort((a, b) => {
      return b.rating - a.rating;
    });
    return arr;
  }

  sortDisplayMovieBasedOnRating(arr : DisplayMovie[])
  {
    arr.sort((a, b) => {
      return b.rating - a.rating;
    });
    return arr;
  }




}
