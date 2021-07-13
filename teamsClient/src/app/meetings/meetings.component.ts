import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {
  data:any=[]
  nomeetings:boolean=false
  constructor(private auth:AngularFireAuth,private service:SharedService,private router:Router,private snackbar:MatSnackBar) {
    this.service.getgroups().then((res)=>{
      this.data=res
      }
    ).catch(e=>{this.nomeetings=true})
  }

  ngOnInit(): void {
  }
  Invite(id:number){
    let result="Join the meet at\nhttps://teams-client-892ac.web.app/group\nGroup Id: "+this.data[id].group_id+'\n'+"Password: "+this.data[id].password
    return result;
  }
  async logout() {
    await this.auth.signOut().then(()=>{
      this.auth.idToken.subscribe((id)=>{
        if(id==null)this.router.navigate(['landing']);
      })
    }
    );
  }
  openSnackBar() {
    this.snackbar.open("Details copied!!", "close");
  }

}
