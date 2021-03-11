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
import { HomePageLists } from 'src/app/models/HomePageLists';
import { HomePageListsService } from 'src/app/services/home-page-lists.service';
import _ from 'lodash'
import { DisplayMovie } from 'src/app/models/DisplayMovie';

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
  //lists for home page
  homePageList : HomePageLists = new HomePageLists();

  sortedArray : DisplayMovie[] = []


  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService
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
      //this.getMovieListsFromDb();
    })
    this.homelistsservice.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o)
      this.homePageList = o[0];
      console.log(this.homePageList.listsToIncludeInHomePage)
      this.buildeditorChoiceMovieListForDisplay()
      this.buildRecentlySuggestedMovieList()
    });
    //this.buildeditorChoiceMovieListForDisplay()

  }

  buildRecentlySuggestedMovieList()
  {
    var allmovies2 = [];
    this.allMovies.forEach(element => {
      var newDate = this.buildProperDate(element.suggestedDate);       
        if(moment().startOf('day').isAfter(moment(new Date(newDate))))
        {
          allmovies2.push(element)
        }
    });
    // this.allMovies.sort((a,b) => {
    //   var date1 = this.buildProperDate(a.suggestedDate);
    //   var date2 = this.buildProperDate(b.suggestedDate);
    //   //return new moment(date1)
    // })
    var sortedArrayOriginal = _.orderBy(allmovies2, (o: FMovie) => {
      return moment(new Date(this.buildProperDate(o.suggestedDate)))
    }, ['desc']);
    this.sortedArray = this.movieDisplayService.prepareDisplayMovieList(sortedArrayOriginal)
    console.log(this.sortedArray)
    
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
    // var customMovieList = [];
    // for (const lst of this.allMovieLists) {
    //   if(lst.listName === 'Avengers Series' || lst.listName === 'Mission Impossible series')
    //   {
    //     customMovieList.push(lst);
    //   }
    // }
    this.editorsChoice = this.listDisplayService.BuildMovieListForDisplay(this.homePageList.listsToIncludeInHomePage,this.allMovies);
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
