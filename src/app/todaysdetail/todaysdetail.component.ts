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

  
  @ViewChild('username') usernameEl: ElementRef;
  @ViewChild('email') emailEl: ElementRef;
  @ViewChild('imgUrl') profileImgUrlEl: ElementRef;

  constructor(private ngZone: NgZone, private router: Router, private _loginservice: LoginserviceService, private renderer: Renderer2,) { }

  navToDashboard(){
    this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
  }

  navToFaq(){
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
          //line chart
          new Chart('barChart', {
            type: 'bar',
            data: {
              labels: [123, 422, 463],
              datasets: [
                {
                  label: "Schritte",
                  borderColor: 'rgb(255, 99, 132)',
                  data: [234,534,123,575]
                }
              ]
            }
          });
  }

}
