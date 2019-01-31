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

  showModal() {
    // Show modal with jquery
    $(this.modal.nativeElement).modal('show');
    this.modal.nativeElement.click();
  }
  showBreathing: boolean = false;
  _breathingHelp: string = "einatmen..."
  finishedBreathing: boolean = false;
  showBtns: boolean = true;

  _counter = 60;
  _counter2 = 11;

  _username: string;
  _mail: string;
  _imgUrl: string;
  _currentDate: string;
  _remainingTime: string;
  _medal: string;

  _achieveFirstMedal: boolean;
  _achieveSecondMedal: boolean;
  _achieveThirdMedal: boolean;

  _achieveFirstMedalModal: boolean;

  isFirstMedal: string;

  stepsCount: any;
  distanceCount: any;
  caloriesCount: any;

  LineChart = [];

  ngOnInit() {
    let self = this;

    this.isFirstMedal = this.cookie.get("firstMedal");
    console.log("Heute ist der: " + new Date().toLocaleDateString() + " Cookie sagt: " + this.isFirstMedal);

    setTimeout(function () {
      self.stepsCount = self._loginservice.steps;
      self.distanceCount = self._loginservice.distance;
      self.caloriesCount = self._loginservice.calories;

      if (self.stepsCount >= 5000) {
        self._achieveSecondMedal = true;

        if (!self.cookie.get("secondMedalModal").match("true")) {
          console.log("AMKKKKKKK");
          self.cookie.set("secondMedalModal", "true");
          $(self.modal2.nativeElement).modal('show');
        }
        console.log("SecondMedal achieved: true");
      }
      else {
        self._achieveSecondMedal = false;
        self.cookie.set("secondMedalModal", "false");
        console.log("false");
      }

      if (self.stepsCount >= 10000) {
        self._achieveThirdMedal = true;

        if (!self.cookie.get("thirdMedalModal").match("true")) {
          self.cookie.set("thirdMedalModal", "true");
          $(self.modal3.nativeElement).modal('show');
        }
        console.log("ThirdMedal achieved: true");
      }
      else {
        self._achieveThirdMedal = false;
        self.cookie.set("thirdMedalModal", "false");
        console.log("false");
      }

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
    }, 5000);


    this._currentDate = new Date().toLocaleDateString();
    this._username = this._loginservice.userName;
    var hours = 23 - new Date().getHours();
    var minutes = (new Date().getMinutes() - 60) * -1;
    this._remainingTime = hours.toString() + " Stunden und " + minutes.toString() + " Minuten";

    this._medal = this._loginservice.getFirstMedal();

    

    if (this.isFirstMedal === new Date().toLocaleDateString()) {
      this._achieveFirstMedal = true;
      console.log("FirstMedal achieved: true");
      if (!this.cookie.get("firstMedalModal").match("true")) {
        this.cookie.set("firstMedalModal", "true");
        $(this.modal.nativeElement).modal('show');
      }
    }
    else {
      this.cookie.set("firstMedalModal", "false");
      console.log("false");
      this._loginservice.setFirstMedal(this._currentDate);
      this._loginservice.firstMedal = this._currentDate;
      this._medal = this._loginservice.getFirstMedal();
      console.log("medal jetzt " + this._medal);
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

  get username(): string {
    return this._loginservice.userName;
  }
  get useremail(): string {
    return this._loginservice.userEmail;
  }
  get userprofileimgurl(): string {
    return this._loginservice.userProfileImgUrl;
  }

  getCurrentData(): void {
    this.renderer.setProperty(this.usernameEl.nativeElement, 'innerHTML', '<span> Nutzername: ' + this._loginservice.userName + '</span>');
    this.renderer.setProperty(this.emailEl.nativeElement, 'innerHTML', '<span> E-Mail: ' + this._loginservice.userEmail + '</span>');
    this.renderer.setProperty(this.profileImgUrlEl.nativeElement, 'innerHTML', '<img class="card-img-top" src="' + this._loginservice.userProfileImgUrl + '" alt="Profilbild">');
  }

  logOut(): void {
    this._loginservice.loggedIn = false;
    this.ngZone.run(() => this.router.navigate(['/'])).then();
  }
}
export class AppComponent {
  isCollapsed = false;
}