import { Genre } from '../models/Genre'
import { Language } from '../models/Language'
import { MoviePlatForm } from '../models/MoviePlatform'
export class FMovie
{
    key : string;
    imageUrl : string = '';
    cardImageUrl : string = '';
    title : string = '';
    releaseYear : string = '';
    description : string = '';
    language : Language = new Language();
    movieGenre : Genre = new Genre();
    availableIn : MoviePlatForm = new MoviePlatForm();
    subTags : string[] = [];    
    cast : string[] = [];
    suggestedDate : string = '';
    ytTrailerLink : string = '';
    rating : number = 0;
    ottLink : string = '';
    torrentDownloadLink : string = '';
    torrentOnlineLink : string = '';
}