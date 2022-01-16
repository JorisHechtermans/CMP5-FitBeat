import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import zeroPad from "../utils/zero-pad";
import { getStateItem } from '../state';


let albums = '';
let gekozenAlbum = '';
let songs = '';
let gekozenSong = '';
let artists = '';
let gekozenArtist = '';
let songId = '';


export function init() {
  console.log("init songs page");
  //hr tonen
  let heartRate = getStateItem('heartrate');
  console.log("opgehaalde hr: " + heartRate);
  let hrIcon = document.getElementById("hr-icon");
  hrIcon.text = heartRate;

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
}
