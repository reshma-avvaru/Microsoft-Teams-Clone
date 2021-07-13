import { Component, OnInit} from '@angular/core';
import { SharedService } from './shared.service';
import { AngularFireAuth } from '@angular/fire/auth';
import{Router} from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'teamsClient';
  constructor(private router:Router){
    if(this.router.url==="/")this.router.navigate(['group'])
  }
  ngOnInit():void{
  }
}
