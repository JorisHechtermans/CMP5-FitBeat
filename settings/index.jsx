// !! spotify user login: https://dev.fitbit.com/build/reference/settings-api/

registerSettingsPage(({ settings }) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
          FitBeat
        </Text>
      }
    >
      <Text>Hello world!</Text>
    </Section>
  </Page>
));


//User moet inloggen op spotify
<Oauth
  settingsKey="oauth"
  title="Spotify Login"
  label="Spotify"
  status="Login"
  authorizeUrl="??"
  requestTokenUrl="??"
  clientId="e20b271fbe414f58be02dd74a956e54c"
  clientSecret="163c689ca0d4437a963cd55058913815"
  scope="profile"
  pkce //??
/>
