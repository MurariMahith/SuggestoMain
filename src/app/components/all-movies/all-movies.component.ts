import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss']
})
export class AllMoviesComponent implements OnInit {

  allMovies : FMovie[] = [];

  DisplayMovieList : DisplayMovie[] = [];
  DisplayMovieListOriginal : DisplayMovie[] = [];
  allTitles2 = new Object();
  searchResults = [];
  advancedSearch : boolean = false;
  allMovieYears : string[] = [];
  allGenres : string[] =[];

  searchString : string = "";

  yearsToIncludeInSort : string[] = [];
  genresToIncludeInSort : string[] = [];  

  constructor(private movieService : MovieServiceService,private router : Router) { }

  ngOnInit() {

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      //console.log(o);
      this.allMovies = o;
      this.prepareDisplayMovieList(this.allMovies)
      //this.prepareDisplayMovieList(this.allMovies)
      // console.log(this.DisplayMovieList)
    })


  }

  prepareDisplayMovieList(arr : FMovie[])
  {
    //var DisplayMovieArray : DisplayMovie[] = [];
    arr.forEach(o => {
      var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.key = o.key;
      obj.rating = o.rating;
      if(o.language.english)
        obj.language += ' English'
      if(o.language.telugu)
        obj.language += ' Telugu'
      if(o.language.tamil)
        obj.language += ' Tamil'
      if(o.language.malayalam)
        obj.language += ' Malayalam'
      if(o.language.kannada)
        obj.language += ' Kannada'
      for(var key in o.movieGenre)
      {
        this.allGenres.push(key);
        if(o.movieGenre[key])
          obj.genre += key +','
      }
      this.DisplayMovieList.push(obj);  
      this.DisplayMovieListOriginal.push(obj);  
      this.allTitles2[o.title.trim().toLowerCase()] = o.key;
      this.allMovieYears.push(o.releaseYear);
    });
    //sorting display movie array in descending order based on rating
    this.DisplayMovieList.sort((a, b) => {
      return b.rating - a.rating;
  });

  var uniqueGenres = new Set(this.allGenres)
  this.allGenres = Array.from(uniqueGenres);
  var uniqueYears = new Set(this.allMovieYears)
  this.allMovieYears = Array.from(uniqueYears)
  }

  GoToMovie(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  searching(event)
  {    
    event = event.trim().toLowerCase();
    // console.log(event);
    this.searchResults.length = 0;    
    this.DisplayMovieList.length = 0;
    var titles = Object.keys(this.allTitles2);
    titles.forEach(element => {
      if(element.search(event) != -1)
      {
        element.search(event)
        this.DisplayMovieList.push(this.DisplayMovieListOriginal.find(o => o.key == this.allTitles2[element]))
        this.searchResults.push(element);     
      }
    });
    if(this.advancedSearch)
    {
      this.DisplayMovieListOriginal.forEach(mov => {
        if(mov.genre.trim().toLocaleLowerCase().search(event) != -1)
        {
          // console.log(mov)
          this.DisplayMovieList.push(mov);
        }
        if(mov.releaseYear.trim().toLocaleLowerCase().search(event) != -1)
        {
          // console.log(mov)
          this.DisplayMovieList.push(mov)
        }      
      });
    }    
    var uniqueDisplayMovies = new Set(this.DisplayMovieList)
    this.DisplayMovieList = Array.from(uniqueDisplayMovies);

  }

  addYearToSort(str)
  {    
    if(document.getElementById(str).classList.contains("btn-secondary"))
    {
      document.getElementById(str).classList.remove("btn-secondary")
      document.getElementById(str).classList.add("btn-success")
      this.yearsToIncludeInSort.push(str);
    }
    else
    {
      document.getElementById(str).classList.add("btn-secondary")
      document.getElementById(str).classList.remove("btn-success")
      for( var i = 0; i < this.yearsToIncludeInSort.length; i++)
      {     
        if (this.yearsToIncludeInSort[i] == str) 
        {   
          this.yearsToIncludeInSort.splice(i, 1); 
        }
      }
    }
    this.sortAccordingToGenreAndYear();
  }

  addGenreToSort(str :string)
  {
    if(document.getElementById(str).classList.contains("btn-secondary"))
    {
      document.getElementById(str).classList.remove("btn-secondary")
      document.getElementById(str).classList.add("btn-success")
      this.genresToIncludeInSort.push(str.trim().toLocaleLowerCase());
    }
    else
    {
      document.getElementById(str).classList.add("btn-secondary")
      document.getElementById(str).classList.remove("btn-success")
      for( var i = 0; i < this.genresToIncludeInSort.length; i++)
      {     
        //console.log(this.genresToIncludeInSort[i] === str.trim().toLocaleLowerCase())
        if (this.genresToIncludeInSort[i] === str.trim().toLocaleLowerCase()) 
        {   
          this.genresToIncludeInSort.splice(i, 1); 
        }
      }
    }
    this.sortAccordingToGenreAndYear();
  }

  

  sortAccordingToGenreAndYear()
  {
    // console.log("years")
    // console.log(this.yearsToIncludeInSort);
    // console.log("genres")
    // console.log(this.genresToIncludeInSort);
    if(this.yearsToIncludeInSort.length === 0 && this.genresToIncludeInSort.length === 0) 
    {
      //console.log("0 & 0")
      document.getElementById("navbarDropdownG").classList.remove("font-weight-bold")
      document.getElementById("navbarDropdownG").classList.remove("text-dark")
      document.getElementById("navbarDropdownY").classList.remove("font-weight-bold")
      document.getElementById("navbarDropdownY").classList.remove("text-dark")
      this.DisplayMovieList = this.DisplayMovieListOriginal;
    }
    else
    {
      this.DisplayMovieList.length =0;
      //sorting genres
      if(this.genresToIncludeInSort.length == 0)
      {
        this.DisplayMovieList = this.DisplayMovieListOriginal;
      }
      else
      {
        document.getElementById("navbarDropdownG").classList.add("font-weight-bold")
        document.getElementById("navbarDropdownG").classList.add("text-dark")
        this.DisplayMovieListOriginal.forEach(o => {
          var genresForMovie = o.genre.trim().toLocaleLowerCase().split(',')
          
          genresForMovie.forEach(element => {

            if(this.genresToIncludeInSort.includes(element))
            {
              this.DisplayMovieList.push(o);
            }
          });      
        })
      }      
      //genres done
      // console.log(this.DisplayMovieList.length)
      // console.log(this.yearsToIncludeInSort.length != 0)
      if(this.yearsToIncludeInSort.length != 0)
      {
        document.getElementById("navbarDropdownY").classList.add("font-weight-bold")
        document.getElementById("navbarDropdownY").classList.add("text-dark")
        var fakeVar = this.DisplayMovieList;
        //console.log(this.DisplayMovieList)
        this.DisplayMovieList = fakeVar.filter(o =>
        {
          if(this.yearsToIncludeInSort.includes(o.releaseYear))
          {
            return true;
          }
        });
      }

      //console.log(this.DisplayMovieList);
    }    
  }

}
