import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from 'clock';
import { preferences } from 'user-settings';
import { HeartRateSensor } from "heart-rate";
import zeroPad from '../utils/zero-pad';

let hrIcon = "--";

export function destroy() {
  console.log("destroy songs page");
}

export function init() {
  console.log("init songs page");
  hrIcon = document.getElementById("hr-icon");

  const $time = document.getElementById('time');
  let time = '';

  //elk item in de songlijst klikbaar maken + linken aan songs_info
  let list = document.getElementById("myList");
  let items = list.getElementsByClassName("list-item");

  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function() {
      console.log(`touched: Song ${index}`);
      switchPage("song_info");
    };
  });

  //heartrate meten
  let hrm = new HeartRateSensor();

  hrm.onreading = function() {
    console.log('Current heart rate: ' + `${hrm.heartRate}` )
    hrIcon.text = `${hrm.heartRate}`;
  }
  hrm.start();

  // tijd tekenen
  function draw() {
    $time.text = time;
  }

  // tijd
  clock.granularity = 'minutes';

  function updateTime(datetime) {
    const minute = datetime.getMinutes();
    const hour = datetime.getHours();
    let hours = hour;
    if (preferences.clockDisplay === '12h') {
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
  clock.ontick = (evt) => updateTime(evt.date);
  updateTime(new Date());
}
