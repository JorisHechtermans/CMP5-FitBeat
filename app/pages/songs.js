import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from 'clock';
import { preferences } from 'user-settings';
import { HeartRateSensor } from "heart-rate";
import zeroPad from '../utils/zero-pad';
import { sendCommandRecommandations } from '../commands/index.js';

export function destroy() {
  console.log("destroy songs page");
}

export function init() {
  console.log("init songs page");

  //elementen time en lijst
  const $time = document.getElementById('time');
  let time = '';
  let list = document.getElementById("myList");
  let items = list.getElementsByClassName("list-item");

  //elk item in de songlijst klikbaar maken + linken aan songs_info
  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function() {
      console.log(`touched: Song ${index}`);
      switchPage("song_info", true);
    };
  });

  //heartrate meten en tonen
  let hrm = new HeartRateSensor();

  hrm.onreading = function() {
    let hrIcon = document.getElementById("hr-icon");
    hrIcon.text = `${hrm.heartRate}`;

    console.log('Uw BPM is ' + `${hrm.heartRate}` );

    // command uitsturen op basis van heartrate
    sendCommandRecommandations(`${hrm.heartRate}`);

  }
  hrm.start();

  // tijd tekenen
  function drawTime() {
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
    drawTime();
  }
  clock.ontick = (evt) => updateTime(evt.date);
  updateTime(new Date());

}
