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
