import document from "document";
import { switchPage } from "../navigation";

let buttonGetMusic = null;

export function destroy() {
  console.log("destroy genre selection page");
  buttonGetMusic = null;
}

export function init() {
  console.log("init genre selection page");
  buttonGetMusic = document.getElementById('getmusic-button');

  buttonGetMusic.onclick = () => {
    switchPage('songs');
  };
}
