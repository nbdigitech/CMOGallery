import {Text, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color'; 
import {useState} from 'react';
import commonStyle from '../components/Style';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import { isValidMobile } from '../../utils/Validation';
const MobileRegisterScreen = () => {
    const [mobile, setMobile] = useState('');
    const [isInvalid, setIsInvalid] = useState({mobile:false, password:false})
    const navigation = useNavigation();

    const submitHandle = () => {
        if(!isValidMobile(mobile)){
            setIsInvalid({...isInvalid, mobile:true})
            return;
        }
    }

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
                    <TextInput placeholder='Enter Mobile No.'
                     placeholderTextColor="#888"
                     keyboardType="numeric"
                     contextMenuHidden={true} maxLength={10} 
                     style={commonStyle.textInput} />
                     {isInvalid.mobile &&
                        <Text style={commonStyle.errorMessage}>Please enter 10 digit valid mobile</Text>
                    }
                    <TouchableOpacity onPress={submitHandle} style={commonStyle.submitBtn}>
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
        paddingHorizontal:10
    },
    
    title:{
        color:colors.primary,
        fontWeight:700,
        fontSize:24,
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

export default MobileRegisterScreen