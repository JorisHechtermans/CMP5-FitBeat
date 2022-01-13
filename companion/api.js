import { localStorage } from "local-storage";
import { outbox } from "file-transfer";
import * as cbor from 'cbor';

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

function getRecommandationsFunction(token, tempoInBMP) {
  return fetch(
    // genre of artist was required!
    `https://api.spotify.com/v1/recommendations?seed_genres=pop&target_tempo=${tempoInBMP}`,
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
  tempoInBMP,
  retry
) {
  let songlist = [];
  let artistlist = [];
  let songs = '';
  let artists = '';

  if (response && response.json) {
    response.json().then((json) => {
      console.log(json);
      if (json && json.error && json.error.status === 401 && !retry) {
        refreshToken(refresh_token)
          .then((oauth) => oauth.json())
          .then((oauth) => {
            console.log(oauth);
            localStorage.setItem("oauth", JSON.stringify(oauth));

            getRecommandationsFunction(oauth.access_token, tempoInBMP)
              .then((second_response) => {
                getRecommandationsSuccess(
                  second_response,
                  oauth.access_token,
                  refresh_token,
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
          artists = JSON.stringify(track.artists.name);
          artistlist.push(artists);
          songlist.push(songs);
        });

        console.log("nummers: " + songlist);
        console.log("artiesten: " + artistlist);
        // use outbox to send data to watch
        outbox
          .enqueue('recommendations.cbor', cbor.encode({ songlist }))
          .then(() => console.log('songs sent'))
          .catch((error) => console.log(`send error: ${error}`));
      }
    });
  }
}

export default function getRecommandations(tempoInBMP) {
  if (
    localStorage.getItem("oauth") &&
    JSON.parse(localStorage.getItem("oauth"))
  ) {
    const oauth = JSON.parse(localStorage.getItem("oauth"));
    const access_token = oauth.access_token;
    const refresh_token = oauth.refresh_token;

    getRecommandationsFunction(access_token, tempoInBMP)
      .then((response) => {
        getRecommandationsSuccess(
          response,
          access_token,
          refresh_token,
          tempoInBMP
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("Not logged in");
  }
}
