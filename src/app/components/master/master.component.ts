import { Component, OnInit } from "@angular/core";

@Component({
  selector: "master",
  templateUrl: "./master.component.html",
  styleUrls: ["./master.component.css"],
})
export class MasterComponent implements OnInit {
  userName: any = "User";
  userId: any;
  
  ngOnInit() {
    if (
      localStorage.getItem("currentUser") != null &&
      localStorage.getItem("currentUser") != undefined
    ) {
      let userData = JSON.parse(localStorage.getItem("currentUser") + "");
      this.userName = userData.firstName + " " + userData.lastName;
      this.userId = userData.encryptedUserId;
    }

  }
}
