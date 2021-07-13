import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  constructor(public auth: AngularFireAuth,private router:Router) { }

  ngOnInit(): void {
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(()=>{
      this.router.navigate(['group'])
      }
    );
    
  }
  logout() {
    this.auth.signOut();
  }
}
