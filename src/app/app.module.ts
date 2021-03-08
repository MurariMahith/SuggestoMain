import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
//import { environment } from '../environments/environment';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';

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
    InformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // AngularFirestoreModule,
    // AngularFireAuthModule,
    // AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
