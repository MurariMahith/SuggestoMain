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
import { Location } from '@angular/common';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {

  customerNeeded : Customer;

  allCustomers : Customer[] = []

  loggedIn : boolean = false;

  isMobile : boolean = false;

  //for building List of Display Movies via service

  movieListArr : MovieList[] = [];
  allMovies : FMovie[] = [];

  ListForDisplay : DisplayMovieList = new DisplayMovieList();

  showCopiedClipboard : boolean = false;


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
    private activatedRoute: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            console.log(o)
            this.allCustomers = o;
            var custKey = this.activatedRoute.snapshot.params.key;
            console.log(custKey)
            if(o.find(x => x['key'] === custKey))
            {
              this.customerNeeded = o.find(x => x['key'] === custKey)
              this.loggedIn = true
              console.log(this.customerNeeded)
              if(!this.customerNeeded.name || this.customerNeeded.name === '')
                this.customerNeeded.name = this.customerNeeded.email;

              //removing duplicates from wishlists
              let chars = this.customerNeeded.wishlistedMovies
              let uniqueChars = chars.filter((c, index) => {
                  return chars.indexOf(c) === index;
              });
              console.log(uniqueChars)

              var fakeMovieList = new MovieList();
              fakeMovieList.listName = 'WishList of '+this.customerNeeded.name;
              fakeMovieList.moviesInThisList = uniqueChars;
              this.movieListArr.push(fakeMovieList);
              console.log(fakeMovieList)


              this.movieService.getAllMovies().snapshotChanges().pipe(
                map(changes =>
                  changes.map(c =>
                    ({ key: c.payload.key, ...c.payload.val() })
                  )
                )
              ).subscribe(o =>
                {
                  this.allMovies = o;  
                  this.ListForDisplay = this.listDisplayService.BuildMovieListForDisplay(this.movieListArr,this.allMovies)[0];
                  console.log(this.ListForDisplay)
                })


            }
          })
  }

  goto(key)
  {
    this.router.navigateByUrl('/movie/'+key);
  }

  copyToClipboard()
  {

    if (navigator.share) {
      navigator.share({
        title: 'Suggesto : '+this.ListForDisplay.listName,
        url: window.location.toString(),
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else 
    {
      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (window.location.href));
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
      this.showCopiedClipboard = true
    }
  }
  
  goBack() 
  {
    this.location.back();
  }

}
