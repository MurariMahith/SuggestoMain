import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'commapipe'
})
export class CommaPipe implements PipeTransform {
   transform(val : string) : string {
      console.log(val);
       val = val.trim();
       if(val[val.length-1] === ",")
       {
           val = val.slice(0,val.length-1)
       }
      return val;
   }
}