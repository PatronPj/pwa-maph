import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  userProfileImgUrl: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCuVMUVlRYbWFWXsq8h6xomJxMG5dq0BWEWmJaFNngsG_e4My";
  userName: string = "Username";
  userEmail: string = "User-Email";
  firstMedal: string = "kiro";
  loggedIn: boolean = false;
  steps: any = 651;
  distance: any = 0.4;
  calories: any = 187;
  lasteThreeDays: string[] = ["1.Februar", "2.Februar", "3.Februar", "Heute"];
  //steps
  firstOfLastOfThree: any = 6510;
  secondOfLastOfThree: any = 9810;
  thirdOfLastOfThree: any = 7810;
  //distances
  distanceFirstOfLastOfThree: any = 9510;
  distanceSecondOfLastOfThree: any = 5810;
  distanceThirdOfLastOfThree: any = 9810;
  //calories
  caloriesFirstOfLastOfThree: any = 794;
  caloriesSecondOfLastOfThree: any = 344;
  caloriesThirdOfLastOfThree: any = 874;

  //checkbox for personalisation
  isChecked: boolean = false;

  //for detailView
  timesOfToday = [] as any[];
  stepsOfToday = [45,0,0,0,0,0,0,0,123,234,0,0,0,0,0,0,0,0,0,0,0,0,0] as any[];

  constructor() { }

  getSteps(){
    return this.steps;
  }
  setSteps(value: any){
    this.steps = value;
  }

  setValue = function (val) { this.firstMedal = val }; //setter

  getFirstMedal(){
    return this.firstMedal;
  }

  setFirstMedal(value: string){
    this.firstMedal = value;
  }
}
