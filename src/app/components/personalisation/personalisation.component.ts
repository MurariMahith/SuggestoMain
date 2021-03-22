import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/Customer';
import { Genre } from 'src/app/models/Genre';
import { Language } from 'src/app/models/Language';
import { CustomerService } from 'src/app/services/customerService';

@Component({
  selector: 'app-personalisation',
  templateUrl: './personalisation.component.html',
  styleUrls: ['./personalisation.component.css']
})
export class PersonalisationComponent implements OnInit {

  showGenreWindow : boolean = true;
  showLanguageWindow : boolean = true;
  showFinalWindow : boolean = true;

  allGenres : string[] = [];
  genreObj : Genre = new Genre();

  allLanguages : string[] = [];
  langObj : Language = new Language();

  genreSelected : string[] = [];
  languagesSelected : string[] = [];

  currentCustomer : Customer;

  constructor(private customerService : CustomerService) { }

  ngOnInit(): void {

    this.allGenres = Object.keys(this.genreObj)
    this.allLanguages = Object.keys(this.langObj)

    if(localStorage.getItem("loggedIn") !== null && localStorage.getItem("loggedIn") === "true" && localStorage.getItem("uid") !== null)
    {
      this.customerService.getLoggedInCustomer()
        .subscribe(o =>
          {
            console.log(o)
            if(o.find(x => x.uid === localStorage.getItem("uid")))
            {
              this.currentCustomer = o.find(x => x.uid === localStorage.getItem("uid"))
            }
            console.log(this.currentCustomer)
          })
    }

  }

  submitPreferences()
  {
    console.log(this.genreSelected)
    console.log(this.languagesSelected)
    this.currentCustomer.preferredGenre = this.genreSelected;
    this.currentCustomer.preferredLanguages = this.languagesSelected;
    this.customerService.updateCustomer(this.currentCustomer["key"],this.currentCustomer).then(o => window.location.href="/")
  }

  selectGenre(g :string)
  {
    //this.genreSelected.push(g)
    console.log(g)
    var element = document.querySelector("#"+g)  
    if(element.classList.contains("btn-outline-primary")) 
    {
      element.classList.add("btn-success")
      element.classList.remove("btn-outline-primary")
      this.genreSelected.push(g)
    }  
    else
    {
      element.classList.add("btn-outline-primary")
      element.classList.remove("btn-success")
      for( var i = 0; i < this.genreSelected.length; i++)
      {     
        if ( this.genreSelected[i] === g) 
        {   
          this.genreSelected.splice(i, 1); 
        }
      }
    } 
    console.log(this.genreSelected) 
    
  }

  selectLang(g : string)
  {
    console.log(g)
    var element = document.querySelector("#"+g)  
    if(element.classList.contains("btn-outline-primary")) 
    {
      element.classList.add("btn-success")
      element.classList.remove("btn-outline-primary")
      this.languagesSelected.push(g)
    }  
    else
    {
      element.classList.add("btn-outline-primary")
      element.classList.remove("btn-success")
      for( var i = 0; i < this.languagesSelected.length; i++)
      {     
        if ( this.languagesSelected[i] === g) 
        {   
          this.languagesSelected.splice(i, 1); 
        }
      }
    } 
    console.log(this.languagesSelected) 
  }

  genreDone()
  {
    document.getElementById("language").scrollIntoView({ behavior: "smooth"})
  }
  genreBack()
  {
    document.getElementById("genre").scrollIntoView({ behavior: "smooth"})
  }

  languageDone()
  {
    document.getElementById("final").scrollIntoView({ behavior: "smooth"})
  }
  languageBack()
  {
    document.getElementById("language").scrollIntoView({ behavior: "smooth"})
  }

}
