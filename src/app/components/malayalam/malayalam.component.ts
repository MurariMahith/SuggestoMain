import { combineAll, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from 'src/app/models/Fmovie';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import * as moment from 'moment';
import { MovieListService } from 'src/app/services/movie-list.service';
import { MovieList } from 'src/app/models/MovieList';
import { DisplayMovieService } from 'src/app/services/display-movie.service';
import { DisplayListService } from 'src/app/services/display-list.service';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';
import { Router,ActivatedRoute } from '@angular/router';
import { $ } from 'protractor';
import { HomePageLists } from 'src/app/models/HomePageLists';
import { HomePageListsService } from 'src/app/services/home-page-lists.service';
import _ from 'lodash'
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { Genre } from 'src/app/models/Genre';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/app/services/customerService';
import { Customer } from 'src/app/models/Customer';
import { RatedMovies } from 'src/app/models/Customer Related/RatedMovies';
import { concat } from 'rxjs';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-malayalam',
  templateUrl: './malayalam.component.html',
  styleUrls: ['./malayalam.component.scss']
})
export class MalayalamComponent implements OnInit {

  currentCustomer : Customer;

  allCustomers : Customer[] = [];

  allMovies : FMovie[] = [];

  wishlistedMovies : FMovie[] = [];
  ratedMovies : FMovie[] = [];
  watchedMovies : FMovie[] = [];

  wishlistedMoviesDisplay : DisplayMovie[] = [];
  ratedMoviesDisplay : DisplayMovie[] = [];
  watchedMoviesDisplay : DisplayMovie[] = [];

  loggedIn : boolean = false;

  isMobile : boolean = false;

  genres : string = '';
  languages : string = '';

  wcount : number = 0;
  rcount : number = 0;
  watchedcount : number = 0;

  bronze : boolean = false;
  silver : boolean = false;
  gold : boolean = false;
  platinum : boolean = false;
  diamond : boolean = false;

  share : boolean = true;

  ratebool : boolean = false;
  wishbool : boolean = true;
  watchedbool : boolean = false;

  loading : boolean = true;

  timeOutError;

  
  allLists : MovieList[] = []

  listsByCurrentCustomer : MovieList[] = [];

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    private customerService : CustomerService) { }

  
    ngOnInit() {

      if( screen.width <= 480 ) {     
        this.isMobile = true;
        //console.log("mobile");
      }
      else{
        //console.log("laptop")
      }
      if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
      {
        this.customerService.getLoggedInCustomer()
          .subscribe(o =>
            {
              this.allCustomers = o;
              //console.log(o)
              if(o.find(x => x.uid === localStorage.getItem("uid")))
              {
                this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
                this.loggedIn = true
                console.log(this.currentCustomer)
                this.getMovieLists();
                //below line may not be needed
                this.getCategorisedMoviesForThisCustomer();
              }
              if(this.currentCustomer.preferredGenre)
              {
                this.genres = this.currentCustomer.preferredGenre.join(", ")
              }
              if(this.currentCustomer.preferredLanguages)
              {
                this.languages = this.currentCustomer.preferredLanguages.join(", ") 
              }                            
            })
      }
  
  
      //getting all movies
      this.movieService.getAllMovies().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(o =>
        {
          this.allMovies = o;
          try
          {
            this.getCategorisedMoviesForThisCustomer()
            // this.allMovies.forEach(element => {
            //   if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.includes(element.key))
            //   {
            //     this.wishlistedMovies.push(element)
            //   }
            //   if(this.currentCustomer.ratedMovies){
            //     this.currentCustomer.ratedMovies.forEach(x => {
            //       if(element.key === x.movieId)
            //       {
            //         this.ratedMovies.push(element)
            //       }
            //     });
            //   }
            //   if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(element.key))
            //   {
            //     this.watchedMovies.push(element)
            //   }
              
            // });
          }
          catch
          {
            //window.location.reload();
          }
          
          this.getCategorisedMoviesForThisCustomerForDisplay()
          // this.wishlistedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.wishlistedMovies)
          // this.ratedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.ratedMovies)
          // this.watchedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.watchedMovies);
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
          this.wcount = this.wishlistedMoviesDisplay.length;
          this.rcount = this.ratedMoviesDisplay.length;
          this.watchedcount = this.watchedMoviesDisplay.length;
          //this.watchedcount = 49
          if(this.watchedcount < 10)
          {
            this.bronze = true;
          }
          else if(this.watchedcount >= 10 && this.watchedcount <25)
          {
            this.silver = true
          }
          else if(this.watchedcount >= 25 && this.watchedcount <50)
          {
            this.gold = true;
          }
          else if(this.watchedcount >= 50 && this.watchedcount <75)
          {
            this.platinum = true;
          }
          else if(this.watchedcount >= 75)
          {
            this.diamond = true;
          }
          this.share = this.currentCustomer.shareWishlistedMovies ? this.currentCustomer.shareWishlistedMovies : false;
          this.loading = false;
          console.log(this.wishlistedMoviesDisplay)
          console.log(this.ratedMoviesDisplay)
        })
  
        console.log(this.wishlistedMoviesDisplay)
        console.log(this.ratedMoviesDisplay)

      this.timeOutError =setTimeout(()=>{
        if(this.loading)
        {
          alert("Something went wrong, please refresh !! OR Log Out and Log in again.");
          window.location.reload();
        }        
      },20000)
  
    }

  getMovieLists()
  {
    //getting all movie-lists
    this.listService.getAllMovieLists().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => 
      {
        this.allLists = o;
        console.log(this.allLists)
        this.allLists.forEach(x => {
          if(x.createdBy && x.createdBy === this.currentCustomer.uid)
          {
            this.listsByCurrentCustomer.push(x);              
          }
        });
        this.listsByCurrentCustomer.sort((x,y) => y.rating - x.rating);
      })
  }

  getCategorisedMoviesForThisCustomer()
  {
    this.allMovies.forEach(element => {
      if(this.currentCustomer.wishlistedMovies && this.currentCustomer.wishlistedMovies.includes(element.key))
      {
        this.wishlistedMovies.push(element)
      }
      if(this.currentCustomer.ratedMovies){
        this.currentCustomer.ratedMovies.forEach(x => {
          if(element.key === x.movieId)
          {
            this.ratedMovies.push(element)
          }
        });
      }
      if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(element.key))
      {
        this.watchedMovies.push(element)
      }
      
    });
  }

  getCategorisedMoviesForThisCustomerForDisplay()
  {
    this.wishlistedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.wishlistedMovies)
    this.ratedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.ratedMovies)
    this.watchedMoviesDisplay = this.movieDisplayService.prepareDisplayMovieList(this.watchedMovies);
  }


  ngOnDestroy()
  {
    clearTimeout(this.timeOutError);
  }

  goto(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  GoToMyList()
  {
    console.log(localStorage.getItem["uid"])
    console.log(this.currentCustomer.uid);
    this.router.navigateByUrl('movielist/'+this.currentCustomer.uid)
  }

  UpdateCustomerWhenSharingEvent()
  {
    console.log(this.share);
    this.currentCustomer.shareWishlistedMovies = this.share;
    console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
  }

  wishSelect()
  {
    var elmnt = document.getElementById("pointer");
    elmnt.scrollIntoView({ behavior: 'smooth'});
    this.ratebool = false;
    this.watchedbool = false;
    this.wishbool = true;
    this.getCategorisedMoviesForThisCustomer()
  }
  rateSelect()
  {
    var elmnt = document.getElementById("pointer");
    elmnt.scrollIntoView({ behavior: 'smooth'});
    this.ratebool = true;
    this.wishbool = false;
    this.watchedbool = false;
    this.getCategorisedMoviesForThisCustomer()
  }

  watchedSelect()
  {
    var elmnt = document.getElementById("pointer");
    elmnt.scrollIntoView({ behavior: 'smooth'});
    this.ratebool = false;
    this.wishbool = false;
    this.watchedbool = true;
    this.getCategorisedMoviesForThisCustomer()
  }

  logout()
  {
    this.loading = true;
    this.authService.logOut();
  }

  copyToClipboard()
  {

    if (navigator.share) {
      navigator.share({
        title: 'Suggesto : Best app to find hand picked Movies and Suggestion on daily basis.',
        url: window.location.toString(),
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else 
    {
      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', ('I invite you to use suggesto and know some good content movies and see them. Please follow this link to download the app.'+ "https://play.google.com/store/apps/details?id=xyz.appmaker.jibpca"));
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
    }
  }

  elongatedgenre : boolean = false;

  showAllGenres()
  {
    this.elongatedgenre = !this.elongatedgenre;
  }

  GoToMovieExternalSite(key)
  {
    var link = this.allMovies.find(x => x.key === key).ottLink
    var mov = this.allMovies.find(x => x.key === key)
    var movD = this.movieDisplayService.prepareDisplayMovieSingle(mov);
    console.log(mov)
    if(mov && link && link.length>2)
    {
      window.location.href = link;
    }
    else
    {
      alert("Sorry External Site link un-available for "+mov.title+". We are working on this, we will update External site link soon. You can Find "+mov.title+" in "+movD.availableIn)
    }
    
  }

  addMovieToWishlist(key)
  {
    if(this.loggedIn)
    {
      //console.log(key)
      var wishlisted = []
      this.wishlistedMovies.push(key)
      wishlisted.push(key)
      if(!this.currentCustomer.wishlistedMovies)
      {
        //console.log("new");
        this.currentCustomer.wishlistedMovies = wishlisted;
      }
      else
      {
        this.currentCustomer.wishlistedMovies.push(key);
      }
      ////console.log(this.currentCustomer)
      this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    }
    else
    {
      alert("Sorry!, You should Login to use Wishlisted feature.")
    }
    
  }

  removeFromWishlist(key)
  {
    //console.log(this.currentCustomer.wishlistedMovies)
    if(this.currentCustomer.wishlistedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.wishlistedMovies.length; i++)
      {     
        if (this.currentCustomer.wishlistedMovies[i] == key) 
        {   
          this.currentCustomer.wishlistedMovies.splice(i, 1); 
        }
      }
      //console.log(this.currentCustomer.wishlistedMovies)
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer);
    }
  }

  addToWatchedMovies(key)
  {
    if(!this.loggedIn)
    {
      alert("Sorry!, You should Login to add Movie to Watched List. Based on your watched movies we will suggest recommended movie.");
      return;
    }
    this.watchedMovies.push(key)
    if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.length >1)
    {
      this.currentCustomer.watchedMovies.push(key);

    }
    else
    {
      var arr :string[] = [];
      arr.push(key);
      this.currentCustomer.watchedMovies = arr;
    }
    if(this.currentCustomer.watchedMovies)
    {
    }
    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
  }

  removeFromWatched(key)
  {
    if(this.currentCustomer.watchedMovies && this.currentCustomer.watchedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.watchedMovies.length; i++)
      {     
        if (this.currentCustomer.watchedMovies[i] == key) 
        {   
          this.currentCustomer.watchedMovies.splice(i, 1); 
        }
      }
      console.log("removed")
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
    }

  }

}
