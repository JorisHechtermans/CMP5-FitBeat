import document from "document";
import { switchPage } from "../navigation/index.js";

let buttonBackToIndex = null;

export function destroy() {
  console.log("destroy songs page");
  buttonBackToIndex = null;
}

export function init() {
  console.log("init songs page");
  buttonBackToIndex = document.getElementById("backtoindex-button");

  buttonBackToIndex.onclick = () => {
    switchPage("index");
  };
}
