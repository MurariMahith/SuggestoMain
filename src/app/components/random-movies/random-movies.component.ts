import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { FMovie } from 'src/app/models/Fmovie';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { MovieServiceService } from 'src/app/services/movie-service.service';

import * as Shake from './../../../../node_modules/shake.js'

@Component({
  selector: 'app-random-movies',
  templateUrl: './random-movies.component.html',
  styleUrls: ['./random-movies.component.scss']
})
export class RandomMoviesComponent implements OnInit {

  random4Movies : DisplayMovie[] = [];
  allMoviesDisplay : DisplayMovie[] = [];

  myShakeEvent : Shake;

  constructor(
    private movieService : MovieServiceService,
    private movieDisplayService : DisplayMovieService,
    private router : Router
    ) {

      this.myShakeEvent = new Shake(
        {threshold : 10}
      );
      this.myShakeEvent.start();
      window.addEventListener('shake', this.shaked,false)

     }

  ngOnInit(): void {

    if(localStorage.getItem("secure-all-movies") !== null)
    {
      this.allMoviesDisplay = JSON.parse(localStorage.getItem("secure-all-movies"))
      //this.random4Movies = this.allMoviesDisplay.slice(0,4);
      this.shuffleMovies();
      console.log(this.random4Movies.length)
    }

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      var allMovies :FMovie[] = o;
      this.allMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(allMovies.filter(x=> !x.isThisSeries));
    })

  }

  ngOnDestroy()
  {
    window.removeEventListener('shake',this.shaked,false);
  }

  shaked()
  {
    
    alert("shaked");
    //this.router.navigateByUrl('/random');
    this.shuffleMovies();
  }

  shuffleMovies()
  {
    
    for(let i=0;i<document.getElementsByClassName("image").length;i++)
    {
      document.getElementsByClassName("image")[i].classList.add("animated");
      document.getElementsByClassName("image")[i].classList.add("wobble");
      document.getElementsByClassName("image")[i].classList.add("infinite");
    }
    // setTimeout(()=>{
    //   this.random4Movies = this.shuffleArr(this.allMoviesDisplay).slice(0,4);
    // },10)
    setTimeout(()=>{
      for(let i=0;i<document.getElementsByClassName("image").length;i++)
      {
        document.getElementsByClassName("image")[i].classList.remove("animated");
        document.getElementsByClassName("image")[i].classList.remove("tada");
        document.getElementsByClassName("image")[i].classList.remove("infinite");
      }
      this.random4Movies = this.shuffleArr(this.allMoviesDisplay).slice(0,4);
    },700)

  }

  shuffleArr (array) : any[]
  {
    if(array.length && array.length == 0)
    {
      return [];
    }
    else
    {
      for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
      }
    return array;
    }
    
  }

}
