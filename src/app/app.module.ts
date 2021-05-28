import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { TeluguComponent } from './components/telugu/telugu.component';
import { TamilComponent } from './components/tamil/tamil.component';
import { MalayalamComponent } from './components/malayalam/malayalam.component';
import { KannadaComponent } from './components/kannada/kannada.component';
import { MainMovieComponent } from './components/main-movie/main-movie.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { InformationComponent } from './components/information/information.component';
import { environment } from 'src/environments/environment.prod';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { PersonalComponent } from './components/personal/personal.component';
//import { environment } from '../environments/environment';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireMessagingModule } from 'angularfire2/messaging';
import { PersonalisationComponent } from './components/personalisation/personalisation.component';

import { AuthGuardService } from './services/authGuardService';
import { PeopleComponent } from './components/people/people.component';
import { MainListComponent } from './components/main-list/main-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SuggestMovieComponent } from './components/suggest-movie/suggest-movie.component';
import { AllSuggestedMoviesComponent } from './components/all-suggested-movies/all-suggested-movies.component';
import { CreateCustomListComponent } from './components/create-custom-list/create-custom-list.component';
import { FeedComponent } from './components/feed/feed.component'
import { AppUpdateService } from './services/app-update.service';
import { DownloadOurAppComponent } from './components/download-our-app/download-our-app.component';
import { ComplaintComponent } from './components/complaint/complaint.component';

import { CommaPipe } from './services/CommaPipe';
import { UnderScorePipe } from './services/UnderScorePipe';
import { PersonalisedMoviesComponent } from './components/personalised-movies/personalised-movies.component';
import { VisitProfileComponent } from './components/visit-profile/visit-profile.component';
import { PersonalisedMoviesOfCustomerComponent } from './components/personalised-movies-of-customer/personalised-movies-of-customer.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { MovieBuffBoardComponent } from './components/movie-buff-board/movie-buff-board.component';
import { FollowingProfileComponent } from './components/following-profile/following-profile.component';
import { TmdbMovieComponent } from './components/tmdb-movie/tmdb-movie.component';
import { Profile2Component } from './components/profile2/profile2.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TeluguComponent,
    TamilComponent,
    MalayalamComponent,
    KannadaComponent,
    MainMovieComponent,
    MovieListComponent,
    AllMoviesComponent,
    AboutUsComponent,
    InformationComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    PersonalComponent,
    PersonalisationComponent,
    PeopleComponent,
    MainListComponent,
    ProfileComponent,
    WishListComponent,
    SuggestMovieComponent,
    AllSuggestedMoviesComponent,
    CreateCustomListComponent,
    FeedComponent,
    DownloadOurAppComponent,
    ComplaintComponent,
    CommaPipe,
    UnderScorePipe,
    PersonalisedMoviesComponent,
    VisitProfileComponent,
    PersonalisedMoviesOfCustomerComponent,
    WelcomePageComponent,
    MovieBuffBoardComponent,
    FollowingProfileComponent,
    TmdbMovieComponent,
    Profile2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireAuthModule,
    AngularFireMessagingModule
  ],
  providers: [
    AuthGuardService,
    AppUpdateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
