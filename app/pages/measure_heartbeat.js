import document from "document";
import { switchPage } from "../navigation";
import { HeartRateSensor } from "heart-rate";
import zeroPad from "../utils/zero-pad";
import { preferences } from "user-settings";
import clock from "clock";
import { setStateItem } from '../state';

let buttonGenreSelection = null;
let heartRateHandle = null;
let hrIcon = null;


export function init() {
  console.log("init heartbeat page");

  //heartrate
  let hrm = new HeartRateSensor();
  hrm.onreading = function readHeartbeat() {
    console.log("Current heart rate: " + `${hrm.heartRate}`);
    heartRateHandle = document.getElementById("heartRateLabel");
    hrIcon = document.getElementById("hr-icon");
    heartRateHandle.text = `${hrm.heartRate}`;
    hrIcon.text = `${hrm.heartRate}`;
    setStateItem('heartrate', hrm.heartRate);
  };
  hrm.start();

  //tijd
  const $time = document.getElementById("time");
  let time = "";

  clock.granularity = "minutes";

  function drawTime() {
    $time.text = time;
  }

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

    // tekenen aanroepen
    drawTime();
  }
  updateTime(new Date());
  updateTime(new Date());

  //button
  buttonGenreSelection = document.getElementById("genre-button");
  buttonGenreSelection.onclick = () => {
    switchPage("genre_selection");
  };
}


export function destroy() {
  console.log("destroy heartbeat page");
  buttonGenreSelection = null;
  heartRateHandle = null;
  hrIcon = null;
}
