import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customerService';
import { DailyHits } from 'src/app/models/Hits';
import * as moment from 'moment';
import { HitsService } from 'src/app/services/hits.service';
import { combineAll, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn : boolean = false;
  isMobile : boolean = false;
  DomPageLoadDone : boolean = true;
  
  internetStatusOnline : boolean = false;

  constructor(private authService : AuthService,private location: Location,private hitsService : HitsService,private customerService : CustomerService) {

    this.DomPageLoadDone = false;
    this.internetStatusOnline = true;

    // document.addEventListener('DOMContentLoaded',()=>{console.log("page loaded")})
    // document.addEventListener('load',()=>{console.log("page fully loaded")})
    // document.addEventListener('unload',()=>{console.log("unloaded")});
    // if (document.readyState === 'complete') {
    //   console.log("page load 2")
    // }
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        //console.log("page load 2")
        this.DomPageLoadDone = true;
        clearInterval(stateCheck);
        // document ready
      }
    }, 100);

    let internetCheck = setInterval(() => {
      if (navigator.onLine) 
      {
        this.internetStatusOnline = true; 
      }
      else
      {
        this.internetStatusOnline = false;
      }
      //console.log(this.internetStatusOnline)
    }, 10000);

   }

  goBack()
  {
    console.log("going back")
    this.location.back();
  }


  ngOnInit() {
    

    const onClickOutside = (e) => {
      if (!e.target.className.includes("sidebar")) {
        this.closeSideBar();
      }
    }; 

    window.addEventListener("click", onClickOutside);

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      //this.pushSubscription()
      //console.log("mobile");
    }
    else{
      //console.log("laptop")
    }

    if(!(localStorage.getItem("loggedIn") === null))
    {
      if(localStorage.getItem("loggedIn") === "true")
      {
        this.loggedIn = true;
        this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            ////console.log(o)
            //this.allCustomers = o;
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              //this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
              this.loggedIn = true
            }
            ////console.log(this.currentCustomer)
            ////console.log(this.loggedIn)
          })
      }
    }

    // var dailyHitUpdatedNow :  boolean = false;
    // this.hitsService.getAllDailyHits()
    // .snapshotChanges().pipe(
    //   map(changes => 
    //       changes.map(c =>
    //           ({key: c.payload.key, ...c.payload.val() })
    //           )
    //       )
    //   )
    // .subscribe(o => {
    //   var dailyHits : DailyHits[] = o;
    //   if(dailyHits.find(x => x.date == moment().format('DD/MM/YYYY')) && !dailyHitUpdatedNow)
    //   {
    //     var hitToday = dailyHits.find(x => x.date == moment().format('DD/MM/YYYY'));
    //     hitToday.visitedCount = hitToday.visitedCount+1;
    //     dailyHitUpdatedNow = true;
    //     this.hitsService.updateDailyHits(hitToday['key'],hitToday).then(() => dailyHitUpdatedNow = true)
    //   }
    //   else if(!dailyHitUpdatedNow)
    //   {
    //     var hitToday = new DailyHits();
    //     hitToday.date = moment().format('DD/MM/YYYY')
    //     hitToday.visitedCount = hitToday.visitedCount+1;
    //     this.hitsService.createDailyHits(hitToday);
    //     dailyHitUpdatedNow = true;
    //   }
    //   //console.log(dailyHits);
    // });
  }

  logout()
  {
    this.authService.logOut();
  }

  reload()
  {
    window.location.reload();
  }

  home()
  {
    window.location.href = '/';
  }

  openSideBar() 
  {
    document.getElementById("mySidebar").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
  }
  
  closeSideBar() 
  {
    document.getElementById("mySidebar").style.width = "0";
    //document.getElementById("main").style.marginLeft= "0";
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

}
