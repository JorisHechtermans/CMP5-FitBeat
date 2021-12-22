import { localStorage } from "local-storage";

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
    `https://api.spotify.com/v1/recommendations?seed_genres=classical&target_tempo=${tempoInBMP}`,
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
        // use outbox to send data to watch
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
