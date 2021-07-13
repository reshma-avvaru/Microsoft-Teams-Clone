import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupCallComponent } from './group-call/group-call.component';
import { LandingComponent } from './landing/landing.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MeetingsComponent } from './meetings/meetings.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['landing']);
const redirectLoggedInToGroup = () => redirectLoggedInTo(['group']);
const routes: Routes = [
  {
    path:'group',
    component:GroupCallComponent,
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path:'meeting',
    component:MeetingsComponent,
    canActivate:[AngularFireAuthGuard],
    data:{authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path:'landing',
   component:LandingComponent,
   data: { authGuardPipe: redirectLoggedInToGroup }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
