import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {SharedService} from './shared.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { GroupCallComponent } from './group-call/group-call.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { LandingComponent } from './landing/landing.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import { PERSISTENCE } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MeetingsComponent } from './meetings/meetings.component';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    GroupCallComponent,
    LandingComponent,
    MeetingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    NgxEmojiPickerModule,
    MatExpansionModule
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'session' },
    SharedService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
