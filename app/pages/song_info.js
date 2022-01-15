import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from "clock";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import zeroPad from "../utils/zero-pad";
import { getStateItem, removeStateCallback, setStateCallback } from '../state';

let buttonBackToIndex = null;
let hrIcon = "--";
const $time = document.getElementById("time");
let time = "";

export function destroy() {
  console.log("destroy songs page");
  buttonBackToIndex = null;
  removeStateCallback('song_info', draw);
}

function drawTime() {
  $time.text = time;
}

function draw() {
  //heartrate meten
  let hrm = new HeartRateSensor();

  hrm.onreading = function () {
    console.log("Current heart rate: " + `${hrm.heartRate}`);
    hrIcon.text = `${hrm.heartRate}`;
  };
  hrm.start();

  // tijd tekenen


  // tijd
  clock.granularity = "minutes";

}

export function init() {
  console.log("init songs page");
  buttonBackToIndex = document.getElementById("backtoindex-button");
  hrIcon = document.getElementById("hr-icon");

  buttonBackToIndex.onclick = () => {
    switchPage("songs");
  };

  function updateTime(datetime) {
    const minute = datetime.getMinutes();
    const hour = datetime.getHours();
    let hours = hour;
    if (preferences.clockDisplay === "12h") {
      // 12h format
      hours = zeroPad(hours % 12 || 12);
    } else {
      // 24h format
      hours = zeroPad(hours);
    }
    const mins = zeroPad(minute);
    time = `${hours}:${mins}`;

  }
  
  drawTime();
  updateTime(new Date());
  setStateCallback('song_info', draw);
}
