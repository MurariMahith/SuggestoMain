import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Customer } from 'src/app/models/Customer';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { FMovie } from 'src/app/models/Fmovie';
import { CustomerService } from 'src/app/services/customerService';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { MovieServiceService } from 'src/app/services/movie-service.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  currentCustomer : Customer;

  allMovies : FMovie[] = [];

  wishlistedMovies : FMovie[] = [];
  ratedMovies : FMovie[] = [];

  wishlistedMoviesDisplay : DisplayMovie[] = [];
  ratedMoviesDisplay : DisplayMovie[] = [];

  loading : boolean = true;

  constructor(private customerService : CustomerService,private movieService : MovieServiceService,private movieDisplayService : DisplayMovieService,private router : Router) { }

  ngOnInit(): void {

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            // console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
            }
            console.log(this.currentCustomer) 
          })
    }

    this.movieService.getAllMovies().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o =>
      {
        this.allMovies = o;
        this.allMovies.forEach(element => {
          if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.includes(element.key))
          {
            this.wishlistedMovies.push(element)
          }
          this.currentCustomer.ratedMovies.forEach(x => {
            if(element.key === x.movieId)
            {
              this.ratedMovies.push(element)
            }
          });
        });
        this.wishlistedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.wishlistedMovies)
        this.ratedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.ratedMovies)
        // console.log(this.wishlistedMoviesDisplay)
        // console.log(this.ratedMoviesDisplay)
        this.ratedMoviesDisplay.forEach(x => {
          this.currentCustomer.ratedMovies.forEach(y => {

            if(x.key === y.movieId)
            {
              x.rating = y.rating;
            }
            
          });
        });
      })
      this.loading = false;

  }

  removeWishlist(key)
  {
    console.log(key);
    console.log(this.currentCustomer.wishlistedMovies)
    if(this.currentCustomer.wishlistedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.wishlistedMovies.length; i++)
      {     
        if (this.currentCustomer.wishlistedMovies[i] == key) 
        {   
          this.currentCustomer.wishlistedMovies.splice(i, 1); 
        }
      }
    }
      for( var i = 0; i < this.wishlistedMoviesDisplay.length; i++)
      {     
        if (this.wishlistedMoviesDisplay[i].key == key) 
        {   
          this.wishlistedMoviesDisplay.splice(i, 1); 
        }
      }

    console.log(this.currentCustomer.wishlistedMovies)
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer).then(()=>console.log("success"))

  }

  Goto(key)
  {
    this.router.navigateByUrl("/movie/"+key);
  }

}
