import document from "document";
import { switchPage } from "../navigation";

let buttonGenreSelection = null;

export function destroy() {
  console.log("destroy heartbeat page");
  buttonGenreSelection = null;
}

export function init() {
  console.log("init heartbeat page");
  buttonGenreSelection = document.getElementById('genre-button');

  buttonGenreSelection.onclick = () => {
    switchPage('genre_selection');
  };
}
