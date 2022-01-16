import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import zeroPad from "../utils/zero-pad";
import { getStateItem, removeStateCallback, setStateCallback } from '../state';

let hrIcon = "--";
let albums = '';
let gekozenAlbum = '';
let songs = '';
let gekozenSong = '';
let artists = '';
let gekozenArtist = '';
let songId = '';


function draw() {
  //heartrate meten
  let hrm = new HeartRateSensor();

  hrm.onreading = function () {
    console.log("Current heart rate: " + `${hrm.heartRate}`);
    hrIcon.text = `${hrm.heartRate}`;
  };
  hrm.start();
}

export function init() {
  console.log("init songs page");

  //Id gekozen nummer ophalen
  songId = getStateItem('songId');
  console.log( "song dat werd aangeklikt: " + songId);

  //Juiste song ophalen
  songs = getStateItem('songlist');
  gekozenSong = songs[songId];
  console.log("het gekozen nummer is: " + gekozenSong);
  let songTonen = document.getElementById("song");
  songTonen.text = gekozenSong;

  //Juiste artiest ophalen
  artists = getStateItem('artistlist');
  gekozenArtist = artists[songId];
  console.log("de gekozen artiest is: " + gekozenArtist);
  let artistTonen = document.getElementById("artist");
  artistTonen.text = gekozenArtist;

  //Juiste album ophalen
  albums = getStateItem('albumlist');
  gekozenAlbum = albums[songId];
  console.log("het gekozen album is: " + gekozenAlbum);
  let albumTonen = document.getElementById("album");
  albumTonen.text = gekozenAlbum;

  hrIcon = document.getElementById("hr-icon");



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
  setStateCallback('song_info', draw);
}

export function destroy() {
  console.log("destroy songs page");
  buttonBackToIndex = null;
  removeStateCallback('song_info', draw);
}
