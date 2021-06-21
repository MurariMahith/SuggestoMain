import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { FollowObject } from '../models/FollowObject';
import { CustomerService } from '../services/customerService';

@Injectable({
  providedIn: 'root'
})
export class PeopleServiceService {

  constructor(private customerService:CustomerService) { }

  sendFollowRequest(receiverKey : string,allCustomers : Customer[],currentCustomer : Customer)
  {
    var receiverCustomer = allCustomers.find(x => x.uid === receiverKey);
    //console.log(receiverCustomer);

    if(receiverCustomer)
    {
      var request : FollowObject = new FollowObject();
      request.followerName = currentCustomer.name;
      request.followerUserId = currentCustomer.uid;
      request.followerphotoUrl = currentCustomer.customerPhotoUrl;
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
      
      if(currentCustomer.followRequestSent)
      {
        currentCustomer.followRequestSent.push(receiverCustomer.uid);
      }
      else
      {
        var strarr :string[] = [];
        strarr.push(receiverCustomer.uid);
        currentCustomer.followRequestSent = strarr
      }
      this.customerService.updateCustomer(currentCustomer['key'],currentCustomer)
      //console.log(receiverCustomer)
      //console.log(currentCustomer)
    } 
  }

  unsendFollowRequest(requestedKey : string,allCustomers : Customer[],currentCustomer : Customer)
  {
    var requestedCustomer =allCustomers.find(x => x.uid == requestedKey)
    if(requestedCustomer)
    {
      if(currentCustomer.followRequestSent.includes(requestedKey))
      {
        for( var i = 0; i < currentCustomer.followRequestSent.length; i++)
        {     
          if (currentCustomer.followRequestSent[i] == requestedKey) 
          {   
            currentCustomer.followRequestSent.splice(i, 1); 
          }
        }
      }

      for( var i = 0; i < requestedCustomer.followRequestReceived.length; i++)
      {     
        if (requestedCustomer.followRequestReceived[i].followerUserId == currentCustomer.uid) 
        {   
          requestedCustomer.followRequestReceived.splice(i, 1); 
        }
      }

      //console.log(currentCustomer)
      //console.log(requestedCustomer)
      this.customerService.updateCustomer(currentCustomer['key'],currentCustomer)
      this.customerService.updateCustomer(requestedCustomer['key'],requestedCustomer)
    }
  }

  acceptFollowRequest(otherKey : string,allCustomers : Customer[],currentCustomer : Customer)
  {
    
    var otherCustomer = allCustomers.find(x => x.uid == otherKey)
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
        if (otherCustomer.followRequestSent[i] == currentCustomer.uid) 
        {   
          otherCustomer.followRequestSent.splice(i, 1); 
        }
      }

      for( var i = 0; i < currentCustomer.followRequestReceived.length; i++)
      {     
        if (currentCustomer.followRequestReceived[i].followerUserId == otherKey) 
        {   
          currentCustomer.followRequestReceived.splice(i, 1); 
        }
      }

      var followerObj = new FollowObject();
      followerObj.followerName = otherCustomer.name;
      followerObj.followerUserId = otherCustomer.uid;
      followerObj.followerphotoUrl = otherCustomer.customerPhotoUrl;

      currentCustomer.followers.push(followerObj);

      var followingObj = new FollowObject()
      followingObj.followerName = currentCustomer.name;
      followingObj.followerUserId = currentCustomer.uid;
      followingObj.followerphotoUrl = currentCustomer.customerPhotoUrl;

      otherCustomer.following.push(followingObj);

      //console.log(currentCustomer)
      //console.log(otherCustomer);

      this.customerService.updateCustomer(currentCustomer['key'],currentCustomer)
      this.customerService.updateCustomer(otherCustomer['key'],otherCustomer)

    }
  }

  unfollow(otherKey : string,allCustomers : Customer[],currentCustomer : Customer)
  {
    var customerToUnfollow = allCustomers.find(x => x.uid == otherKey)
    if(customerToUnfollow.followers)
    {
      for( var i = 0; i < customerToUnfollow.followers.length; i++)
      {     
        if (customerToUnfollow.followers[i].followerUserId == currentCustomer.uid) 
        {   
          customerToUnfollow.followers.splice(i, 1); 
        }
      }     
      
      for( var i = 0; i < currentCustomer.following.length; i++)
      {     
        if (currentCustomer.following[i].followerUserId == customerToUnfollow.uid) 
        {   
          currentCustomer.following.splice(i, 1); 
        }
      } 

      this.customerService.updateCustomer(currentCustomer['key'],currentCustomer)
      this.customerService.updateCustomer(customerToUnfollow['key'],customerToUnfollow) 
      
      
      //update other customer
      //delete follow object from following in current customer
      //update current customer
    }
  }

}
