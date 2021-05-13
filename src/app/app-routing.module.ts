import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { ComplaintComponent } from './components/complaint/complaint.component';
import { CreateCustomListComponent } from './components/create-custom-list/create-custom-list.component';
import { DownloadOurAppComponent } from './components/download-our-app/download-our-app.component';
import { FeedComponent } from './components/feed/feed.component';
import { HomeComponent } from './components/home/home.component';
import { InformationComponent } from './components/information/information.component';
import { KannadaComponent } from './components/kannada/kannada.component';
import { MainListComponent } from './components/main-list/main-list.component';
import { MainMovieComponent } from './components/main-movie/main-movie.component';
import { MalayalamComponent } from './components/malayalam/malayalam.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { PeopleComponent } from './components/people/people.component';
import { PersonalComponent } from './components/personal/personal.component';
import { PersonalisationComponent } from './components/personalisation/personalisation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SuggestMovieComponent } from './components/suggest-movie/suggest-movie.component';
import { TamilComponent } from './components/tamil/tamil.component';
import { TeluguComponent } from './components/telugu/telugu.component';
import { WishListComponent } from './components/wish-list/wish-list.component';

import { 
  AuthGuardService as AuthGuard 
} from './services/authGuardService';

const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'telugu',  component: TeluguComponent },
  { path: 'tamil',  component: TamilComponent },
  { path: 'kannada',  component: KannadaComponent },
  { path: 'profile',  component: MalayalamComponent,canActivate: [AuthGuard] },
  { path: 'all',  component: AllMoviesComponent },
  { path: 'movie/:key',  component: MainMovieComponent },
  { path: 'list/:key',  component: MainListComponent },
  { path: 'movielist',  component: MovieListComponent },
  { path: 'movielist/:key',  component: MovieListComponent, canActivate: [AuthGuard]  },
  { path: 'aboutus',  component: AboutUsComponent },
  { path: 'info',  component: InformationComponent },
  { path: 'personal',  component: PersonalComponent,canActivate: [AuthGuard] },
  { path: 'login',  component: LoginComponent },
  { path: 'signup',  component: SignupComponent },
  { path: 'download',  component: DownloadOurAppComponent },
  { path: 'complaint',  component: ComplaintComponent },
  { path: 'resetPassword',  component: ResetPasswordComponent,canActivate: [AuthGuard] },
  { path: 'personalisation',  component: PersonalisationComponent,canActivate: [AuthGuard] },
  { path: 'profile2',  component: ProfileComponent,canActivate: [AuthGuard] },
  { path: 'people',  component: PeopleComponent,canActivate: [AuthGuard] },
  { path: 'wlist/:key',  component: WishListComponent,canActivate: [AuthGuard] },
  { path: 'suggest',  component: SuggestMovieComponent,canActivate: [AuthGuard] },
  { path: 'createList',  component: CreateCustomListComponent,canActivate: [AuthGuard] },
  { path: 'news-feed',  component: FeedComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '404', component: HomeComponent}
  //{path: '**', redirectTo: '/home'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
