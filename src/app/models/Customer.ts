import { RatedMovies } from "./Customer Related/RatedMovies";
import { FollowObject } from "./FollowObject";

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

    showWishlistToFollowers : boolean = false;
    showWatchedListToFollowers : boolean = false;

    followers : FollowObject[] = [];
    following : FollowObject[] = [];
    followRequestReceived : FollowObject[] = [];
    followRequestSent : string[] = [];

    appliedForVerifiedAccount : boolean = false;
    verifiedAccount : boolean = false;
    socialMediaAccountUrl : string = ''
    smallDescription : string = '';

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