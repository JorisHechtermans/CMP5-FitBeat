import { inbox } from 'file-transfer';
import * as filesystem from 'fs';
import * as messaging from 'messaging';

const state = {
  songlist: [],
  artistlist: [],
  listData: [],
  listItem: null,
  // add other state-items here
};

// set callbacks so you can interact with this in your views
// could be optimised though, as it calls for every updated value, so not specific
const callbacks = {};

export function setStateCallback(key, cb) {
  callbacks[key] = cb;
}

export function removeStateCallback(key) {
  callbacks[key] = null;
}

// save state to local storage on watch so it's always avaialble at start of app
function updateState() {
  filesystem.writeFileSync('state.txt', state, 'json');
}

// load state on start of app
function loadState() {
  try {
    const loadedState = filesystem.readFileSync('state.txt', 'json');
    Object.keys(state).forEach((key) => {
      if (typeof loadedState[key] !== 'undefined')
        state[key] = loadedState[key];
    });
  } catch (err) {
    console.error(`Failed loading state: ${err}`);
  }
}

// get and set items from within app
export function getStateItem(key) {
  return state[key];
}

export function setStateItem(key, value) {
  state[key] = value;
  updateState();
}

// callback
function callback() {
  Object.keys(callbacks).forEach((key) => {
    if (callbacks[key]) callbacks[key]();
  });
}

// process file transfer files
function processFiles() {
  let fileName;
  while ((fileName = inbox.nextFile())) {
    if (fileName === 'settings.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });

      console.log(JSON.stringify(state));

      updateState();
      callback();
    } else if (fileName === 'songlist.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });

      updateState();
      callback();
    } else if (fileName === 'artistlist.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });


      updateState();
      callback();
    } else if (fileName === 'listData.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });

      updateState();
      callback();
    } else if (fileName === 'listItem.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });

      updateState();
      callback();
      }
  }
}

// process messages
function processMessaging(evt) {
  Object.keys(state).forEach((key) => {
    if (typeof evt.data[key] !== 'undefined') state[key] = evt.data[key];
  });

  updateState();
  callback();
}

// set up
export function init() {
  loadState();
  processFiles();
  inbox.addEventListener('newfile', processFiles);
  messaging.peerSocket.addEventListener('message', processMessaging);
}
