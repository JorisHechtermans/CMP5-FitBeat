import document from "document";
import { switchPage } from "../navigation";

let buttonMusic = null;

export function destroy() {
  console.log("destroy index page");
  buttonMusic = null;
}

export function init() {
  console.log("init heartbeat page");
  buttonMusic = document.getElementById('songs-button');

  buttonContinue.onclick = () => {
    switchPage('songs');
  };
}
