import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

const GoogleAuthentication = ({ navigation }) => {
  const CLIENT_ID = '252059010893-5nt58rov17d2rkqu2ntm4559ed7kb1om.apps.googleusercontent.com';
  const REDIRECT_URI = 'http://localhost:3000'; // Dummy URI
  const SCOPE = 'profile email';
  const RESPONSE_TYPE = 'token'; // Or "code" for server-side flow

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

  const handleNavChange = (event) => {
    const { url } = event;

    if (url.startsWith(REDIRECT_URI)) {
      const token = url.match(/access_token=([^&]+)/)?.[1];
      const code = url.match(/code=([^&]+)/)?.[1];

      console.log('Access Token:', token);
      console.log('Auth Code:', code);

      // Ab yahan se navigate karo kisi screen pe
      navigation.replace('HomeScreen', { token });

      return false;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: authUrl }}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
      />
    </View>
  );
};

export default GoogleAuthentication