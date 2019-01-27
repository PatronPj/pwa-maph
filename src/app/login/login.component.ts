import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';


import { LoginserviceService } from '../services/loginservice.service'


declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService,
    private cookie: CookieService) { }

  ngOnInit() {
    console.log(this._loginservice.firstMedal + "firstMedal?");
    console.log("vor initialisierung: " +this.loggedInAlready);
    this.loggedInAlready = this._loginservice.loggedIn;
    console.log("nach: "+this.loggedInAlready);
   }
  
  public auth2: any;
  loggedInAlready: boolean = false;

  routeToDashboard(): void {
    this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
  }
  logOut(): void {
    this._loginservice.loggedIn = false;
    this.ngOnInit();
  }

  get loggedIn(): boolean {
    return this._loginservice.loggedIn;
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '404055784745-ab2eksbal4955imgau07do6j1c62t44a.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
        this._loginservice.userName = profile.getName();
        console.log('Username in Service: ' + this._loginservice.userName);
        this._loginservice.userEmail = profile.getEmail();
        console.log('Email in Service: ' + this._loginservice.userEmail);
        this._loginservice.userProfileImgUrl = profile.getImageUrl();
        console.log('ProfileImgUrl in Service: ' + this._loginservice.userProfileImgUrl);
        this._loginservice.firstMedal = new Date().toLocaleDateString();
        //this.router.navigate(['/dashboard']);
        this._loginservice.loggedIn = true;
        this.loggedInAlready = this._loginservice.loggedIn;
        console.log(this.loggedInAlready);
        this.cookie.set("firstMedal", new Date().toLocaleDateString());
        this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
      }, (error) => {
        //alert(JSON.stringify(error, undefined, 2));
      });
  }
  ngAfterViewInit() {
    this.googleInit();
  }

}
