import { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { LogoWhiteImg, WelcomeImg } from '../assets';
import colors from '../../constants/color';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.background} source={WelcomeImg} resizeMode="cover">
        <Image style={styles.logo} source={LogoWhiteImg} />
        <Text style={styles.title}>Chhattisgarh</Text>

        <View style={styles.textRow}>
          <Text style={styles.subTitle}>First</Text>
          <Text style={[styles.subTitle, styles.highlightText]}>AI</Text>
          <Text style={styles.subTitle}>Based</Text>
        </View>

        <Text style={styles.subTitle}>Photo Gallery App</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.button}>
            <Text style={styles.buttonText}>Click To Proceed</Text>
        </TouchableOpacity>


        <View style={styles.footer}>
            <View>
            <Text style={styles.footerText}>
                By Continuing, You Agree To Our 
            </Text>
            </View>
    
            <View style={styles.layer}>
            <TouchableOpacity onPress={()=>navigation.navigate('TermServiceScreen')}>
                <Text style={styles.linkText}> Terms Of Services </Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                And Our
            </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('PrivacyPolicyScreen')}>
                <Text style={styles.linkText}> Privacy Policy </Text>
            </TouchableOpacity>
            </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop:-height/5
  },
  title: {
    fontWeight: '900',
    fontSize: 26,
    color: 'white',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitle: {
    fontWeight: '900',
    fontSize: 26,
    color: 'white',
    marginHorizontal: 5,
    marginVertical:-3
  },
  highlightText: {
    color: colors.secondary,
    fontWeight: '900',
  },
  button:{
    marginTop:40,
    backgroundColor:'white',
    width:width/1.2,
    height:50,
    borderRadius:40,
    justifyContent:'center',
    alignItems:'center'
    
  },
  buttonText:{
    color:colors.primary,
    fontWeight:'bold',
    fontSize:14
  },
  footer:{
    justifyContent:'center',
    flex:1,
    position:'absolute',
    bottom:height/5,
    alignItems:'center'
  },
  layer:{
    flexDirection:'row'
  },
  footerText:{
    color:'white',
    fontWeight:'bold'
  },
  linkText:{
    color:colors.secondary
  }
});

export default WelcomeScreen;
