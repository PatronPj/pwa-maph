import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginserviceService } from '../services/loginservice.service'

declare const gapi: any;
// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService,
    private cookie: CookieService) {
  }

  ngOnInit() {
    this.loggedInAlready = this._loginservice.loggedIn;
    console.log("nach: " + this.loggedInAlready);
  }

  //gapi
  public request: any;
  public auth2: any;
  public client: any;

  //CREDENTIALS
  //google projekt: DevelopStartUpTheraphy
  public apiKey: string = 'AIzaSyCD7NB3EY0uh_XstcFcrXCPxLgRELVeFTU';
  public clientId: string = '64488813471-hcdcur25u5s1q74qkjb5f4afh3qpnsht.apps.googleusercontent.com';
  public scopes: string = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.blood_glucose.read	https://www.googleapis.com/auth/fitness.blood_pressure.read	https://www.googleapis.com/auth/fitness.body.read	https://www.googleapis.com/auth/fitness.body_temperature.read	https://www.googleapis.com/auth/fitness.location.read	https://www.googleapis.com/auth/fitness.nutrition.read	https://www.googleapis.com/auth/fitness.oxygen_saturation.read	https://www.googleapis.com/auth/fitness.reproductive_health.read';

  //helpers
  loggedInAlready: boolean = false;
  public stepsCounted: number = 0;
  public load: boolean = false;

  get loggedIn(): boolean {
    return this._loginservice.loggedIn;
  }

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
    });
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public loading() {
    if (this.load) {
      this.load = false;
    }
    else {
      this.load = true;
    }
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
        this._loginservice.userEmail = profile.getEmail();
        this._loginservice.userProfileImgUrl = profile.getImageUrl();

        this._loginservice.firstMedal = new Date().toLocaleDateString();
        this._loginservice.loggedIn = true;
        this.loggedInAlready = this._loginservice.loggedIn;
        this.cookie.set("firstMedal", new Date().toLocaleDateString());

        this.makeApiCallForSteps();
        this.makeApiCallForDistance();
        this.makeApiCallForCalories();

        //for LineGraph
        this.makeApiCallForFirstOfLastThreeDays();
        this.makeApiCallForSecondOfLastThreeDays();
        this.makeApiCallForThridOfLastThreeDays();

        this.makeApiCallForCaloriesForFirstOfLastThreeDays();
        this.makeApiCallForCaloriesForSecondOfLastThreeDays();
        this.makeApiCallForCaloriesForThridOfLastThreeDays();

        this.makeApiCallForDistanceForFirstOfLastThreeDays();
        this.makeApiCallForDistanceForSecondOfLastThreeDays();
        this.makeApiCallForDistanceForThridOfLastThreeDays();
        this.loading();
        let self = this;
        /*
        setTimeout(function () {
          this.load = false;
          //self.ngZone.run(() => self.router.navigate(['/dashboard'])).then();
        }, 5000);
        */
      }, (error) => {
        this.loading();
        console.log("Login Error: " + error);
      });
  }

  //playground
  //https://www.googleapis.com/fitness/v1/users/me/dataSources
  //https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate
  public makeApiCallForSteps() {
    var stepsCount = 0;
    var arrayOfTimes = [] as any[];
    var arrayStepsOfToday = [] as any[];
    //helpers
    var hour0 = 0;
    var hour1 = 0;
    var hour2 = 0;
    var hour3 = 0;
    var hour4 = 0;
    var hour5 = 0;
    var hour6 = 0;
    var hour7 = 0;
    var hour8 = 0;
    var hour9 = 0;
    var hour10 = 0;
    var hour11 = 0;
    var hour12 = 0;
    var hour13 = 0;
    var hour14 = 0;
    var hour15 = 0;
    var hour16 = 0;
    var hour17 = 0;
    var hour18 = 0;
    var hour19 = 0;
    var hour20 = 0;
    var hour21 = 0;
    var hour22 = 0;
    var hour23 = 0;

    var datasetID: string = this.setStartAndEndTimeInNanoSeconds();
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          //correct SourceId, to get steps Count
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          //console.log('response body:, ' + response.body);
          for (let index = 0; index < response.result.point.length; index++) {
            stepsCount += response.result.point[index].value[0].intVal;
          }

          //for detailView
          for (let j = 0; j < response.result.point.length; j++) {
            var date = new Date(response.result.point[j].startTimeNanos / 1000000);
            // Hours part from the timestamp
            var hours = date.getHours();

            switch (hours) {
              case 0:
                hour0 += response.result.point[j].value[0].intVal;
                break;
              case 1:
                hour1 += response.result.point[j].value[0].intVal;
                break;
              case 2:
                hour2 += response.result.point[j].value[0].intVal;
                break;
              case 3:
                hour3 += response.result.point[j].value[0].intVal;
                break;
              case 4:
                hour4 += response.result.point[j].value[0].intVal;
                break;
              case 5:
                hour5 += response.result.point[j].value[0].intVal;
                break;
              case 6:
                hour6 += response.result.point[j].value[0].intVal;
                break;
              case 7:
                hour7 += response.result.point[j].value[0].intVal;
                break;
              case 8:
                hour8 += response.result.point[j].value[0].intVal;
                break;
              case 9:
                hour9 += response.result.point[j].value[0].intVal;
                break;
              case 10:
                hour10 += response.result.point[j].value[0].intVal;
                break;
              case 11:
                hour11 += response.result.point[j].value[0].intVal;
                break;
              case 12:
                hour12 += response.result.point[j].value[0].intVal;
                break;
              case 13:
                hour13 += response.result.point[j].value[0].intVal;
                break;
              case 14:
                hour14 += response.result.point[j].value[0].intVal;
                break;
              case 15:
                hour15 += response.result.point[j].value[0].intVal;
                break;
              case 16:
                hour16 += response.result.point[j].value[0].intVal;
                break;
              case 17:
                hour17 += response.result.point[j].value[0].intVal;
                break;
              case 18:
                hour18 += response.result.point[j].value[0].intVal;
                break;
              case 19:
                hour19 += response.result.point[j].value[0].intVal;
                break;
              case 20:
                hour20 += response.result.point[j].value[0].intVal;
                break;
              case 21:
                hour21 += response.result.point[j].value[0].intVal;
                break;
              case 22:
                hour22 += response.result.point[j].value[0].intVal;
                break;
              case 23:
                hour23 += response.result.point[j].value[0].intVal;
                break;
            }
            //console.log("timeStamp: " + response.result.point[j].startTimeNanos);
          }

          arrayStepsOfToday[0] = hour0;
          arrayStepsOfToday[1] = hour1;
          arrayStepsOfToday[2] = hour2;
          arrayStepsOfToday[3] = hour3;
          arrayStepsOfToday[4] = hour4;
          arrayStepsOfToday[5] = hour5;
          arrayStepsOfToday[6] = hour6;
          arrayStepsOfToday[7] = hour6;
          arrayStepsOfToday[8] = hour8;
          arrayStepsOfToday[9] = hour9;
          arrayStepsOfToday[10] = hour10;
          arrayStepsOfToday[11] = hour11;
          arrayStepsOfToday[12] = hour12;
          arrayStepsOfToday[13] = hour13;
          arrayStepsOfToday[14] = hour14;
          arrayStepsOfToday[15] = hour15;
          arrayStepsOfToday[16] = hour16;
          arrayStepsOfToday[17] = hour17;
          arrayStepsOfToday[18] = hour18;
          arrayStepsOfToday[19] = hour19;
          arrayStepsOfToday[20] = hour20;
          arrayStepsOfToday[21] = hour21;
          arrayStepsOfToday[22] = hour22;
          arrayStepsOfToday[23] = hour23;

          self._loginservice.timesOfToday = arrayOfTimes;
          self._loginservice.stepsOfToday = arrayStepsOfToday;
          self._loginservice.steps = stepsCount;
          console.log("steps gesamt: " + stepsCount);
          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  //distance dataSourceId: derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta
  public makeApiCallForDistance() {
    var distanceCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSeconds();
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            distanceCount += response.result.point[index].value[0].fpVal;
          }
          var distanceRound = Math.round(distanceCount * 100) / 100;

          self._loginservice.distance = Math.floor(distanceRound);
          console.log("distance gesamt: " + Math.floor(distanceRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForCalories() {
    var caloriesCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSeconds();
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            caloriesCount += response.result.point[index].value[0].fpVal;
          }
          var caloriesRound = Math.round(caloriesCount * 100) / 100;
          self._loginservice.calories = Math.floor(caloriesRound);
          console.log("calories gesamt: " + Math.floor(caloriesRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForFirstOfLastThreeDays() {
    var stepsCount = 0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(3, 2);
    let self = this;
    console.log("hier: " + datasetID);

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          //correct SourceId, to get steps Count
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          //console.log('response body:, ' + response.body);
          for (let index = 0; index < response.result.point.length; index++) {
            stepsCount += response.result.point[index].value[0].intVal;
          }
          self._loginservice.firstOfLastOfThree = stepsCount;
          console.log("steps first of last three days gesamt was: " + stepsCount);
          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForSecondOfLastThreeDays() {
    var stepsCount = 0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(2, 1);
    let self = this;
    console.log("hier: " + datasetID);

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          //correct SourceId, to get steps Count
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          //console.log('response body:, ' + response.body);
          for (let index = 0; index < response.result.point.length; index++) {
            stepsCount += response.result.point[index].value[0].intVal;
          }
          self._loginservice.secondOfLastOfThree = stepsCount;
          console.log("steps second of last three days gesamt was: " + stepsCount);
          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForThridOfLastThreeDays() {
    var stepsCount = 0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(1, 0);
    let self = this;
    console.log("hier: " + datasetID);

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          //correct SourceId, to get steps Count
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          //console.log('response body:, ' + response.body);
          for (let index = 0; index < response.result.point.length; index++) {
            stepsCount += response.result.point[index].value[0].intVal;
          }
          self._loginservice.thirdOfLastOfThree = stepsCount;
          console.log("steps third of last three days gesamt was: " + stepsCount);
          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForCaloriesForFirstOfLastThreeDays() {
    var caloriesCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(3, 2);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            caloriesCount += response.result.point[index].value[0].fpVal;
          }
          var caloriesRound = Math.round(caloriesCount * 100) / 100;
          self._loginservice.caloriesFirstOfLastOfThree = Math.floor(caloriesRound);
          console.log("calories first of last three days gesamt was: " + Math.floor(caloriesRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForCaloriesForSecondOfLastThreeDays() {
    var caloriesCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(2, 1);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            caloriesCount += response.result.point[index].value[0].fpVal;
          }
          var caloriesRound = Math.round(caloriesCount * 100) / 100;
          self._loginservice.caloriesSecondOfLastOfThree = Math.floor(caloriesRound);
          console.log("calories second of last three days gesamt was: " + Math.floor(caloriesRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForCaloriesForThridOfLastThreeDays() {
    var caloriesCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(1, 0);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            caloriesCount += response.result.point[index].value[0].fpVal;
          }
          var caloriesRound = Math.round(caloriesCount * 100) / 100;
          self._loginservice.caloriesThirdOfLastOfThree = Math.floor(caloriesRound);
          console.log("calories third of last three days gesamt was: " + Math.floor(caloriesRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForDistanceForFirstOfLastThreeDays() {
    var distanceCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(3, 2);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            distanceCount += response.result.point[index].value[0].fpVal;
          }
          var distanceRound = Math.round(distanceCount * 100) / 100;

          self._loginservice.distanceFirstOfLastOfThree = Math.floor(distanceRound);
          console.log("distance first of last three days gesamt was: " + Math.floor(distanceRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForDistanceForSecondOfLastThreeDays() {
    var distanceCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(2, 1);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            distanceCount += response.result.point[index].value[0].fpVal;
          }
          var distanceRound = Math.round(distanceCount * 100) / 100;

          self._loginservice.distanceSecondOfLastOfThree = Math.floor(distanceRound);
          console.log("distance second of last three days gesamt was: " + Math.floor(distanceRound));

          resolve();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }

  public makeApiCallForDistanceForThridOfLastThreeDays() {
    var distanceCount = 0.0;
    var datasetID: string = this.setStartAndEndTimeInNanoSecondsForLastThreeDays(1, 0);
    let self = this;

    var promise = new Promise((resolve, reject) => {
      gapi.client.load('fitness', 'v1', () => {
        this.request = gapi.client.fitness.users.dataSources.datasets.get({
          userId: 'me',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
          //time in NanoSeconds 19 literals, milliseconds has 13 lierals 
          datasetId: datasetID,
        }).then(function (response) {
          for (let index = 0; index < response.result.point.length; index++) {
            distanceCount += response.result.point[index].value[0].fpVal;
          }
          var distanceRound = Math.round(distanceCount * 100) / 100;

          self._loginservice.distanceThirdOfLastOfThree = Math.floor(distanceRound);
          console.log("distance third of last three days gesamt was: " + Math.floor(distanceRound));

          resolve();
          self.ngZone.run(() => self.router.navigate(['/dashboard'])).then();
        }, function (reason) {
          console.log('Error: ' + reason.result.error.message + " -----");
          reject();
        });
      });
    });
    return promise;
  }


  ngAfterViewInit() {
    this.googleInit();
    this.handleClientLoad();
    this.setLastThreeDays();
  }

  routeToDashboard(): void {
    this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
  }

  logOut(): void {
    this._loginservice.loggedIn = false;
    this.ngOnInit();
  }

  private setLastThreeDays() {
    var result = [] as string[];
    var month = new Array();
    month[0] = "Januar";
    month[1] = "Februar";
    month[2] = "März";
    month[3] = "April";
    month[4] = "Ma";
    month[5] = "Juni";
    month[6] = "Juli";
    month[7] = "August";
    month[8] = "September";
    month[9] = "Oktober";
    month[10] = "November";
    month[11] = "Dezember";
    for (var i = 0; i < 4; i++) {
      var d = new Date();
      if (i === 0) {
        result[i] = "Heute";
      }
      else {
        d.setDate(d.getDate() - i);
        result[i] = d.getDate().toString() + "." + month[d.getMonth()];
      }
    }
    this._loginservice.lasteThreeDays = result.reverse();
    console.log("Last 3 Days: " + result);
  }

  private setStartAndEndTimeInNanoSeconds(): any {
    var tmpEndTime = new Date();
    var tmpEndTimeMin = tmpEndTime.getMinutes();
    var tmpEndTimeHour = tmpEndTime.getHours();

    var subtractOneMin;
    var subtractOneHour;

    //in order to avoid http response error
    if (tmpEndTimeMin >= 1) {
      subtractOneMin = tmpEndTimeMin - 1;
      tmpEndTime.setMinutes(subtractOneMin)
    }
    else {
      subtractOneHour = tmpEndTimeHour - 1;
      tmpEndTime.setHours(subtractOneHour);
      tmpEndTime.setMinutes(59);
    }

    var endTimeNanoSec = tmpEndTime.getTime() + "000000";
    var startTimeNanoSec = new Date();
    startTimeNanoSec.setHours(0);
    startTimeNanoSec.setMinutes(0);
    startTimeNanoSec.setSeconds(0);
    var res = startTimeNanoSec.getTime() + "000000" + "-" + endTimeNanoSec;
    return res;
  }

  private setStartAndEndTimeInNanoSecondsForLastThreeDays(start: number, end: number): any {
    var tmpStartTime = new Date();
    var tmpEndTime = new Date();

    var result = "";

    for (var i = 0; i < 4; i++) {
      if (i === end) {
        tmpEndTime.setDate(tmpEndTime.getDate() - i)
        tmpEndTime.setHours(0);
        tmpEndTime.setMinutes(0);
        tmpEndTime.setSeconds(0);
      }
      else if (i === start) {
        tmpStartTime.setDate(tmpStartTime.getDate() - i)
        tmpStartTime.setHours(0);
        tmpStartTime.setMinutes(0);
        tmpStartTime.setSeconds(0);
      }
    }
    result = tmpEndTime.getTime() + "000000" + "-" + tmpStartTime.getTime() + "000000";
    return result;
  }

}
