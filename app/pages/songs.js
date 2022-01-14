import document from "document";
import { switchPage } from "../navigation/index.js";
import { HeartRateSensor } from "heart-rate";
import { sendCommandRecommandations, getListItem } from "../commands";
import { getStateItem, removeStateCallback, setStateCallback } from '../state';

let items = [];
let itemsSong = [];
let itemsArtiest = [];
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
    console.log(JSON.stringify(item));
    // wachten tot item geladen is met "if"
    if (item) {
      genre = item.value;
      console.log("het genre is " + genre);
      // command uitsturen op basis van genre en heartrate
      //resultaten tekenen
      sendCommandRecommandations(genre, hrm.heartRate);
    }
  };
  hrm.start();

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

  getListItem(getStateItem('genreId'));
  setStateCallback('songs', draw);
  //elk item in de songlijst klikbaar maken + linken aan songs_info
  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function () {
      console.log(`touched: Song ${index}`);
      switchPage("song_info", true);
    };
  });

}

export function destroy() {
  console.log("destroy songs page");
  genre = null;
  items.length = 0;
  itemsArtiest.length = 0;
  removeStateCallback('songs', draw);
}
