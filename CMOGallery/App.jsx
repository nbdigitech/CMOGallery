import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './src/RootNavigation';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import NetworkListner from './src/pages/components/NetWorkListner';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const AppContent = () => {
  const loading = useSelector(state => state.network.on); 
  const [internet, setInternet] = useState(true);
  const [version, setVersion] = useState(0)
  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (!state.isConnected && !state.isInternetReachable) {
        setInternet(false);
        setTimeout(() => {
            setInternet(true)
        }, 3000);
      } else {
        setInternet(true);
      }
    });
  }, [loading]);

  return (
    <NavigationContainer>
      <RootNavigation />
      {!internet && <NetworkListner />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
