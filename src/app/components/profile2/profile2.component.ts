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
// import { $ } from 'protractor';
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
import { FollowObject } from 'src/app/models/FollowObject';
import { FeedItem } from 'src/app/models/FeedItem';
import { HitsService } from 'src/app/services/hits.service';
import { SharedMovie } from 'src/app/models/SharedMovie';

declare var $:any;

@Component({
  selector: 'app-profile2',
  templateUrl: './profile2.component.html',
  styleUrls: ['./profile2.component.scss']
})

export class Profile2Component implements OnInit {

  currentCustomer : Customer;

  allCustomers : Customer[] = [];

  allCustomersWhoArePublic : Customer[] = [];

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

  followersBool : boolean = false;
  followingBool : boolean = false;
  requestBool : boolean = false;
  findPeopleBool : boolean = false;

  messagesBool : boolean = false;

  notifyRequest : boolean = false;


  moviesNav : boolean = true;
  peopleNav : boolean = false;
  settingsNav : boolean = false;

  followingSelect()
  {
    this.followingBool = !this.followingBool;
  }
  followersSelect()
  {
    this.followersBool = !this.followersBool;
  }
  requestSelect()
  {
    this.requestBool = !this.requestBool;
  }
  requestNotificationBool()
  {
    this.peopleNav = true;
    this.moviesNav = false;
    this.settingsNav = false;
    //document.getElementById("requests-id").scrollIntoView({ behavior: "smooth",block: "center"})
    this.notifyRequest = false;
    this.requestBool = true;
  }

  findPeopleSelect()
  {
    this.findPeopleBool = !this.findPeopleBool;
  }

  loading : boolean = true;

  allFollowinguids : string[] = [];

  timeOutError;

  
  allLists : MovieList[] = []

  listsByCurrentCustomer : MovieList[] = [];

  constructor(private movieService : MovieServiceService,
    private listService : MovieListService,
    private movieDisplayService : DisplayMovieService,
    private listDisplayService : DisplayListService,
    private router : Router,
    private homelistsservice : HomePageListsService,
    private messageService : HitsService,
    private activatedRote : ActivatedRoute,
    private http : HttpClient,
    private authService : AuthService,
    private customerService : CustomerService) { }

  
  ngOnInit() {

    $('[data-toggle="popover"]').popover();

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      ////console.log("mobile");
    }
    else{
      ////console.log("laptop")
    }
    if(localStorage.getItem("allMovies") !== null )
    {
      this.allMovies = JSON.parse(localStorage.getItem("allMovies"));
      //console.log("backup Movies")
      //console.log(this.allMovies.length)
      //this.loading = false;
    }
    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            this.allCustomers = o;
            this.allCustomersWhoArePublic.length =0;
            this.allCustomers.forEach(element => {
              if(element.customerPhotoUrl && element.customerPhotoUrl.length<=0)
              {
                element.customerPhotoUrl = "../../../assets/images/defaultuser.png"
              }
              if(element.shareWishlistedMovies && element.name && element.name.length>0)
              {
                this.allCustomersWhoArePublic.push(element)
              }
            });
            this.allCustomersWhoArePublicDisplay = this.allCustomersWhoArePublic
            //remove current customer from all customers.

            

            ////console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loading = false;
              //get back here
              //window.localStorage.setItem("currentCustomer",JSON.stringify(this.currentCustomer));

              //getting all messages sent for this customer
              this.getAllMessages();

              setTimeout(()=>{
                if(this.currentCustomer.followRequestReceived.length >0)
                {
                  this.notifyRequest = true;
                }                  
              },5000)
              if(!this.currentCustomer.followRequestSent || this.currentCustomer.followRequestSent == undefined)
              {
                this.currentCustomer.followRequestSent = [];
              }
              if(!this.currentCustomer.following || this.currentCustomer.following == undefined)
              {
                this.currentCustomer.following = [];
              }
              if(!this.currentCustomer.followers || this.currentCustomer.followers == undefined)
              {
                this.currentCustomer.followers = [];
              }
              if(!this.currentCustomer.followRequestReceived || this.currentCustomer.followRequestReceived == undefined)
              {
                this.currentCustomer.followRequestReceived = [];
              }

              
              if(!this.currentCustomer.wishlistedMovies || this.currentCustomer.wishlistedMovies == undefined)
              {
                this.currentCustomer.wishlistedMovies = [];
              }
              if(!this.currentCustomer.watchedMovies || this.currentCustomer.watchedMovies == undefined)
              {
                this.currentCustomer.watchedMovies = [];
              }
              if(!this.currentCustomer.ratedMovies || this.currentCustomer.ratedMovies == undefined)
              {
                this.currentCustomer.ratedMovies = [];
              }
              
              



              this.currentCustomer.following.forEach(element => {
                this.allFollowinguids.push(element.followerUserId)
              });
              ////console.log(this.allFollowinguids)
              this.loggedIn = true
              //console.log(this.currentCustomer)
              for( var i = 0; i < this.allCustomersWhoArePublic.length; i++)
              {     
                if (this.allCustomersWhoArePublic[i].uid == this.currentCustomer.uid) 
                {   
                  this.allCustomersWhoArePublic.splice(i, 1); 
                }
              }
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
        this.allMovies.length = 0;
        this.allMovies = o;
        window.localStorage.setItem("allMovies",JSON.stringify(this.allMovies.slice(0,50)))
        //console.log("Original Movies Loaded")
        //console.log(this.allMovies.length)
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
        // //console.log(this.wishlistedMoviesDisplay)
        // //console.log(this.ratedMoviesDisplay)
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
        //console.log("stopping here")
        if(!this.currentCustomer || this.currentCustomer == undefined)
        {
          window.location.reload();
        }
        this.share = this.currentCustomer.shareWishlistedMovies ? this.currentCustomer.shareWishlistedMovies : false;
        //this.loading = false;
        ////console.log(this.wishlistedMoviesDisplay)
        ////console.log(this.ratedMoviesDisplay)
      })

      // //console.log(this.wishlistedMoviesDisplay)
      // //console.log(this.ratedMoviesDisplay)

    this.timeOutError =setTimeout(()=>{
      if(this.loading)
      {
        alert("Something went wrong, please refresh !! OR Log Out and Log in again.");
        window.location.reload();
      }        
    },20000)

  }

  showMessageIcon : boolean = true;
  messagesForCurrentCustomer : SharedMovie[] = []
  newMsgCount : number = 0;

  getAllMessages()
  {
    this.messageService.getAllMessages().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(o => {
      //console.log("messages below")
      //console.log(o)
      var allMessages :SharedMovie[] = o
      this.messagesForCurrentCustomer.length = 0;
      allMessages.forEach(element => {
        if(element.receiverUid === this.currentCustomer.uid)
        {
          this.messagesForCurrentCustomer.push(element)
        }
      });
      this.messagesForCurrentCustomer.reverse();
      this.messagesForCurrentCustomer.forEach(m =>
        {
          if(m.viewedByReceiver == false)
          {
            this.newMsgCount++;
          }
        })
    })
  }


  openMessages(fromNotifyBadge : boolean = true)
  {
    if(fromNotifyBadge)
    {
      this.showMessageIcon = false;
      this.peopleNav = true;
      this.moviesNav = false;
      this.settingsNav = false;
      this.messagesBool = true;
      this.messagesForCurrentCustomer.forEach(element => {
        if(!element.viewedByReceiver)
        {
          element.viewedByReceiver = true;
          this.messageService.updateMessage(element['key'],element)
        }
      });
    }
    else
    {
      //if we are opening messages update all messages as viewd and disable showMessageIcon
      if(!this.messagesBool)
      {
        //console.log("opening")
        this.messagesBool = !this.messagesBool;
        this.messagesForCurrentCustomer.forEach(element => {
          if(!element.viewedByReceiver)
          {
            element.viewedByReceiver = true;
            this.messageService.updateMessage(element['key'],element)
          }
        });
        this.newMsgCount = 0
        this.showMessageIcon = false;

      }
      else
      {
        this.messagesBool = !this.messagesBool
        //console.log("closing")
      }
      
      
    }

  }

  deleteMessage(key :string)
  {
    this.messageService.deleteMessage(key).then(()=>console.log("deleted message")).catch(()=>console.log("something went wrong"))
    // //console.log("deleted message")
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
        ////console.log(this.allLists)
        this.listsByCurrentCustomer.length = 0;
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
    this.wishlistedMovies.length = 0;
    this.watchedMovies.length = 0;
    this.ratedMovies.length = 0;
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

  sendFollowRequest(key)
  {
    var receiverCustomer = this.allCustomers.find(x => x.uid === key);
    //console.log(receiverCustomer);

    if(receiverCustomer)
    {
      var request : FollowObject = new FollowObject();
      request.followerName = this.currentCustomer.name;
      request.followerUserId = this.currentCustomer.uid;
      request.followerphotoUrl = this.currentCustomer.customerPhotoUrl;
      if(receiverCustomer.followRequestReceived)
      {
        receiverCustomer.followRequestReceived.push(request)
      }
      else
      {
        var requestobj : FollowObject[] = [];
        requestobj.push(request)
        receiverCustomer.followRequestReceived = requestobj;
      }
      
      this.customerService.updateCustomer(receiverCustomer['key'],receiverCustomer)
      
      if(this.currentCustomer.followRequestSent)
      {
        this.currentCustomer.followRequestSent.push(receiverCustomer.uid);
      }
      else
      {
        var strarr :string[] = [];
        strarr.push(receiverCustomer.uid);
        this.currentCustomer.followRequestSent = strarr
      }
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      //console.log(receiverCustomer)
      //console.log(this.currentCustomer)
    } 
  }
  //delete other customer uid from followrequestsent array of current customer
  //delete follow object with current customer uid from followrequestreceived array of other customer
  deleteFollowRequest(key)
  {
    var requestedCustomer = this.allCustomers.find(x => x.uid == key)
    if(requestedCustomer)
    {
      if(this.currentCustomer.followRequestSent.includes(key))
      {
        for( var i = 0; i < this.currentCustomer.followRequestSent.length; i++)
        {     
          if (this.currentCustomer.followRequestSent[i] == key) 
          {   
            this.currentCustomer.followRequestSent.splice(i, 1); 
          }
        }
      }

      for( var i = 0; i < requestedCustomer.followRequestReceived.length; i++)
      {     
        if (requestedCustomer.followRequestReceived[i].followerUserId == this.currentCustomer.uid) 
        {   
          requestedCustomer.followRequestReceived.splice(i, 1); 
        }
      }

      //console.log(this.currentCustomer)
      //console.log(requestedCustomer)
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      this.customerService.updateCustomer(requestedCustomer['key'],requestedCustomer)
    }
  }

  //delete current customer uid from followrequestsentarray of other customer
  //delete followobject from followrequestsreceived array from current customer
  //push that follow object to followers of current customer and following of other customer
  acceptFollower(key)
  {

    var otherCustomer = this.allCustomers.find(x => x.uid == key)
    //console.log(otherCustomer.uid);
    //console.log(key);
    if(otherCustomer)
    {
      if(!otherCustomer.followRequestSent || otherCustomer.followRequestSent == undefined)
      {
        otherCustomer.followRequestSent = [];
      }
      if(!otherCustomer.following || otherCustomer.following == undefined)
      {
        otherCustomer.following = [];
      }
      if(!otherCustomer.followers || otherCustomer.followers == undefined)
      {
        otherCustomer.followers = [];
      }
      if(!otherCustomer.followRequestReceived || otherCustomer.followRequestReceived == undefined)
      {
        otherCustomer.followRequestReceived = [];
      }
      //otherCustomer.followRequestSent
      for( var i = 0; i < otherCustomer.followRequestSent.length; i++)
      {     
        if (otherCustomer.followRequestSent[i] == this.currentCustomer.uid) 
        {   
          otherCustomer.followRequestSent.splice(i, 1); 
        }
      }

      for( var i = 0; i < this.currentCustomer.followRequestReceived.length; i++)
      {     
        if (this.currentCustomer.followRequestReceived[i].followerUserId == key) 
        {   
          this.currentCustomer.followRequestReceived.splice(i, 1); 
        }
      }

      var followerObj = new FollowObject();
      followerObj.followerName = otherCustomer.name;
      followerObj.followerUserId = otherCustomer.uid;
      followerObj.followerphotoUrl = otherCustomer.customerPhotoUrl;

      this.currentCustomer.followers.push(followerObj);

      var followingObj = new FollowObject()
      followingObj.followerName = this.currentCustomer.name;
      followingObj.followerUserId = this.currentCustomer.uid;
      followingObj.followerphotoUrl = this.currentCustomer.customerPhotoUrl;

      otherCustomer.following.push(followingObj);

      //console.log(this.currentCustomer)
      //console.log(otherCustomer);

      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      this.customerService.updateCustomer(otherCustomer['key'],otherCustomer)

    }

  }

  //remove follower obj of currentcustomer following array
  //remover following obj from other customer's followers
  UnfollowCustomer(key)
  {
    var customerToUnfollow = this.allCustomers.find(x => x.uid == key)
    if(customerToUnfollow.followers)
    {
      for( var i = 0; i < customerToUnfollow.followers.length; i++)
      {     
        if (customerToUnfollow.followers[i].followerUserId == this.currentCustomer.uid) 
        {   
          customerToUnfollow.followers.splice(i, 1); 
        }
      }     
      
      for( var i = 0; i < this.currentCustomer.following.length; i++)
      {     
        if (this.currentCustomer.following[i].followerUserId == customerToUnfollow.uid) 
        {   
          this.currentCustomer.following.splice(i, 1); 
        }
      } 

      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
      this.customerService.updateCustomer(customerToUnfollow['key'],customerToUnfollow)

      for( var i = 0; i < this.allFollowinguids.length; i++)
      {     
        if (this.allFollowinguids[i] == customerToUnfollow.uid) 
        {   
          this.allFollowinguids.splice(i, 1); 
        }
      } 
      
      
      //update other customer
      //delete follow object from following in current customer
      //update current customer
    }

  }

  searchString : string = '';
  allCustomersWhoArePublicDisplay : Customer[] = [];

  searching(event)
  {
    event = event.trim().toLocaleLowerCase();
    //console.log(event);
    this.allCustomersWhoArePublic.forEach(element => {
      element.name = element.name.toLocaleLowerCase();
    });
    this.allCustomersWhoArePublicDisplay = this.allCustomersWhoArePublic.filter(x => x.name.search(event) != -1)
    //console.log(this.allCustomersWhoArePublicDisplay);

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
    //console.log(localStorage.getItem["uid"])
    //console.log(this.currentCustomer.uid);
    this.router.navigateByUrl('movielist/'+this.currentCustomer.uid)
  }

  UpdateCustomerWhenSharingEvent()
  {
    //console.log(this.share);
    this.currentCustomer.shareWishlistedMovies = this.share;
    //console.log(this.currentCustomer)
    this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
  }

  UpdateCustomerWhenSharingEvent2(pubUser : boolean = false, wishUser : boolean = false, watchUser : boolean = false)
  {
    this.currentCustomer.shareWishlistedMovies = pubUser;
    this.currentCustomer.showWishlistToFollowers = wishUser;
    this.currentCustomer.showWatchedListToFollowers = watchUser;
    this.share = pubUser;
    //console.log(this.currentCustomer);
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

  //this method is for testing purpose
  updateAllCustomers()
  {
    //this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
    this.allCustomers.forEach(element => {
      if(element.shareWishlistedMovies)
      {
        element.showWishlistToFollowers = true;
        element.showWatchedListToFollowers = true;
        this.customerService.updateCustomer(element["key"],element)
      }      
    });
  }

  copyToClipboard()
  {

    if (navigator.share) {
      navigator.share({
        title: 'Suggesto : Best app to find hand picked Movies and Suggestion on daily basis and lot more.',
        // url: window.location.toString(),
        text: 'Hey, checkout this amzing app to find good movies with promising content and ott links for those movies. Suggesto its great. Please follow this link to download the app.    '+ "https://play.google.com/store/apps/details?id=xyz.appmaker.jibpca"
      }).then(() => {
        //console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else 
    {
      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', ('I invite you to use suggesto and know some good content movies and see them. Please follow this link to download the app.   '+ "https://play.google.com/store/apps/details?id=xyz.appmaker.jibpca"));
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
    //console.log(mov)
    if(mov && link && link.length>2)
    {
      window.location.href = link;
    }
    else
    {
      alert("Sorry External Site link un-available for "+mov.title+". We are working on this, we will update External site link soon. You can Find "+mov.title+" in "+movD.availableIn)
    }
    
  }

  UpdateCustomerForChangedName()
  {    
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
  }

  addMovieToWishlist(key)
  {
    if(this.loggedIn)
    {
      ////console.log(key)
      var wishlisted = []
      this.wishlistedMovies.push(key)
      wishlisted.push(key)
      
      if(!this.currentCustomer.wishlistedMovies)
      {
        ////console.log("new");
        this.currentCustomer.wishlistedMovies = wishlisted;
      }
      else
      {
        this.currentCustomer.wishlistedMovies.push(key);
      }
      //////console.log(this.currentCustomer)
      this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer)
      var feeditm : FeedItem = new FeedItem();
      feeditm.content = this.currentCustomer.name + " added "+this.allMovies.find(x=>x.key == key).title+ " to their wish list. Click to view the movie."
      feeditm.customerName = this.currentCustomer.name;
      feeditm.customerUid = this.currentCustomer.uid;
      feeditm.photoUrl = this.currentCustomer.customerPhotoUrl;
      feeditm.url = '/movie/'+this.allMovies.find(x=>x.key == key).key;
      feeditm.type = 'WISHLIST';
      this.customerService.addFeedItem(feeditm);
    }
    else
    {
      alert("Sorry!, You should Login to use Wishlisted feature.")
    }
    
  }

  removeFromWishlist(key)
  {
    ////console.log(this.currentCustomer.wishlistedMovies)
    if(this.currentCustomer.wishlistedMovies.includes(key))
    {
      for( var i = 0; i < this.currentCustomer.wishlistedMovies.length; i++)
      {     
        if (this.currentCustomer.wishlistedMovies[i] == key) 
        {   
          this.currentCustomer.wishlistedMovies.splice(i, 1); 
        }
      }
      ////console.log(this.currentCustomer.wishlistedMovies)
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
    var feeditm : FeedItem = new FeedItem();
    feeditm.content = this.currentCustomer.name + " watched "+this.allMovies.find(x=>x.key == key).title + " . Click to view the movie."
    feeditm.customerName = this.currentCustomer.name;
    feeditm.customerUid = this.currentCustomer.uid;
    feeditm.photoUrl = this.currentCustomer.customerPhotoUrl;
    feeditm.url = '/movie/'+this.allMovies.find(x=>x.key == key).key;
    feeditm.type = 'WATCHED';
    this.customerService.addFeedItem(feeditm);

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
      //console.log("removed")
      this.customerService.updateCustomer(this.currentCustomer['key'],this.currentCustomer)
    }

  }

  deleteAccount()
  {
    var del = confirm("Are you sure you want to delete your Account from Suggesto? If you do, next time you login a new account will be created for you and all your movies will be lost.")
    if(del)
    {
      var verifyDel = prompt("Please type 'Delete' here.")
      if(verifyDel === 'Delete')
      {
        alert("Thank you for using Suggesto. Your account deletion initiated. we will delete your account please be patient. You will be redirected to home page once your account deletion is done.")
        this.performAccountDeletion();
      }
      else
      {
        alert("please type given string as it is.")
      }
    }
  }

  //delete followers following follow requests and sent follow requests from all customers
  //delete all lists created by this customer
  //delete this customer from customer database.
  //log him out
  performAccountDeletion()
  {
    var myuid = this.currentCustomer.uid;
    var customersToBeUpdated : Customer[]= [];
    var listsToBeDeleted : MovieList[] = [];
    this.currentCustomer.followers.length = 0;
    this.currentCustomer.following.length = 0;
    this.currentCustomer.followRequestSent.length = 0;
    this.currentCustomer.followRequestReceived.length = 0;
    this.allCustomers.forEach(element => {    

      if(!element.followRequestSent || element.followRequestSent == undefined)
      {
        element.followRequestSent = [];
      }
      if(!element.following || element.following == undefined)
      {
        element.following = [];
      }
      if(!element.followers || element.followers == undefined)
      {
        element.followers = [];
      }
      if(!element.followRequestReceived || element.followRequestReceived == undefined)
      {
        element.followRequestReceived = [];
      }

      //deleting followers

      for(var i=0;i<element.followers.length;i++)
      {
        if(element.followers[i].followerUserId === myuid)
        {
          customersToBeUpdated.push(element)
          element.followers.splice(i, 1);
        }
      }

      //deleting following
      for(var i=0;i<element.following.length;i++)
      {
        if(element.following[i].followerUserId === myuid)
        {
          customersToBeUpdated.push(element)
          element.following.splice(i, 1);
        }
      }

      //deleting follow request
      for(var i=0;i<element.followRequestReceived.length;i++)
      {
        if(element.followRequestReceived[i].followerUserId === myuid)
        {
          customersToBeUpdated.push(element)
          element.followRequestReceived.splice(i, 1);
        }
      }

      //deleting follow requests sent
      for(var i=0;i<element.followRequestSent.length;i++)
      {
        if(element.followRequestSent[i] === myuid)
        {
          customersToBeUpdated.push(element)
          element.followRequestSent.splice(i, 1);
        }
      }
      
    });


    for(var i=0;i<this.allLists.length;i++)
    {
      if(this.allLists[i].createdBy === myuid)
      {
        // console.log(this.allLists[i])
        // this.allLists.splice(i, 1);
        listsToBeDeleted.push(this.allLists[i])
      }
    }

    console.log(this.allLists);
    customersToBeUpdated.forEach(element => {
      //console.log(element);
      this.customerService.updateCustomer(element['key'],element)
    });
    listsToBeDeleted.forEach(e => {
      this.listService.deleteMovieList(e['key']);
    })
    console.log(this.currentCustomer)
    this.customerService.deleteCustomer(this.currentCustomer['key']);
    console.log("account deleted")
    this.authService.logOut();
  }

}
