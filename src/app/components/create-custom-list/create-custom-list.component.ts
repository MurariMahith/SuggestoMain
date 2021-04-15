import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieList } from 'src/app/models/MovieList';
import { MovieListService } from 'src/app/services/movie-list.service';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-custom-list',
  templateUrl: './create-custom-list.component.html',
  styleUrls: ['./create-custom-list.component.scss']
})
export class CreateCustomListComponent implements OnInit {

  newMovieList : MovieList = new MovieList();
  selectedMovies : FMovie[] = [];
  allMovies : FMovie[] = [];
  allMoviesOriginal : FMovie[] = [];

  allTitles2 = new Object();
  searchString : string = "";
  searchResults = [];
  searchResultsObjects = [];
  clicked : boolean = false;

  series : boolean = false;

  constructor(private movieService : MovieServiceService,private listService : MovieListService,private router : Router) { }

  ngOnInit(): void {

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o);
      this.allMovies = o;
      this.allMoviesOriginal =o;
      o.forEach(element => {        
        this.allTitles2[element.title.trim().toLowerCase()] = element.key
      });
    })
  }

  searching(event)
  {
    this.clicked = true;
    event = event.trim().toLowerCase();
    this.searchResults.length = 0;    
    this.searchResultsObjects.length = 0;
    this.allTitles2 = new Object();
    this.allMovies.forEach(element => {        
      this.allTitles2[element.title.trim().toLowerCase()] = element.key
    });
    var titles = Object.keys(this.allTitles2);
    // console.log(titles);
    titles.forEach(element => {
      if(element.search(event) != -1)
      {
        element.search(event)
        this.searchResultsObjects.push(this.allMovies.find(o => o.key == this.allTitles2[element]))
        this.searchResults.push(element)        
      }
    });
    // console.log(this.searchResults)
    // //console.log(this.searchResultsObjects)
  }

  addThisMovieToList(object)
  {
    // console.log(object);
    // console.log(this.allTitles2)
    this.selectedMovies.push(object);
    for( var i = 0; i < this.searchResultsObjects.length; i++)
    {     
      if ( this.searchResultsObjects[i] == object) 
      {   
        this.searchResultsObjects.splice(i, 1); 
      }
    } 
    for( var i = 0; i < this.allMovies.length; i++)
    {     
      if ( this.allMovies[i] == object) 
      {   
        this.allMovies.splice(i, 1); 
      }
    } 
    this.allTitles2 = new Object();
    this.allMovies.forEach(element => {        
      this.allTitles2[element.title.trim().toLowerCase()] = element.key
    });

    // console.log(this.selectedMovies)

  }

  removeThisMovieFromList(object)
  {
    console.log(object);
    this.allMovies.push(object);
    for( var i = 0; i < this.selectedMovies.length; i++)
    {     
      if ( this.selectedMovies[i] == object) 
      {   
        this.selectedMovies.splice(i, 1); 
      }
    }
    console.log(this.allMovies) 
  }

  onSubmit()
  {
    if(this.selectedMovies.length<3)
    {
      alert('You should select atleast 3 Movies to make a list.')
    }
    else
    {
      this.selectedMovies.forEach(element => {
        this.newMovieList.moviesInThisList.push(element.key)
      });
      this.newMovieList.createdBy = localStorage.getItem("uid");
      this.newMovieList.isThisSeries = this.series;
      console.log(this.newMovieList)
      this.listService.createMovieList(this.newMovieList);
      this.router.navigateByUrl('/profile')
    } 
  }

}
