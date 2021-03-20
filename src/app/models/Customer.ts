import { RatedMovies } from "./Customer Related/RatedMovies";

export class Customer
{
    uid : string = '';
    name : string = '';
    email : string = '';
    emailVerified  : boolean = false;
    wishlistedMovies : string[] = [];
    ratedMovies : RatedMovies[] = [];
    watchedMovies : string[] = [];
    personalisation : boolean = false;
    preferredGenre : string[] = [];
    preferredLanguages : string[] = [];
    seePersonalisedContent : boolean = false;
    personalisedContentStartTime : string = '';

}