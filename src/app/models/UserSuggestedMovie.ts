import { Language } from "./Language";

export class UserSuggestedMovie
{
    title : string = '';
    language : Language = new Language();
    rating : number = 0;
    adminApproved : boolean = false;
    duplicated : boolean = false;
}