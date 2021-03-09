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
  //DisplayMovieListOriginal2 : DisplayMovie[] = [];
  allTitles2 = new Object();
  searchResults = [];
  advancedSearch : boolean = true;
  allMovieYears : string[] = [];
  allGenres : string[] =[];
  allLanguages : string[] = [];

  noMoviesSearch : boolean = false;

  searchString : string = "";

  yearsToIncludeInSort : string[] = [];
  genresToIncludeInSort : string[] = []; 
  languagesToIncludeInSort : string[] = []; 

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
      
      this.DisplayMovieList = this.prepareDisplayMovieList(this.allMovies)
      this.DisplayMovieListOriginal = this.prepareDisplayMovieList(this.allMovies)
    })


  }

  prepareDisplayMovieList(arr : FMovie[]) : DisplayMovie[]
  {
    var DisplayMovieArray : DisplayMovie[] = [];
    arr.forEach(o => {
      var obj = new DisplayMovie()
      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.key = o.key;
      obj.rating = o.rating;
      obj.cast = o.cast.join(",")
      obj.subTags = o.subTags.join(",")

      for(var key in o.language)
      {
        this.allLanguages.push(key);
        if(o.language[key])
          obj.language += this.capitalizeFirstLetter(key) +','
      }
      for(var key in o.movieGenre)
      {
        this.allGenres.push(key);
        if(o.movieGenre[key])
          obj.genre += key +','
      }      
      DisplayMovieArray.push(obj);  
      //this.DisplayMovieListOriginal.push(obj);  
      //this.DisplayMovieListOriginal2.push(obj);  
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
    var uniqueLanguages = new Set(this.allLanguages);
    this.allLanguages = Array.from(uniqueLanguages);
    return DisplayMovieArray;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  GoToMovie(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  searching(event)
  {    
    event = event.trim().toLocaleLowerCase();
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
          this.DisplayMovieList.push(mov);
        }
        if(mov.releaseYear.trim().toLocaleLowerCase().search(event) != -1)
        {
          this.DisplayMovieList.push(mov)
        }         
        if(mov.cast.trim().toLocaleLowerCase().search(event) != -1)
        {
          this.DisplayMovieList.push(mov)
        } 
        var castBool = mov.subTags.trim().toLocaleLowerCase().search(event) != -1
        if(castBool)
        {
          this.DisplayMovieList.push(mov)
          console.log(mov.title);
        }
      });
    }    
    var uniqueDisplayMovies = new Set(this.DisplayMovieList)
    this.DisplayMovieList = Array.from(uniqueDisplayMovies);
    console.log(this.DisplayMovieList);
    if(this.DisplayMovieList.length === 0)
    {
      console.log("no movies based on your search criteria")
      this.noMoviesSearch = true;
    }
    else
    {
      this.noMoviesSearch = false;
    }
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

  addGenreToSort(str)
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

  addLanguageToSort(str)
  {
    if(document.getElementById(str).classList.contains("btn-secondary"))
    {
      document.getElementById(str).classList.remove("btn-secondary")
      document.getElementById(str).classList.add("btn-success")
      this.languagesToIncludeInSort.push(str.trim().toLocaleLowerCase());
    }
    else
    {
      document.getElementById(str).classList.add("btn-secondary")
      document.getElementById(str).classList.remove("btn-success")
      for( var i = 0; i < this.languagesToIncludeInSort.length; i++)
      {     
        if (this.languagesToIncludeInSort[i] === str.trim().toLocaleLowerCase()) 
        {   
          this.languagesToIncludeInSort.splice(i, 1); 
        }
      }
    }
    this.sortAccordingToGenreAndYear();
  }

  sortAccordingToGenreAndYear()
  {
    console.log("years")
    console.log(this.yearsToIncludeInSort);
    console.log("genres")
    console.log(this.genresToIncludeInSort);
    console.log("languages")
    console.log(this.languagesToIncludeInSort);
    
    if(this.yearsToIncludeInSort.length === 0 && this.genresToIncludeInSort.length === 0) 
    {
      console.log("0 & 0")
      // document.getElementById("navbarDropdownG").classList.remove("active")
      // document.getElementById("navbarDropdownY").classList.remove("active")
      this.DisplayMovieList = this.DisplayMovieListOriginal;
    }
    else
    {
      this.DisplayMovieList.length =0;
      //sorting genres
      if(this.genresToIncludeInSort.length === 0)
      {
        this.DisplayMovieList = this.DisplayMovieListOriginal;
      }
      else
      {
        //document.getElementById("navbarDropdownG").classList.add("active")
        console.log(this.DisplayMovieListOriginal.length);
        if(this.DisplayMovieListOriginal.length ===0)
        {
          this.DisplayMovieListOriginal = this.prepareDisplayMovieList(this.allMovies);
        }
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

      if(this.yearsToIncludeInSort.length !== 0)
      {
        //document.getElementById("navbarDropdownY").classList.add("active")
        var fakeVar = this.DisplayMovieList;
        this.DisplayMovieList = fakeVar.filter(o =>
        {
          if(this.yearsToIncludeInSort.includes(o.releaseYear))
          {
            return true;
          }
        });
      }
      //years done
      //this.sortAccordingToLanguage()
      console.log("qwertyuiopoiuytrewqwertyuiopoiuytrertyuiooiuyt")
      console.log(this.DisplayMovieList);
    }  
    this.sortAccordingToLanguage() 
  }

  sortAccordingToLanguage()
  {
    var newDisplayArray = [];
    if(this.languagesToIncludeInSort.length != 0)
    {

      const fakeVar2 : DisplayMovie[] = this.DisplayMovieList;

      console.log(this.DisplayMovieList.length)

      for(let i=0;i<this.DisplayMovieList.length;i++)
      {
        
        var languagesForMovie = this.DisplayMovieList[i].language.trim().toLocaleLowerCase().split(',')        
        languagesForMovie.forEach(element => {
          if(this.languagesToIncludeInSort.includes(element))
          {
            console.log(element+this.DisplayMovieList[i].title)
            newDisplayArray.push(this.DisplayMovieList[i])
          } 
        });
      }

      console.log(this.DisplayMovieList)
      console.log(newDisplayArray)
      this.DisplayMovieList = newDisplayArray
    }
    else
    {
      console.log("no language filter selected")
    }
    if(this.DisplayMovieList.length === 0)
    {
      this.noMoviesSearch = true;
    }
    else
    {
      this.noMoviesSearch = false;
    }
  }

  resetGenreFilter()
  {
    this.allGenres.forEach(element => {
      if(document.getElementById(element).classList.contains("btn-success"))
      {
        document.getElementById(element).classList.remove("btn-success")
        document.getElementById(element).classList.add("btn-secondary")
      }
    });
    this.genresToIncludeInSort.length = 0
    this.sortAccordingToGenreAndYear()
  }
  resetYearFilter()
  {
    this.allMovieYears.forEach(element => {
      if(document.getElementById(element).classList.contains("btn-success"))
      {
        document.getElementById(element).classList.remove("btn-success")
        document.getElementById(element).classList.add("btn-secondary")
      }
    });
    this.yearsToIncludeInSort.length = 0
    this.sortAccordingToGenreAndYear()
  }
  resetLanguageFilter()
  {
    this.allLanguages.forEach(element => {
      if(document.getElementById(element).classList.contains("btn-success"))
      {
        document.getElementById(element).classList.remove("btn-success")
        document.getElementById(element).classList.add("btn-secondary")
      }
    });
    this.languagesToIncludeInSort.length = 0
    this.sortAccordingToGenreAndYear()
  }

}
