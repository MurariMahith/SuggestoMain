import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import * as moment from 'moment';
import { MovieListService } from 'src/app/services/movie-list.service';
import { MovieList } from 'src/app/models/MovieList';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { DisplayListService } from 'src/app/services/display-list.service';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';
import { Router } from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allMovies : Array<FMovie> = [];
  allMovieLists : Array<MovieList> = [];
  editorsChoice : DisplayMovieList[] = [];

  todayMovie : FMovie;
  //todayBooleanMovie is used to check whether tody we have suggested movie or not
  todayBooleanMovie : boolean = true;
  //loading boolean is for animations to view until our app fetches movies from db
  loading : boolean = true;


  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router
    ) { }

  ngOnInit() 
  {

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.allMovies = o;
      this.loading = false;
      console.log(o);
      for(let i=0;i<this.allMovies.length;i++)
      {
        var newDate = this.buildProperDate(this.allMovies[i].suggestedDate);       
        if(moment().startOf('day').isSame(moment(new Date(newDate))))
        {
          this.todayMovie = this.allMovies[i];
          this.todayBooleanMovie = false;
          break;
        }
      }
      this.getMovieListsFromDb();
    })

  }

  buildProperDate(str : string) :string
  {
    var dateArray = str.split("/");
    console.log(dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2])

    return dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  }

  getMovieListsFromDb()
  {
    this.listService.getAllMovieLists().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      this.allMovieLists = o;
      this.buildeditorChoiceMovieListForDisplay()
    })
  }

  buildeditorChoiceMovieListForDisplay()
  {
    var customMovieList = [];
    for (const lst of this.allMovieLists) {
      if(lst.listName === 'Avengers Series' || lst.listName === 'Mission Impossible series')
      {
        customMovieList.push(lst);
      }
    }
    this.editorsChoice = this.listDisplayService.BuildMovieListForDisplay(customMovieList,this.allMovies);
  }

  GoToMovie(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  launchModal(key)
  {
    //document.querySelector(".exampleModalCenter").on()
  }

}
