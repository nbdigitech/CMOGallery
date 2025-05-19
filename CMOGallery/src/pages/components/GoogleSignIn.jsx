import React, {useEffect} from 'react';
import {View, Linking, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import commonStyle from './Style';
import { GoogleImg } from '../assets';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';
import { useDispatch } from 'react-redux';
import { loggedInSuccess } from '../../redux/reducers/loginReducer';
import { googleLoggedIn } from '../../redux/actions/loginAction';
const { height, width } = Dimensions.get('window');

const GoogleSignIn = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    useEffect(() => {
      if(Platform.OS == 'ios'){
        GoogleSignin.configure({
          iosClientId: '252059010893-lg88b864jd6n0j2r8b8nn7qlnvohpk72.apps.googleusercontent.com', 
          offlineAccess: false,
        });
      }
      else{
      GoogleSignin.configure({
          webClientId: '252059010893-sotmkfgcjl5g8tkg3nbrjlgmatnt7rd6.apps.googleusercontent.com',
          offlineAccess: false,
        });
      }
      

      }, []);
      const signInWithGoogle = async () => {
        try {
          await GoogleSignin.hasPlayServices(); 
          const userInfo = await GoogleSignin.signIn();
          if(userInfo.type == "success"){
            const dataToStore = {
              user: userInfo?.data?.user,
              auth_token: userInfo?.data?.idToken,
              signInWith: 'google',
            };
            let api_result = await dispatch(googleLoggedIn(dataToStore)) 
            dataToStore.user.userId = api_result.payload.userId
            await Keychain.setGenericPassword('user', JSON.stringify(dataToStore));
            dispatch(loggedInSuccess())
          }
          else{
            console.error('something went wrong:', userInfo);
          }
        } catch (error) {
          console.error('Google Sign-In Error:', error);
        }
      };

  return (
    <View style={commonStyle.section}>
    <TouchableOpacity onPress={() => signInWithGoogle()} style={commonStyle.googleBtn}> 
            <Image style={{width:20, height:20, marginTop:2}} source={GoogleImg} />
            <Text> Sign In With Google</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  
});

export default GoogleSignIn;
