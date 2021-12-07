import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from 'clock';
import { preferences } from 'user-settings';
import zeroPad from '../utils/zero-pad';

let buttonBackToIndex = null;

export function destroy() {
  console.log("destroy songs page");
  buttonBackToIndex = null;
}

export function init() {
  console.log("init songs page");
  buttonBackToIndex = document.getElementById("backtoindex-button");

  const $time = document.getElementById('time');
  let time = '';

  buttonBackToIndex.onclick = () => {
    switchPage("index");
  };

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
  // use function above on clock tick
  clock.ontick = (evt) => updateTime(evt.date);
  // use the function on start as well
  updateTime(new Date());
}
