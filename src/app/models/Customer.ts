import { RatedMovies } from "./Customer Related/RatedMovies";

export class Customer
{
    uid : string = '';
    name : string = '';
    email : string = '';
    emailVerified  : boolean = false;
    customerPhotoUrl : string = '';
    wishlistedMovies : string[] = [];
    ratedMovies : RatedMovies[] = [];
    watchedMovies : string[] = [];
    personalisation : boolean = false;
    preferredGenre : string[] = [];
    preferredLanguages : string[] = [];
    seePersonalisedContent : boolean = false;
    personalisedContentStartTime : string = '';
    shareWishlistedMovies : boolean = false;

    constructor()
    {
        this.uid = '';
        this.name = '';
        this.email = '';
        this.emailVerified  = false;
        this.customerPhotoUrl = '';
        this.wishlistedMovies = [];
        this.ratedMovies = [];
        this.watchedMovies = [];
        this.personalisation = false;
        this.preferredGenre = [];
        this.preferredLanguages = [];
        this.seePersonalisedContent = false;
        this.personalisedContentStartTime = '';
        this.shareWishlistedMovies = false;
    }
}