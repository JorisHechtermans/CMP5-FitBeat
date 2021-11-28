import document from "document";
import { switchPage } from "../navigation/index.js";

let button = null;

export function destroy() {
  console.log("destroy index page");
  button = null;
}

export function init() {
  console.log("init index page");
  button = document.getElementById("start-button");

  button.onclick = () => {
    switchPage("spotify_check");
  };
}
