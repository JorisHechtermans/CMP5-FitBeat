import { localStorage } from "local-storage";
import { outbox } from "file-transfer";
import * as cbor from 'cbor';
import { data } from './data.js';

function refreshToken(token) {
  console.log(token);
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic ZTIwYjI3MWZiZTQxNGY1OGJlMDJkZDc0YTk1NmU1NGM6MTYzYzY4OWNhMGQ0NDM3YTk2M2NkNTUwNTg5MTM4MTU=",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${token}`,
  });
}

function getRecommandationsFunction(token, genre, tempoInBMP) {
  return fetch(
    // genre of artist was required!
    `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&target_tempo=${tempoInBMP}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

function getRecommandationsSuccess(
  response,
  access_token,
  refresh_token,
  genre,
  tempoInBMP,
  retry
) {
  let songlist = [];
  let artistlist = [];
  let albumlist = [];
  let albums = '';
  let songs = '';
  let artists = '';
  let i = 0;

  if (response && response.json) {
    response.json().then((json) => {
      console.log(json);
      if (json && json.error && json.error.status === 401 && !retry) {
        refreshToken(refresh_token)
          .then((oauth) => oauth.json())
          .then((oauth) => {
            console.log(oauth);
            localStorage.setItem("oauth", JSON.stringify(oauth));

            getRecommandationsFunction(oauth.access_token, genre, tempoInBMP)
              .then((second_response) => {
                getRecommandationsSuccess(
                  second_response,
                  oauth.access_token,
                  refresh_token,
                  genre,
                  tempoInBMP,
                  true
                );
              })
              .catch((e) => {
                console.log(e);
              });
          });
      } else if (json && json.tracks) {
        console.log("->> success");
        // reduce amount of info to send to the watch
        json.tracks.forEach((track) => {
          songs = track.name;
          artists = track.artists[i].name;
          albums = track.album.name;
          artistlist.push(artists);
          songlist.push(songs);
          albumlist.push(albums);
        });

        // use outbox to send data to watch
        outbox
          .enqueue('songlist.cbor', cbor.encode({ songlist }))
          .then(() => console.log('songs sent'))
          .catch((error) => console.log(`send error: ${error}`));
        outbox
          .enqueue('artistlist.cbor', cbor.encode({ artistlist }))
          .then(() => console.log('artists sent'))
          .catch((error) => console.log(`send error: ${error}`));
        outbox
          .enqueue('albumlist.cbor', cbor.encode({ albumlist }))
          .then(() => console.log('albums sent'))
          .catch((error) => console.log(`send error: ${error}`));
      }
    });
  }
}

// Datalijst genres doorsturen
export function getListData() {
  const listData = data.map((item) => {
    return {
      name: item.name,
      id: item.id,
    };
  });
    console.log(listData);
        // use outbox to send data to watch
        outbox
          .enqueue('listData.cbor', cbor.encode({ listData }))
          .then(() => console.log('data genres sent'))
          .catch((error) => console.log(`send error: ${error}`));
}

// Data item genres doorsturen
export function getListItem(id) {
  const listItem = data.find((item) => {
    return id === item.id;
  });

    console.log(listItem);
        // use outbox to send data to watch
        outbox
          .enqueue('listItem.cbor', cbor.encode({ listItem }))
          .then(() => console.log('list item genres sent'))
          .catch((error) => console.log(`send error: ${error}`));
}


export default function getRecommandations(genre, tempoInBMP) {
  if (
    localStorage.getItem("oauth") &&
    JSON.parse(localStorage.getItem("oauth"))
  ) {
    const oauth = JSON.parse(localStorage.getItem("oauth"));
    const access_token = oauth.access_token;
    const refresh_token = oauth.refresh_token;

    getRecommandationsFunction(access_token, genre, tempoInBMP)
      .then((response) => {
        getRecommandationsSuccess(
          response,
          access_token,
          refresh_token,
          genre,
          tempoInBMP,
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("Not logged in");


  }
}
