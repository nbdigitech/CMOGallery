import { Image, StyleSheet, View, Dimensions, ImageBackground, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SplashImg, LogoImg } from '../assets';
import { useEffect } from 'react';
import colors from '../../constants/color';
const { width, height } = Dimensions.get('window');
const SplashScreen = () => {
    const navigation = useNavigation(); 

    useEffect(() => {
      const timer = setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 3000);
  
      return () => clearTimeout(timer); // Clean up the timer on unmount
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={SplashImg} style={styles.image}>
                <View style={styles.section}>
                <Image source={LogoImg} style={styles.logo} />
                <Text style={styles.title}>CMO Gallery</Text>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        flex:1,
    },
    image:{
        width:width,
        height:height,
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    section:{
        marginTop:-width,
        alignItems:"center",
    },
    title:{
        color:colors.primary,
        fontWeight:"bold",
        fontSize:30,
    },
    logo:{
        width:width/4,
        height:width/4,
        alignItems:"center",
        marginBottom:10
    },

})
export default SplashScreen