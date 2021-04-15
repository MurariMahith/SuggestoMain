import { DisplayMovie } from "./DisplayMovie";

export class DisplayMovieList
{
    listName : string = '';
    key : string = '';
    moviesInList : DisplayMovie[] =[];
    rating : number = 0;
    createdBy : string = 'ADMIN';
    isThisSeries : boolean = false;
}