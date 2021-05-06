import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'commapipe'
})
export class UnderScorePipe implements PipeTransform {
   transform(val : string) : string {
       if(val.includes("_"))
       {
           val.replace("_"," ")
       }
       return val;
   }
}