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
  steps: number = 651;

  constructor() { }

  getFirstMedal(){
    return this.firstMedal;
  }
  setValue = function (val) { this.firstMedal = val }; //setter

  setFirstMedal(value: string){
    this.firstMedal = value;
  }
}
