import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
constructor(private readonly updates: SwUpdate) {
  this.updates.available.subscribe(event => {
    this.showAppUpdateAlert();
  });
}
showAppUpdateAlert() {
  var updateBool = confirm("A new update is available, do you want to update?")
  if(updateBool)
  {
    this.doAppUpdate();
  }
  else
  {
    
  }
}
doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}