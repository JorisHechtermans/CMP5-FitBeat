import * as document from "document";
import { switchPage } from "../navigation";
import { getListData } from '../commands/index.js';
import { getStateItem, setStateCallback, removeStateCallback, setStateItem } from '../state';

let myList = null;

function draw() {
  const list = getStateItem('listData');
  console.log(JSON.stringify(list));

  myList = document.getElementById("myList");
  myList.delegate = {
    getTileInfo: (index) => {
      return {
        type: "my-pool",
        value: list[index],
        index: index
      };
    },
    configureTile: (tile, info) => {
      console.log(`Item: ${info.index}`)
      if (info.type == "my-pool") {
        tile.getElementById("text").text = `${info.value.name}`;

        let touch = tile.getElementById("touch");
        touch.onclick = function() {
          setStateItem('genreId', info.value.id);
          switchPage("songs");
        };
      }
    }
  };

  // length must be set AFTER delegate
  myList.length = list.length;
  }

export function init() {
  console.log("init genre selection page");
  myList = document.getElementById("myList");

  setStateCallback('genre_selection', draw);
  getListData();

}

export function destroy() {
  myList = null;
  console.log("destroy genre selection page");
  removeStateCallback('genre_selection', draw);
}
