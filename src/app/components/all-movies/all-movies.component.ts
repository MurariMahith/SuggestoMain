import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { FMovie } from 'src/app/models/Fmovie';
import { UserSuggestedMovie } from 'src/app/models/UserSuggestedMovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { UserMovieSuggestService } from 'src/app/services/user-movie-suggest.service';

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss']
})
export class AllMoviesComponent implements OnInit {

  allMovies : FMovie[] = [];

  DisplayMovieList : DisplayMovie[] = [];
  DisplayMovieListOriginal : DisplayMovie[] = [];
  DisplayMovieList2 : DisplayMovie[] = [];
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

  userMovie : UserSuggestedMovie = new UserSuggestedMovie();

  genreFromParam : string = '';
  langFromParam : string = '';

  filterSelected : boolean = false;

  isMobile : boolean = false;


  constructor(private movieService : MovieServiceService,
    private router : Router, 
    private userMovieService : UserMovieSuggestService,
    private activatedRote : ActivatedRoute
    ) { }

  ngOnInit() {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      console.log("mobile");
    }
    else{
      console.log("laptop")
    }

    this.genreFromParam = this.activatedRote.snapshot.queryParamMap.get('genre')
    this.langFromParam = this.activatedRote.snapshot.queryParamMap.get('lang')
    //console.log(genreFromParam + langFromParam)

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
      this.paramsBasedSort()

    })
  }

  paramsBasedSort()
  {
    //this.paramsort = true;
    if(this.genreFromParam && this.allGenres.includes(this.genreFromParam))
    {
      this.genresToIncludeInSort.push(this.genreFromParam.trim().toLocaleLowerCase());
      this.sortAccordingToGenreAndYear();
    }

    if(this.langFromParam && this.allGenres.includes(this.langFromParam))
    {
      this.languagesToIncludeInSort.push(this.langFromParam.trim().toLocaleLowerCase());
      this.sortAccordingToLanguage();
    }
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
      obj.ottLink = o.ottLink;
      obj.torrentOnlineLink = o.torrentOnlineLink;
      obj.torrentDownloadLink = o.torrentDownloadLink;
      obj.cast = o.cast.join(",")
      obj.subTags = o.subTags.join(",")
      obj.suggestedDate = o.suggestedDate;

      for(var key in o.language)
      {
        this.allLanguages.push(key);
        if(o.language[key])
          obj.language += this.capitalizeFirstLetter(key) +','
      }
      for(var key in o.movieGenre)
      {
        this.allGenres.push(key.trim().toLocaleLowerCase());
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
    //this.searchResults.length = 0;  
    const fakeVar = this.DisplayMovieList;  
    this.DisplayMovieList.length = 0;
    var titles = Object.keys(this.allTitles2);
    console.log(fakeVar.length)
    titles.forEach(element => {
      if(element.search(event) != -1)
      {
        element.search(event)
        this.DisplayMovieList.push(this.DisplayMovieListOriginal.find(o => o.key == this.allTitles2[element]))
        //this.searchResults.push(element);     
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
        if(mov.language.trim().toLocaleLowerCase().search(event) != -1)
        {
          this.DisplayMovieList.push(mov)
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
    this.filterSelected = true
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
    this.DisplayMovieList2 = this.DisplayMovieList;

    if(this.genresToIncludeInSort.length == 0 && this.yearsToIncludeInSort.length == 0 && this.languagesToIncludeInSort.length == 0)
    {
      this.filterSelected = false;
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

  resetAllFilters()
  {
    this.resetGenreFilter();
    this.resetLanguageFilter();
    this.resetYearFilter();
    this.filterSelected = false;
  }

  onSubmit()
  {
    this.userMovieService.createUserSuggestedMovie(this.userMovie)
    alert("Thank you for your suggestion, This will help us to suggest better movies.") 
    window.location.href="/all";
  }

}
