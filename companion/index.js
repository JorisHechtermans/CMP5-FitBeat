import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { localStorage } from "local-storage";
import getRecommandations from "./api";
import { getListData } from "./api";
import { getListItem } from "./api";

// test spotify api:
// getRecommandations(150);

settingsStorage.addEventListener("change", (evt) => {
  if (evt.key === "oauth") {
    console.log(evt);
    localStorage.setItem("oauth", settingsStorage.getItem("oauth"));
  }
});

messaging.peerSocket.addEventListener("message", (evt) => {
  const msg = evt.data;

  // handle your own messages from watch to companion below this line!
  switch (msg.command) {
    case "recommandations":
      getRecommandations(msg.hr);
      break;
    case "getListData":
      getListData();
      break;
    case "getListItem":
      getListItem(msg.id);
      break;
    default:
      console.log(`Communication onMessage called: ${JSON.stringify(msg)}`);
      break;
  }
});

messaging.peerSocket.addEventListener("close", (evt) => {
  console.log(`Communication onClose called: ${JSON.stringify(evt)}`);
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.log(`Communication onError called: ${err.code} - ${err.message}`);
});
