import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DashboardNavigation from './pages/DashboardNavigation';
import AuthStackNavigation from './pages/AuthStackNavigation';
import SplashScreen from './pages/authentications/SplashScreen';
import { googleLoggedIn, loginUser } from './redux/actions/loginAction';

const RootNavigation = () => {
  const dispatch = useDispatch();
  const isloggedUser = useSelector(state => state.login.isloggedIn);

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setIsAuthenticated(true);
        let wayOfLogin = JSON.parse(credentials.password);

        if (wayOfLogin.signInWith === 'google') {
          dispatch(googleLoggedIn(wayOfLogin));
        } else {
          dispatch(loginUser({
            mobile: wayOfLogin.user.mobile,
            password: wayOfLogin.password,
          }));
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Keychain Error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = setTimeout(() => {
      checkLoginStatus();
    }, 2000); // splash screen delay
    return () => clearTimeout(init);
  }, [isloggedUser]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* <StatusBar
          backgroundColor="#ffffff" 
        /> */}
        {isAuthenticated ? (
          <DashboardNavigation />
        ) : (
          <AuthStackNavigation />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
