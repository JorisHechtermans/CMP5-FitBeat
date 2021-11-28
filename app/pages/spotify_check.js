import document from "document";
import { switchPage } from "../navigation/index.js";

let button = null;

export function destroy() {
  console.log("destroy spotify page");
  button = null;
}

export function init() {
  console.log("init spotify page");
  button = document.getElementById("continue");

  button.onclick = () => {
    switchPage("measure_heartbeat");
  };
}
