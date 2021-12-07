import document from "document";
import { switchPage } from "../navigation";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";

let buttonGenreSelection = null;
let heartRateHandle = "--";

export function destroy() {
  console.log("destroy heartbeat page");
  buttonGenreSelection = null;
}

export function init() {
  console.log("init heartbeat page");
  buttonGenreSelection = document.getElementById('genre-button');
  heartRateHandle = document.getElementById("heartRateLabel");

  let hrm = new HeartRateSensor();

  hrm.onreading = function() {
    console.log('Current heart rate: ' + `${hrm.heartRate}` )
    heartRateHandle.text = `${hrm.heartRate}`;
  }
  hrm.start();

  buttonGenreSelection.onclick = () => {
    switchPage('genre_selection');
  };
}
