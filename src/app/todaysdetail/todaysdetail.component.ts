import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { LoginserviceService } from '../services/loginservice.service'
import { Chart } from 'chart.js';

@Component({
  selector: 'app-todaysdetail',
  templateUrl: './todaysdetail.component.html',
  styleUrls: ['./todaysdetail.component.css']
})
export class TodaysdetailComponent implements OnInit {
  LineChart = [];
  stepsCount;

  @ViewChild('username') usernameEl: ElementRef;
  @ViewChild('email') emailEl: ElementRef;
  @ViewChild('imgUrl') profileImgUrlEl: ElementRef;

  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService, private renderer: Renderer2, ) { }

  navToDashboard() {
    this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
  }

  navToFaq() {
    this.ngZone.run(() => this.router.navigate(['/faq'])).then();
  }

  logOut(): void {
    this._loginservice.loggedIn = false;
    this.ngZone.run(() => this.router.navigate(['/'])).then();
  }

  getCurrentData(): void {
    this.renderer.setProperty(this.usernameEl.nativeElement, 'innerHTML', '<span> Nutzername: ' + this._loginservice.userName + '</span>');
    this.renderer.setProperty(this.emailEl.nativeElement, 'innerHTML', '<span> E-Mail: ' + this._loginservice.userEmail + '</span>');
    this.renderer.setProperty(this.profileImgUrlEl.nativeElement, 'innerHTML', '<img class="card-img-top" src="' + this._loginservice.userProfileImgUrl + '" alt="Profilbild">');
  }

  ngOnInit() {
    this.stepsCount = this._loginservice.steps;

    //bar chart
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ["0 Uhr", "1 Uhr", "2 Uhr", "3 Uhr", "4 Uhr", "5 Uhr", "6 Uhr", "7 Uhr", "8 Uhr", "9 Uhr", "10 Uhr", "11 Uhr", "12 Uhr", "13 Uhr", "14 Uhr", "15 Uhr"
          , "16 Uhr", "17 Uhr", "18 Uhr", "19 Uhr", "20 Uhr", "21 Uhr", "22 Uhr", "23 Uhr"],
        datasets: [
          {
            label: "Schritte innerhalb einer Stunde",
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [this._loginservice.stepsOfToday[0], this._loginservice.stepsOfToday[1], this._loginservice.stepsOfToday[2], this._loginservice.stepsOfToday[3], this._loginservice.stepsOfToday[4]
              , this._loginservice.stepsOfToday[5], this._loginservice.stepsOfToday[6], this._loginservice.stepsOfToday[7], this._loginservice.stepsOfToday[8], this._loginservice.stepsOfToday[9]
              , this._loginservice.stepsOfToday[10], this._loginservice.stepsOfToday[11], this._loginservice.stepsOfToday[12], this._loginservice.stepsOfToday[13], this._loginservice.stepsOfToday[14]
              , this._loginservice.stepsOfToday[15], this._loginservice.stepsOfToday[16], this._loginservice.stepsOfToday[17], this._loginservice.stepsOfToday[18], this._loginservice.stepsOfToday[19]
              , this._loginservice.stepsOfToday[20], this._loginservice.stepsOfToday[21], this._loginservice.stepsOfToday[22], this._loginservice.stepsOfToday[23]]
          }
        ]
      }
    });
  }

}
