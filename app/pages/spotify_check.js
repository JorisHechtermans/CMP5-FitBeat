import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from "clock";
import { preferences } from "user-settings";
import zeroPad from "../utils/zero-pad";
// import { sendCommandRecommandations } from "../commands/index.js";

let button = null;

export function destroy() {
  console.log("destroy spotify page");
  button = null;
}

export function init() {
  console.log("init spotify page");
  const $time = document.getElementById("time");
  let time = "";

  button = document.getElementById("continue");
  button.onclick = () => {
    switchPage("measure_heartbeat");
  };

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
  clock.ontick = (evt) => updateTime(evt.date);
  // use the function on start as well
  updateTime(new Date());
}
