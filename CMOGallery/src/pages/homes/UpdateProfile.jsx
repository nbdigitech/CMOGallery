import {use, useEffect, useState} from 'react';
import {Text, View, StyleSheet, 
    TouchableOpacity, TextInput, Image, Dimensions, SafeAreaView} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/color'; 
import commonStyle from '../components/Style';
import Header from '../components/Header';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get("window");
const UpdateProfile = () => {
  const navigation = useNavigation();
  const [isInvalid, setIsInvalid] = useState({mobile:false, password:false})
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const submitHandle = () => {
    if(!isValidMobile(mobile)){
        setIsInvalid({...isInvalid, mobile:true})
        return;
    }
}

const user = useSelector(state=>state.login.user)

useEffect(() => {
    let userDetails = user
    if(user.signInWith == "google"){
        userDetails = user.user
    }
    if(userDetails.email){
        setEmail(userDetails.email)
    }
    if(userDetails.mobile){
        setMobile(user.mobile)
    }
    setName(userDetails.name)
},[])
    return (
        <SafeAreaView style={styles.container}>
            <Header screen='Update Profile' />
            <View style={{...commonStyle.contentBox, justifyContent:'center', flex:1, borderRadius:0}}>
                <View style={commonStyle.section}>
                <Text style={styles.title}>Update</Text>
                </View>
                <View style={commonStyle.section}>
                {user?.signInWith == 'google' &&
                <Image
                    style={styles.profileImg}
                    source={{
                      uri: user?.user.photo,
                    }}
                  />
                }
                    <View style={styles.inputSection}>
                    <TextInput placeholder='Full Name'
                     editable={false}
                     placeholderTextColor="#888"
                     value={name}
                     style={commonStyle.textInput} />
                     {isInvalid.name &&
                        <Text style={commonStyle.errorMessage}>Please enter your name</Text>
                    }
                    </View>
                   {
                    mobile &&
                    <View style={styles.inputSection}>
                    <TextInput placeholder='Enter Mobile No.'
                     editable={false}
                     placeholderTextColor="#888"
                     keyboardType="numeric"
                     value={mobile}
                     contextMenuHidden={true} maxLength={10} 
                     style={commonStyle.textInput} />
                     {isInvalid.mobile &&
                        <Text style={commonStyle.errorMessage}>Please enter 10 digit valid mobile</Text>
                    }
                    </View>
                    }
                  {email &&
                    <View style={styles.inputSection}>
                    <TextInput placeholder='Enter Email'
                     placeholderTextColor="#888"
                     value={email}
                     editable={false}
                     style={commonStyle.textInput} />
                     {isInvalid.email &&
                        <Text style={commonStyle.errorMessage}>Please enter valid email</Text>
                    }
                    </View>
                   }


                    {/* <View style={styles.inputSection}>
                    <TextInput placeholder='Enter your new password'
                     placeholderTextColor="#888"
                     style={commonStyle.textInput} />

                    </View> */}
                    <TouchableOpacity disabled style={{...commonStyle.submitBtn, backgroundColor:colors.border}}>
                            <Text style={{...styles.btnText, color:"gray"}}>Proceed</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
    flex:1,
    backgroundColor: 'white',
    },

    title:{
    color:colors.primary,
    fontWeight:"bold",
    fontSize:20,
    },

    btnText:{
    color:colors.secondary,
    fontWeight:"bold"
    },

    inputSection:{
    paddingVertical:10, 
    width:'100%',
    alignItems:'center'
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -width / 6,
        marginBottom: 10,
      },
})

export default UpdateProfile