import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSuggestedMovie } from 'src/app/models/UserSuggestedMovie';
import { UserMovieSuggestService } from 'src/app/services/user-movie-suggest.service';

@Component({
  selector: 'app-suggest-movie',
  templateUrl: './suggest-movie.component.html',
  styleUrls: ['./suggest-movie.component.scss']
})
export class SuggestMovieComponent implements OnInit {

  userMovie : UserSuggestedMovie = new UserSuggestedMovie();

  customerUID : string = '';

  constructor(private userMovieService : UserMovieSuggestService,private router : Router) { }

  ngOnInit(): void {

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerUID = localStorage.getItem("uid");
    }

  }

  onSubmit()
  {
    
    this.userMovie.suggestedBy = this.customerUID;
    console.log(this.userMovie);
    this.userMovieService.createUserSuggestedMovie(this.userMovie)
    alert("Thank you for your suggestion, This will help us to suggest better movies.") 
    window.location.href="/all";
  }


}
