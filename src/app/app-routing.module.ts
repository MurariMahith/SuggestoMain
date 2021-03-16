import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { InformationComponent } from './components/information/information.component';
import { KannadaComponent } from './components/kannada/kannada.component';
import { MainMovieComponent } from './components/main-movie/main-movie.component';
import { MalayalamComponent } from './components/malayalam/malayalam.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { PersonalComponent } from './components/personal/personal.component';
import { TamilComponent } from './components/tamil/tamil.component';
import { TeluguComponent } from './components/telugu/telugu.component';

const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'telugu',  component: TeluguComponent },
  { path: 'tamil',  component: TamilComponent },
  { path: 'kannada',  component: KannadaComponent },
  { path: 'malayalam',  component: MalayalamComponent },
  { path: 'all',  component: AllMoviesComponent },
  { path: 'movie/:key',  component: MainMovieComponent },
  { path: 'movielist',  component: MovieListComponent },
  { path: 'aboutus',  component: AboutUsComponent },
  { path: 'info',  component: InformationComponent },
  { path: 'personal',  component: PersonalComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'signup',  component: SignupComponent },
  { path: 'resetPassword',  component: ResetPasswordComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
