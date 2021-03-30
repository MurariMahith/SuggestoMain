import { Language } from "./Language";

export class UserSuggestedMovie
{
    title : string = '';
    language : Language = new Language();
    rating : number = 0;
    suggestedBy : string = 'ADMIN';
    adminApproved : boolean = false;
    duplicated : boolean = false;
}