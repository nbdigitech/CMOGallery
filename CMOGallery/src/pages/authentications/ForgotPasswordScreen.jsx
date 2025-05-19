import {Text, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color'; 
import {useState} from 'react';
import commonStyle from '../components/Style';
import Footer from '../components/Footer';
import { isValidMobile } from '../../utils/Validation';
const ForgotPasswordScreen = () => {
    const [mobile, setMobile] = useState('');
    const [isInvalid, setIsInvalid] = useState({mobile:false})
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

                <View style={commonStyle.dividerContainer}>
                    <View style={{...commonStyle.hr, width:"20%"}}></View>
                    <View style={styles.centerText}><Text>Forgot Your Password?</Text></View>
                    <View style={{...commonStyle.hr, width:"20%"}}></View>
                </View>

                <View style={commonStyle.section}>
                    <TextInput 
                    placeholder='Enter Your Mobile Number'
                    keyboardType="numeric"
                    contextMenuHidden={true} maxLength={10}  
                    placeholderTextColor="#888"
                    value={mobile}
                    onChangeText={(text)=>{
                        setMobile(text)
                        setIsInvalid({mobile:false})
                    }
                    }
                    style={commonStyle.textInput} />
                     {isInvalid.mobile &&
                    <Text style={commonStyle.errorMessage}>Please enter 10 digit valid mobile</Text>
                    }
                    <TouchableOpacity onPress={submitHandle} style={commonStyle.submitBtn}>
                            <Text style={styles.btnText}>Send Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={commonStyle.section}>
                <View style={styles.registerPrompt}>
                        <Text style={commonStyle.questionText}>Not Register Yet? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("MobileRegisterScreen")}>
                            <Text style={commonStyle.linkText}>Sign Up</Text>
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

export default ForgotPasswordScreen