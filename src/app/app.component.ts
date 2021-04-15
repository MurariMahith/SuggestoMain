import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'suggesto';

  isMobile : boolean = false;

  private readonly publicKey = "BO6RTiwPnFgl6ePzk0YApfdlzyskwZcwcATubbubu0esoAzIsjPS37BIDZueH4aEjJGi6yh60pp9OnCjtKok9A8";

  constructor(private appUpdateService : AppUpdateService, private swPush : SwPush) {

    if( screen.width <= 480 ) {     
      this.isMobile = true;
      
    }
    else{
      
      
    }
    if(!this.isMobile && localStorage.getItem("desktopNotify") !== "yes")
    {
      alert("This application is made for Mobile end user customers, if you are using it in larger screens, it may misbehave little bit. Please bear with us we will increase big screen compatibility in next version, Thank you for understanding");
      localStorage.setItem("desktopNotify","yes");
    }
   }

  pushSubscription()
  {
    if(!this.swPush.isEnabled)
    {
      console.log("notification not enabled");
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey : this.publicKey,
    }).then(sub => console.log(JSON.stringify(sub)))
    .catch(err => console.log(err))
  }
}
