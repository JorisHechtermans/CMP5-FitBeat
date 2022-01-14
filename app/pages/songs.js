import document from "document";
import { switchPage } from "../navigation/index.js";
import clock from "clock";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import zeroPad from "../utils/zero-pad";
import { sendCommandRecommandations, getListItem } from "../commands/index.js";
import { getStateItem, removeStateCallback } from '../state';

let items = [];
let itemsSong = [];
let itemsArtiest = [];


//nummers en artiesten tekenen
function draw() {

  let i = 0;
  let ii = 0;
  let list = document.getElementById("mySongList");
  const songs = getStateItem('songlist');
  const artists = getStateItem('artistlist');
  items = list.getElementsByClassName("song-list-item");
  itemsSong = list.getElementsByClassName("texttitel");
  itemsArtiest = list.getElementsByClassName("textartiest");

  itemsSong.forEach((itemSong) => {
    itemSong.text = songs[i];
    i++;
  });

  itemsArtiest.forEach((itemArtiest) => {
    itemArtiest.text = artists[ii];
    ii++;
  });
}

export function init() {
  console.log("init songs page");

  //elementen time en lijst
  const $time = document.getElementById("time");
  let time = "";
  let list = document.getElementById("mySongList");
  let items = list.getElementsByClassName("song-list-item");

  //elk item in de songlijst klikbaar maken + linken aan songs_info
  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function () {
      console.log(`touched: Song ${index}`);
      switchPage("song_info", true);
    };
  });

  //heartrate meten en tonen
  let hrm = new HeartRateSensor();

  hrm.onreading = function () {
    let hrIcon = document.getElementById("hr-icon");
    hrIcon.text = `${hrm.heartRate}`;

    console.log("Uw BPM is " + `${hrm.heartRate}`);

    //opvragen welk genre gekozen is
    getListItem(getStateItem('genreId'));
    const item = getStateItem('listItem');
    console.log(JSON.stringify(item));
    // wachten tot item geladen is met "if"
    if (item) {
      let genre = item.value;
      console.log("het genre is " + genre);
      // command uitsturen op basis van genre en heartrate
      sendCommandRecommandations(genre, hrm.heartRate);
      //resultaten tekenen
      draw();
    }

  };
  hrm.start();


  // tijd tekenen
  function drawTime() {
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
    drawTime();
  }
  clock.ontick = (evt) => updateTime(evt.date);
  updateTime(new Date());
}

export function destroy() {
  console.log("destroy songs page");
  genre = null;
  items.length = 0;
  itemsArtiest.length = 0;
  removeStateCallback('songs', draw);
}
