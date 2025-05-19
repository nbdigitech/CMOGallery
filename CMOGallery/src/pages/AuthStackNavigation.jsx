import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './authentications/LoginScreen';
import SplashScreen from './authentications/SplashScreen';
import RegisterScreen from './authentications/RegisterScreen';
import LoaderScreen from './components/LoaderScreen';
import UploadPhotoScreen from './authentications/UploadPhotoScreen';
import MobileRegisterScreen from './authentications/MobileRegisterScreen';
import ForgotPasswordScreen from './authentications/ForgotPasswordScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';
import TermServiceScreen from './components/TermServiceScreen';
import GoogleAuthentication from './authentications/GoogleAuthentication';
import TermsOfUse from './components/TermsOfUse';
import WelcomeScreen from './components/WelcomeScreem';
// import ProfileScreen from './homes/ProfileScreen';
const Stack = createNativeStackNavigator();
const AuthStackNavigation = () => {
  return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='WelcomeScreen'>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="UploadPhotoScreen" component={UploadPhotoScreen} />
            <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
            <Stack.Screen name="MobileRegisterScreen" component={MobileRegisterScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermServiceScreen" component={TermServiceScreen} />
            <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
            <Stack.Screen name="GoogleAuthentication" component={GoogleAuthentication} />
        </Stack.Navigator>
  )
}

export default AuthStackNavigation
