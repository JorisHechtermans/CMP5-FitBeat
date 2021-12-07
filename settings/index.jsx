// !! spotify user login: https://dev.fitbit.com/build/reference/settings-api/

registerSettingsPage((props) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
          FitBeat
        </Text>
      }
    >
      <Oauth
        settingsKey="oauth"
        label="Spotify Login"
        status={props.settings.oauth ? "Logged in!" : "Login"}
        authorizeUrl="https://accounts.spotify.com/authorize"
        requestTokenUrl="https://accounts.spotify.com/api/token"
        clientId="e20b271fbe414f58be02dd74a956e54c"
        clientSecret="163c689ca0d4437a963cd55058913815"
        scope="user-library-read"
      />
    </Section>
  </Page>
));
