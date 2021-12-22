import * as messaging from 'messaging';

export function sendCommandRecommandations() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: 'recommandations',
    });
  }
}

// set up
export function init() {
  messaging.peerSocket.addEventListener('open', () => {
    sendCommandRecommandations();
  });
}
