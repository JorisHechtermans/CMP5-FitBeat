import document from "document";
import { switchPage } from "../navigation/index.js";

let buttonSongInfo = null;

export function destroy() {
  console.log("destroy songs page");
  buttonSongInfo = null;
}

export function init() {
  console.log("init songs page");
  buttonSongInfo = document.getElementById("infosong-button");

  buttonSongInfo.onclick = () => {
    switchPage("song_info");
  };
}
