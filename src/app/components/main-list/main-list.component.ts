import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from '../../models/FMovie'
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { MovieListService } from 'src/app/services/movie-list.service';
import { AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import { Router, Params, ActivatedRoute } from '@angular/router';
import {Inject} from '@angular/core';
import { MovieList } from 'src/app/models/MovieList';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomerService } from 'src/app/services/customerService';
import { Customer } from 'src/app/models/Customer';
import { RatedMovies } from 'src/app/models/Customer Related/RatedMovies';
import { DisplayListService } from 'src/app/services/display-list.service';
import { HomePageListsService } from 'src/app/services/home-page-lists.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/authService';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {

  allMovies : FMovie[] = [];

  allMovieLists : MovieList[] = [];

  ListForDisplay : DisplayMovieList = new DisplayMovieList();

  isMobile : boolean = false;

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    private customerService : CustomerService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }

    if(!this.activatedRoute.snapshot.params.key)
    {
      this.router.navigateByUrl('/movielist')
    }

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o)
      this.allMovies = o;
      this.xyz();      
    }) 

  }

  xyz()
  {
    this.listService.getAllMovieLists().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      console.log(o)
      this.allMovieLists = o;
      var tempList = [];
      var listKey = this.activatedRoute.snapshot.params.key;
      for(let i=0;i<this.allMovieLists.length;i++)
      {
        if(this.allMovieLists[i]['key'] === listKey)
        {
          tempList.push(this.allMovieLists[i]); 
          break;         
        }
      }
      this.ListForDisplay = this.listDisplayService.BuildMovieListForDisplay(tempList,this.allMovies)[0]
    })
  }

}
