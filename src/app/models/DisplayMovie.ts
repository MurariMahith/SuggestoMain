import { MoviePlatForm } from "./MoviePlatform";

export class DisplayMovie
{
    title : string = '';
    trailerUrl : string = '';
    //movieLink : string = 'https://www.primevideo.com/detail/0RZFTNZ3FJJB8TD0JNI63TJ7AA/ref=atv_hm_hom_c_8pZiqd_2_1';
    language : string = '';
    availableIn : string = '';
    ott : MoviePlatForm = new MoviePlatForm();
    genre : string = '';
    releaseYear : string = '';
    bigImageUrl : string = '';
    smallImageUrl : string = '';
    description : string = '';
    subTags : string = ''; 
    cast : string = '';
    key : string = '';
    suggestedDate : string = '';
    //rating is to sort array based on rating
    rating : number = 0;
    ottLink : string = 'https://www.primevideo.com/detail/0RZFTNZ3FJJB8TD0JNI63TJ7AA/ref=atv_hm_hom_c_8pZiqd_2_1';
    torrentDownloadLink : string = '';
    torrentOnlineLink : string = '';
    runTime : string = '';
    visitedCount : number = 0;
    isThisSeries : boolean = false;
    numberOfSeasons : number = 0;
    numberOfEpisodes : number = 0;
    seriesStatus : string = '';
}