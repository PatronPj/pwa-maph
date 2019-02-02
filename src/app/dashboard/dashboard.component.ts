import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { LoginserviceService } from '../services/loginservice.service'
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService,
    private renderer: Renderer2, private http: HttpClient, private cookie: CookieService) { }

  @ViewChild('username') usernameEl: ElementRef;
  @ViewChild('email') emailEl: ElementRef;
  @ViewChild('imgUrl') profileImgUrlEl: ElementRef;

  @ViewChild('modal') modal: ElementRef;
  @ViewChild('modal2') modal2: ElementRef;
  @ViewChild('modal3') modal3: ElementRef;

  @ViewChild('modal4') modal4: ElementRef;
  @ViewChild('modal5') modal5: ElementRef;

  showModal() {
    // Show modal with jquery
    $(this.modal.nativeElement).modal('show');
    this.modal.nativeElement.click();
  }

  //helpers
  showBreathing: boolean = false;
  _breathingHelp: string = "einatmen..."
  finishedBreathing: boolean = false;
  showBtns: boolean = true;

  _username: string;

  _counter = 60;
  _counter2 = 11;

  _currentDate: string;
  _remainingTime: string;
  _medal: string;

  _achieveFirstMedal: boolean;
  _achieveSecondMedal: boolean;
  _achieveThirdMedal: boolean;

  _achieveFirstMedalModal: boolean;

  _aiFirstMotivation: boolean;
  _aiSecondMotivation: boolean;

  isFirstMedal: string;

  stepsCount: any;
  distanceCount: any;
  caloriesCount: any;

  contentEditable: boolean = false;
  averageStepsGoal = 10000;
  percentage;
  remainigHours: number;
  showCheckBox: boolean;

  yesterdaySteps: any = 6780;

  LineChart = [];

  getCurrentData(): void {
    this.renderer.setProperty(this.usernameEl.nativeElement, 'innerHTML', '<span> Nutzername: ' + this._loginservice.userName + '</span>');
    this.renderer.setProperty(this.emailEl.nativeElement, 'innerHTML', '<span> E-Mail: ' + this._loginservice.userEmail + '</span>');
    this.renderer.setProperty(this.profileImgUrlEl.nativeElement, 'innerHTML', '<img class="card-img-top" src="' + this._loginservice.userProfileImgUrl + '" alt="Profilbild">');
  }

  ngOnInit() {
    let self = this;

    this.showCheckBox = this._loginservice.isChecked;

    this.isFirstMedal = this.cookie.get("firstMedal");
    console.log("Heute ist der: " + new Date().toLocaleDateString() + " Cookie sagt: " + this.isFirstMedal);

    this._username = this._loginservice.userName;

    setTimeout(function () {
      self.stepsCount = self._loginservice.steps;
      self.distanceCount = self._loginservice.distance;
      self.caloriesCount = self._loginservice.calories;

      self.yesterdaySteps = self._loginservice.thirdOfLastOfThree;

      self.achievements();

      //line chart
      self.LineChart = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: [self._loginservice.lasteThreeDays[0], self._loginservice.lasteThreeDays[1], self._loginservice.lasteThreeDays[2], self._loginservice.lasteThreeDays[3]],
          datasets: [
            {
              label: "Schritte",
              borderColor: 'rgb(255, 99, 132)',
              data: [self._loginservice.firstOfLastOfThree, self._loginservice.secondOfLastOfThree, self._loginservice.thirdOfLastOfThree, self.stepsCount]
            },
            {
              label: "Distanz (alle Aktivitäten) in Meter",
              borderColor: 'rgb(54, 162, 235)',
              data: [self._loginservice.distanceFirstOfLastOfThree, self._loginservice.distanceSecondOfLastOfThree, self._loginservice.distanceThirdOfLastOfThree, self.distanceCount]
            },
            {
              label: "Kalorien (alle Aktivitäten) in kcal",
              borderColor: 'rgb(75, 192, 192)',
              data: [self._loginservice.caloriesFirstOfLastOfThree, self._loginservice.caloriesSecondOfLastOfThree, self._loginservice.caloriesThirdOfLastOfThree, self.caloriesCount]
            }
          ]
        }
      });

      //artificial intelligence for motivation
      if (self.stepsCount >= 3000 && self.stepsCount <= 5000) {
        self._aiFirstMotivation = true;
        if (!self.cookie.get("aiFirstMotivation").match("true")) {
          self.cookie.set("aiFirstMotivation", "true");
          setTimeout(function () {
            $(self.modal4.nativeElement).modal('show');
          }, 20000);
        }
        console.log("aiFirstMotivation achieved: true");
      }
      if (self.stepsCount >= 8000 && self.stepsCount <= 10000) {
        self._aiSecondMotivation = true;
        if (!self.cookie.get("aiSecondMotivation").match("true")) {
          self.cookie.set("aiSecondMotivation", "true");
          setTimeout(function () {
            $(self.modal5.nativeElement).modal('show');
          }, 20000);
        }
        console.log("aiSecondMotivation achieved: true");
      }
      self.showCheckBox = true;
    }, 2000);

    this._currentDate = new Date().toLocaleDateString();
    var hours = 23 - new Date().getHours();
    this.remainigHours = hours;
    var minutes = (new Date().getMinutes() - 60) * -1;
    this._remainingTime = hours.toString() + " Stunden und " + minutes.toString() + " Minuten";

    this._medal = this._loginservice.getFirstMedal();

    if (this.isFirstMedal === new Date().toLocaleDateString()) {
      this._achieveFirstMedal = true;
      console.log("FirstMedal achieved: true");
      if (!this.cookie.get("firstMedalModal").match("true")) {
        this.cookie.set("firstMedalModal", "true");
        $(this.modal.nativeElement).modal('show');
        //reset booleans of AI everyday
        self.cookie.set("aiFirstMotivation", "false");
        self.cookie.set("aiSecondMotivation", "false");
      }
    }
    else {
      this.cookie.set("firstMedalModal", "false");
      this._loginservice.setFirstMedal(this._currentDate);
      this._loginservice.firstMedal = this._currentDate;
      this._medal = this._loginservice.getFirstMedal();
      this._achieveFirstMedal = false;
    }
  }

  hideBreathing(): void {
    if (this.showBreathing) {
      this.showBreathing = false;
      this.finishedBreathing = false;
    }
    else {
      this.showBreathing = true;
      this.showBtns = false;
      let intervalId = setInterval(() => {
        this._counter = this._counter - 1;
        this._counter2 = this._counter2 - 1;

        if (this._counter2 === 6) {
          console.log(this._counter2)
          this._breathingHelp = "und ausatmen...";
        }
        if (this._counter2 === 2) {
          console.log(this._counter2)
          this._counter2 = 12;
          this._breathingHelp = "langsam einatmen...";
        }
        if (this._counter === 0) {
          this.showBreathing = false;
          this.finishedBreathing = true;
          clearInterval(intervalId)
          this._counter = 60;
          this._counter2 = 11;
          this.showBtns = true;
        }
      }, 1000)
    }
  }

  achievements() {
    let self = this;
    //achievements
    if (self.stepsCount >= (self.averageStepsGoal / 2)) {
      self._achieveSecondMedal = true;

      if (!self.cookie.get("secondMedalModal").match("true")) {
        self.cookie.set("secondMedalModal", "true");
        setTimeout(function () {
          $(self.modal2.nativeElement).modal('show');
        }, 5000);

      }
      console.log("SecondMedal achieved: true");
    }
    else {
      self._achieveSecondMedal = false;
      self.cookie.set("secondMedalModal", "false");
    }

    if (self.stepsCount >= self.averageStepsGoal) {
      self._achieveThirdMedal = true;

      if (!self.cookie.get("thirdMedalModal").match("true")) {
        self.cookie.set("thirdMedalModal", "true");
        setTimeout(function () {
          $(self.modal3.nativeElement).modal('show');
        }, 5000);
      }
      console.log("ThirdMedal achieved: true");
    }
    else {
      self._achieveThirdMedal = false;
      self.cookie.set("thirdMedalModal", "false");
    }
  }

  //ai for personalisation
  toggleEditable(event) {
    if (event.target.checked) {
      this._loginservice.isChecked = true;
      var offset = 0;
      this.contentEditable = true;
      //compute average add offset
      if (this.remainigHours > 15) {
        offset = 7000;
      }
      if (this.remainigHours < 15 && this.remainigHours > 10) {
        console.log("zwischen 15std und 10std");
        offset = 5000;
      }
      if (this.remainigHours < 10 && this.remainigHours > 5) {
        console.log("zwischen 10std und 5std");
        offset = 3500;
      }
      if (this.remainigHours < 5) {
        console.log("unter 5std");
        offset = 1500;
      }
      $('[data-toggle="tooltip"]').tooltip();
      this.averageStepsGoal = Math.floor((this._loginservice.firstOfLastOfThree + this._loginservice.secondOfLastOfThree + this._loginservice.thirdOfLastOfThree) / 3);
      this.averageStepsGoal += offset;
      this.percentage = ((this.stepsCount / this.averageStepsGoal) * 100).toFixed(2);
      this.achievements();
    }
    else {
      this.averageStepsGoal = 10000;
      this._loginservice.isChecked = false;
      this.contentEditable = false;
      this.achievements();
    }
  }
  navToFaq() {
    this.ngZone.run(() => this.router.navigate(['/faq'])).then();
  }

  navToTodaysdetail() {
    this.ngZone.run(() => this.router.navigate(['/today'])).then();
  }

  logOut(): void {
    this._loginservice.loggedIn = false;
    this.ngZone.run(() => this.router.navigate(['/'])).then();
  }
}
export class AppComponent {
  isCollapsed = false;
}