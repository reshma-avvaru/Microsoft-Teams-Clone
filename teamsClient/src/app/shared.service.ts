import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {retry,catchError} from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable()
export class SharedService {

  readonly APIUrl="https://secret-tor-84541.herokuapp.com";
  //readonly APIUrl="http://127.0.0.1:8000";

  private user:any;

  constructor(private http:HttpClient,private auth:AngularFireAuth) { 
    this.auth.user.subscribe(user =>{
      this.user=user
    })
  }
  async getgroups():Promise<string>{
    return await this.http.get<any>(this.APIUrl+'/get_all_groups/'+this.user.email).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ).toPromise();
  }
  async getUserId(name:string):Promise<string>{
    return await this.http.get<any>(this.APIUrl+'/get_userId/'+name).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    ).toPromise();
  }
  async get_new_group(username:any,password:string,topic:string):Promise<any[]>{
     return await this.http.get<any[]>(this.APIUrl+'/new_group/'+username+'/'+password+'/'+topic+'/').pipe( 
      retry(3),
      catchError(this.handleError) // then handle the error
    ).toPromise();
  }

  async join_group(username:any,password:string,group_id:string):Promise<any[]>{
    return await this.http.get<any[]>(this.APIUrl+'/join_group/'+username+'/'+group_id+'/'+password).pipe(
      retry(3),
      catchError(this.handleError) // then handle the error
    ).toPromise()
  }

  private handleError(error: HttpErrorResponse) {
    if(error.status===400){
      if(error.error==='incorrect password')return throwError('invalid password')
    }
    else if (error.status === 404) {
      if(error.error==='no meetings yet') return throwError('No meetings yet')
      console.error('User does not exist:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something wrong happened; please try again later.');
  }
}
