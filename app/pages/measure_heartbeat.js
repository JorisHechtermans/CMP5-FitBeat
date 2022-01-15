import document from "document";
import { switchPage } from "../navigation";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import { preferences } from "user-settings";
import zeroPad from "../utils/zero-pad";

let buttonGenreSelection = null;

export function destroy() {
  console.log("destroy heartbeat page");
  buttonGenreSelection = null;
}

export function init() {
  console.log("init heartbeat page");
  buttonGenreSelection = document.getElementById("genre-button");

  const $time = document.getElementById("time");
  let time = "";

  buttonGenreSelection.onclick = () => {
    switchPage("genre_selection");
  };

  //heartrate meten
  let hrm = new HeartRateSensor();

  hrm.onreading = function readHeartbeat() {
    console.log("Current heart rate: " + `${hrm.heartRate}`);

    let heartRateHandle = document.getElementById("heartRateLabel");
    heartRateHandle.text = `${hrm.heartRate}`;

    let hrIcon = document.getElementById("hr-icon");
    hrIcon.text = `${hrm.heartRate}`;
  };
  hrm.start();

  // tijd tekenen
  function draw() {
    $time.text = time;
  }

  // tijd
  clock.granularity = "minutes";

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
    draw();
  }
  // use function above on clock tick
  //clock.ontick = (evt) => updateTime(evt.date);
  // use the function on start as well
  updateTime(new Date());
}
