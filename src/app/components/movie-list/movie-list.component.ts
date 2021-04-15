import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FMovie } from 'src/app/models/FMovie';
import { MovieList } from 'src/app/models/MovieList';
import { MovieServiceService } from 'src/app/services/movie-service.service';
import { MovieListService } from 'src/app/services/movie-list.service';
import { DisplayMovieList } from 'src/app/models/DisplayMovieList';
import { DisplayMovie } from 'src/app/models/DisplayMovie';
import { Router,Params, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  allMovieLists : MovieList[] = [];
  allMovies : FMovie[] = [];  

  MovieListsForView : DisplayMovieList[] = [];

  selectedList : DisplayMovieList = new DisplayMovieList();

  isMobile : boolean = false;

  loading : boolean = true;

  loggedIn : boolean = false;

  customerLists : boolean = false;

  rating : number = 5;
  listToBeRated : MovieList;


  constructor(private movieService : MovieServiceService,private listService : MovieListService,private router : Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    if(localStorage.getItem('loggedIn') == 'true')
    {
      this.loggedIn = true;
    }

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }
    if(this.activatedRoute.snapshot.params.key)
    {
      this.customerLists = true;
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
      var adminList = [];
      var customerList = [];
      console.log(this.activatedRoute.snapshot.params.key)
      var customerUID = this.activatedRoute.snapshot.params.key;
      if(customerUID)
      {
        for(let i=0;i<this.allMovieLists.length;i++)
        {
          if(this.allMovieLists[i].createdBy === customerUID)
          {
            customerList.push(this.allMovieLists[i])
          }
        }
        console.log(customerList);
        this.BuildMovieListForDisplay(customerList);
      }
      else
      {
        for(let i=0;i<this.allMovieLists.length;i++)
        {
          if(!this.allMovieLists[i].createdBy)
          {
            adminList.push(this.allMovieLists[i])
          }
          else if(this.allMovieLists[i].createdBy === 'ADMIN' || this.allMovieLists[i].createdBy !== 'ADMIN' )
          {
            adminList.push(this.allMovieLists[i])
          }
        }
        console.log("hai")
        console.log(adminList);
        this.BuildMovieListForDisplay(adminList);
      }

      console.log(this.MovieListsForView)
      this.MovieListsForView.sort((a, b) => {
        return b.rating - a.rating;
      });
      this.loading = false;
    })
  }

  BuildMovieListForDisplay(lst : MovieList[])
  {
    lst.forEach(o => {
      var obj = new DisplayMovieList();
      var movieListForDisplay : FMovie[] = []
      obj.listName = o.listName;
      obj.key = o["key"]
      if(o.rating)
      {
          obj.rating = o.rating;
      }
      else{obj.rating = 0}
      if(o.createdBy)
      {
          obj.createdBy = o.createdBy;
      }
      else{obj.createdBy = 'ADMIN'}
      o.moviesInThisList.forEach(element => {
        //console.log(this.allMovies.find(a => a.key===element))        
        movieListForDisplay.push(this.allMovies.find(a => a.key===element));
      });
      //console.log(movieListForDisplay);
      obj.moviesInList = this.prepareDisplayMovieList(movieListForDisplay); 
      this.MovieListsForView.push(obj);  
    });
  }

  prepareDisplayMovieList(arr : FMovie[]) : DisplayMovie[]
  {
    var MovieListForDisplay2 : DisplayMovie[] = [];
    //console.log(arr)
    arr.forEach(o => {
      var obj = new DisplayMovie()

      obj.title = o.title;
      obj.trailerUrl = o.ytTrailerLink;      
      obj.releaseYear = o.releaseYear;
      obj.bigImageUrl = o.imageUrl;
      obj.smallImageUrl = o.cardImageUrl;
      obj.suggestedDate = o.suggestedDate;
      obj.key = o.key;
      obj.rating = o.rating;
      obj.ottLink = o.ottLink;
      obj.runTime = o.runTime;
      obj.torrentDownloadLink = o.torrentDownloadLink;
      obj.torrentOnlineLink = o.torrentOnlineLink;
      obj.cast = o.cast.join(",")
      obj.subTags = o.subTags.join(",")
      if(o.language.english)
        obj.language += 'English, '
      if(o.language.telugu)
        obj.language += 'Telugu, '
      if(o.language.tamil)
        obj.language += 'Tamil, '
      if(o.language.malayalam)
        obj.language += 'Malayalam, '
      if(o.language.kannada)
        obj.language += 'Kannada, '
      for(var key in o.movieGenre)
      {
        if(o.movieGenre[key])
          obj.genre += key +','
      }
      MovieListForDisplay2.push(obj);    
    });

    return MovieListForDisplay2;
  }

  GoToMovie(key)
  {
    this.router.navigateByUrl('/movie/'+key)
  }

  scroll(str)
  {
    var elmnt = document.getElementById("scrollToThis");
    elmnt.scrollIntoView({ behavior: 'smooth'});
    console.log(str);
    var arr = [];
    arr.push(this.MovieListsForView.find( o => o.key === str))
    this.selectedList = arr[0]
  }

  goto(key)
  {
    this.router.navigateByUrl('/list/'+key);
  }

  startRating(key)
  {
    this.listToBeRated = this.allMovieLists.find(x => x['key'] === key);

  }
  rateList(key)
  {
    var fake = this.listToBeRated
    this.listToBeRated.rating = Number(this.listToBeRated.rating ) + this.rating;
    delete fake['key'];
    this.listService.updateMovieList(key,fake);  
    localStorage.setItem(key,"rated");
  }

  deleteList(key)
  {
    console.log(key)
    var conf = confirm("Do you really want to delete this list?")
    if(conf)
    {
      this.listService.deleteMovieList(key);
      location.reload()
    }
   
  }

}
