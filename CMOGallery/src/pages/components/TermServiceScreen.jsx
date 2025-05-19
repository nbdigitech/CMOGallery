import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from './Header';
const { height, width } = Dimensions.get('window');

const TermServiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <Header screen="Terms & Conditions"/>
      <WebView
        source={{ uri: 'https://nbdigital.online/info/terms-and-conditions' }}
        style={styles.webview}
        onError={() => console.log('WebView failed to load')}
        onLoad={() => console.log('WebView loaded successfully')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  webview: {
    flex: 1, // Ensure WebView takes up all available space
    width: width, // Full width
    height: height, // Full height
  },
});

export default TermServiceScreen;
