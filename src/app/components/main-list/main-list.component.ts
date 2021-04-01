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
      for(let i=0;i<this.allMovieLists.length;i++)
      {
        if(this.allMovieLists[i]['key'] === listKey)
        {
          tempList.push(this.allMovieLists[i]); 
          break;         
        }
      }
      console.log(tempList)
      this.customerUID = tempList[0].createdBy;
      this.ListForDisplay = this.listDisplayService.BuildMovieListForDisplay(tempList,this.allMovies)[0]
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
              this.customerName = this.allCustomers.find(x => x.uid === this.customerUID).name

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
