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
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {

  allMovies : FMovie[] = [];

  allMovieLists : MovieList[] = [];

  ListForDisplay : DisplayMovieList = new DisplayMovieList();

  isMobile : boolean = false;

  showCopiedClipboard : boolean = false;

  customList : boolean = false;

  allCustomers : Customer[] = [];

  customerName : string = '';
  customerUID : string = '';

  rating : number = 5;
  eligibleForRating : boolean = true;

  loading : boolean = true;


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
      var tempList : MovieList[] = [];
      var listKey = this.activatedRoute.snapshot.params.key;
      // console.log(this.allMovieLists)
      // console.log(listKey)
      for(let i=0;i<this.allMovieLists.length;i++)
      {
        if(this.allMovieLists[i]['key'] === listKey)
        {
          tempList.push(this.allMovieLists[i]); 
          break;         
        }
      }
      console.log(tempList)
      if(tempList.length==0)
      {
        this.router.navigateByUrl('/movielist')
      }
      this.customerUID = tempList[0].createdBy;
      this.ListForDisplay = this.listDisplayService.BuildMovieListForDisplay(tempList,this.allMovies)[0]
      //this.ListForDisplay.moviesInList.sort((a,b) => b.rating - a.rating)
      this.loading = false;

      if(localStorage.getItem(this.ListForDisplay.key)  === "rated"){
        this.eligibleForRating = false;
      }
      if(tempList[0].createdBy)
      {
        this.customList = true;
        this.getCustomerName()
      }
    })
  }

  getCustomerName()
  {
    this.customerService.getLoggedInCustomer()
          .subscribe(o =>
            {
              this.allCustomers = o;
              //console.log(o)
              //if(window.localStorage.getItem())
              if(this.allCustomers.find(x => x.uid === this.customerUID))
              {
                this.customerName = this.allCustomers.find(x => x.uid === this.customerUID).name
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

  rateList(key)
  {
    console.log(key);
    var list = this.allMovieLists.find(x => x['key'] == key);
    delete list['key'];
    console.log(list)
    if(list.rating)
    {
      list.rating = Number(list.rating)+this.rating;
    }
    else
    {
      list.rating = this.rating
    }
    console.log(list);
    this.listService.updateMovieList(key,list);  
    localStorage.setItem(key,"rated");  
  }

  deleteList(key)
  {
    //
  }

}
