import {Text, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color'; 
import {useEffect} from 'react';
import commonStyle from '../components/Style';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
const RegisterScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={commonStyle.contentBox}>
                <View style={commonStyle.section}>
                <Text style={styles.title}>AI Based CMO Gallery</Text>
                <Text style={styles.subTitle}>On Click Download</Text>
                </View>
                <GoogleSignIn />

                <View style={commonStyle.dividerContainer}>
                    <View style={{...commonStyle.hr, width:"20%"}}></View>
                    <View style={commonStyle.centerText}><Text>Or Sign Up With Mobile</Text></View>
                    <View style={{...commonStyle.hr, width:"20%"}}></View>
                </View>

                <View style={commonStyle.section}>
                    <TextInput placeholderTextColor="#888" placeholder='Full Name' style={commonStyle.textInput} />
                </View>

                <View style={commonStyle.section}>
                    <TextInput placeholderTextColor="#888" placeholder='Mobile No.' style={commonStyle.textInput} />
                </View>


                <View style={commonStyle.section}>
                    <TextInput placeholderTextColor="#888"  placeholder='Create Your Password' style={commonStyle.textInput} />
                    <Text style={commonStyle.errorMessage}>Please enter valid password</Text>
                </View>

                <View style={commonStyle.section}>
                <TouchableOpacity  style={commonStyle.submitBtn}>
                            <Text style={styles.btnText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={commonStyle.section}>
                <View style={styles.registerPrompt}>
                        <Text style={commonStyle.questionText}>Already Registered? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                            <Text style={commonStyle.linkText}>Sign In</Text>
                        </TouchableOpacity>
                </View>
                </View>

                <Footer/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        flex:1,
        paddingHorizontal:10,
    },
    title:{
        color:colors.primary,
        fontWeight:"bold",
        fontSize:20,
    },
    subTitle:{
        color:colors.primary,
        fontSize:11
    },
   
    btnText:{
        color:colors.secondary,
        fontWeight:"bold"
    },
   
    googleBtnText:{

    },
    registerPrompt:{
        flexDirection:"row",
    },
})

export default RegisterScreen