import * as document from "document";
import { switchPage } from "../navigation";
import { getListData } from '../commands/index.js';
import { getStateItem, setStateCallback, removeStateCallback, setStateItem } from '../state';
import zeroPad from "../utils/zero-pad";
import { preferences } from "user-settings";
import clock from "clock";

let myList = null;

function draw() {
  const list = getStateItem('listData');
  if (list) {
    let loader = document.getElementById("loader");
    loader.style.display = "none";
  }
  console.log(JSON.stringify(list));
  myList = document.getElementById("myList");

  myList.delegate = {
    getTileInfo: (index) => {
      return {
        type: "my-pool",
        value: list[index],
        index: index
      };
    },
    configureTile: (tile, info) => {
      if (info.type == "my-pool") {
        tile.getElementById("text").text = `${info.value.name}`;

        let touch = tile.getElementById("touch");
        touch.onclick = function() {
          setStateItem('genreId', info.value.id);
          switchPage("songs");
        };
      }
    }
  };

  // length must be set AFTER delegate
  myList.length = list.length;
  }

export function init() {
  console.log("init genre selection page");
  myList = document.getElementById("myList");

  //hr tonen
  let heartRate = getStateItem('heartrate');
  console.log("opgehaalde hr: " + heartRate);
  let hrIcon = document.getElementById("hr-icon");
  hrIcon.text = heartRate;

  getListData();
  setStateCallback('genre_selection', draw);

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
  clock.ontick = (evt) => updateTime(evt.date);
  updateTime(new Date());

}

export function destroy() {
  myList = null;
  console.log("destroy genre selection page");
  removeStateCallback('genre_selection', draw);
}
