import document from "document";
import { switchPage } from "../navigation/index.js";
import { HeartRateSensor } from "heart-rate";
import { sendCommandRecommandations, getListItem } from "../commands";
import { getStateItem, removeStateCallback, setStateCallback } from '../state';
import zeroPad from "../utils/zero-pad";
import { preferences } from "user-settings";
import clock from "clock";

let items = null;
let list = null;
let songs = null;
let artists = null;
let itemsSong = null;
let itemsArtiest = null;
let genre = null;
let hrm = new HeartRateSensor();

function draw() {
  //heartrate meten en tonen
  hrm.onreading = function () {
    let hrIcon = document.getElementById("hr-icon");
    hrIcon.text = `${hrm.heartRate}`;

    console.log("Uw BPM is " + `${hrm.heartRate}`);

    //opvragen welk genre gekozen is
    const item = getStateItem('listItem');
    console.log("aangeklikte data: " + JSON.stringify(item));
    // wachten tot item geladen is met "if"
    if (item) {
      genre = item.value;
      console.log("het genre is " + genre);
      // command uitsturen op basis van genre en heartrate
      sendCommandRecommandations(genre, hrm.heartRate);
    }
  };
  hrm.start();

  list = document.getElementById("mySongList");
  songs = getStateItem('songlist');
  artists = getStateItem('artistlist');
  items = list.getElementsByClassName("song-list-item");
  itemsSong = list.getElementsByClassName("texttitel");
  itemsArtiest = list.getElementsByClassName("textartiest");

  let i = 0;
  let ii = 0;

  itemsSong.forEach((itemSong) => {
    itemSong.text = songs[i];
    i++;
  });

  itemsArtiest.forEach((itemArtiest) => {
    itemArtiest.text = artists[ii];
    ii++;
  });

  //elk item in de songlijst klikbaar maken + linken aan songs_info
  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function () {
      console.log(`touched: Song ${index}`);
      switchPage("song_info", true);
    };
  });
}

export function init() {
  console.log("init songs page");

  getListItem(getStateItem('genreId'));
  setStateCallback('songs', draw);

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
  console.log("destroy songs page");
  items = null;
  list = null;
  songs = null;
  artists = null;
  itemsSong.text = null;
  itemsArtiest.text = null;
  genre = null;

  removeStateCallback('songs', draw);
}
