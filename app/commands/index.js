import * as messaging from "messaging";

export function sendCommandRecommandations(hr) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: "recommandations",
      hr,
    });
  }
}

// set up
export function init() {
  messaging.peerSocket.addEventListener("open", () => {
    // sendCommandRecommandations();
  });
}
