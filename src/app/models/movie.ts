import { Genre } from '../models/Genre'
import { Language } from '../models/Language'
import { MoviePlatForm } from '../models/MoviePlatform'
export class Movie
{
    imageUrl : string = '';
    cardImageUrl : string = '';
    title : string = '';
    releaseYear : string = '';
    description : string = '';
    language : Language;
    movieGenre : Genre;
    availableIn : MoviePlatForm;
    subTags : string[] = [];    
    cast : string[] = [];
    suggestedDate : string = '';
    ytTrailerLink : string = '';
    rating : number = 0;
}