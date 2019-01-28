import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { LoginserviceService } from '../services/loginservice.service'
import { forEach } from '@angular/router/src/utils/collection';

declare const gapi: any;
// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.


// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService,
    private cookie: CookieService, private http: HttpClient) { }

  ngOnInit() {
    this.loggedInAlready = this._loginservice.loggedIn;
    console.log("nach: " + this.loggedInAlready);
  }
  public request: any;

  public auth2: any;
  public client: any;

  public apiKey: string = 'AIzaSyCD7NB3EY0uh_XstcFcrXCPxLgRELVeFTU';

  public clientId: string = '64488813471-hcdcur25u5s1q74qkjb5f4afh3qpnsht.apps.googleusercontent.com';
  public scopes: string = 'https://www.googleapis.com/auth/fitness.activity.read';

  loggedInAlready: boolean = false;
  public stepsCounted: number = 0;

  //
  public handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', this.initClient());
  }
  public initClient() {
    gapi.load('client', () => {
      this.client = gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        scope: this.scopes
      });

      //this.auth2 = gapi.this.auth2.getAuthInstance();
    });
  }
  //

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
        client_id: '64488813471-hcdcur25u5s1q74qkjb5f4afh3qpnsht.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      console.log("gapi auth: " + gapi.auth2.getAuthInstance());

      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        /*
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        */
        this._loginservice.userName = profile.getName();
        console.log('Username in Service: ' + this._loginservice.userName);
        this._loginservice.userEmail = profile.getEmail();
        console.log('Email in Service: ' + this._loginservice.userEmail);
        this._loginservice.userProfileImgUrl = profile.getImageUrl();
        console.log('ProfileImgUrl in Service: ' + this._loginservice.userProfileImgUrl);
        this._loginservice.firstMedal = new Date().toLocaleDateString();
        this._loginservice.loggedIn = true;
        this.loggedInAlready = this._loginservice.loggedIn;
        console.log(this.loggedInAlready);
        this.cookie.set("firstMedal", new Date().toLocaleDateString());
        this.makeApiCall();
        this._loginservice.steps = this.stepsCounted;
        this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
      }, (error) => {
        //alert(JSON.stringify(error, undefined, 2));
      });
  }

  //playground
  //https://www.googleapis.com/fitness/v1/users/me/dataSources
  //https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate
  public makeApiCall()  {
    var stepsCount = 0;
    gapi.client.load('fitness', 'v1', () => {
      this.request = gapi.client.fitness.users.dataSources.datasets.get({
        userId: 'me',
        //richtige SourceId, um aktuelle Schrittanzahl zu getten
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
        datasetId: '1548633600000000000-' + '1548806340000000000',
      }).then(function (response) {
        //console.log('response body:, ' + response.body);
        console.log('response length: ' + response.result.point.length);
        for (let index = 0; index < response.result.point.length; index++) {
          stepsCount += response.result.point[index].value[0].intVal;
        }
        console.log("steps gesamt: "+stepsCount);
      }, function (reason) {
        console.log('Error: ' + reason.result.error.message + " -----");
      });
    });
    this.stepsCounted = stepsCount;
  }

  ngAfterViewInit() {
    this.googleInit();
    this.handleClientLoad();
    /*
    let obs = this.http.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.step_count.delta:com.google.android.gms:estimated_steps/datasets/1548547200000-1548621420000');
    obs.subscribe(() => console.log('got the resp'));
    */
  }

}
