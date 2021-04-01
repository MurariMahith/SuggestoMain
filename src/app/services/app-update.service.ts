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
  alert("A new update is available, Please update its takes just 2 seconds...")
  this.doAppUpdate()
}
doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}