    import { useEffect } from "react";
    import { StyleSheet, View, Text, Image } from "react-native";
    import Toast from "react-native-toast-message";
    import colors from "../../constants/color";
    import { CopyImg, CrossImg, SuccessImg } from "../assets";

    const Toaster = ({type, message}) => {

    useEffect(()=>{
    Toast.show({
        type: type,
        text2: message,
        position: 'bottom', // or 'bottom'
        visibilityTime: 3000,
        bottomOffset: 10,
    });
    },[])


    const toastConfig = {
    success: ({ text1, text2 }) => (
        <View style={{...styles.errorToastContainer, backgroundColor:'#34A853', paddingVertical:15}}>
        <Image source={SuccessImg} style={{width:25, height:25}} />
        <Text style={styles.errorToastSubText}>{text2}</Text>
        </View>
    ),
    error: () => (
        <View style={{...styles.errorToastContainer}}>
        <Image source={CrossImg} style={{width:25, height:25, marginTop:1, marginLeft:10,}} />
        <Text style={styles.errorToastSubText}>Mobile or Password are Invalid.</Text>
        </View>
    ),

    };

        return (
            <Toast config={toastConfig} />
        )
    }

    const styles = StyleSheet.create({
        toastContainer: {
            backgroundColor: colors.primary,
            borderRadius: 10,
            padding:10,
            width:"90%",
            flexDirection:'row',
            },
            toastText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            },
            toastSubText: {
            color: 'white',
            fontSize: 14,
            },
            errorToastContainer: {
            backgroundColor: 'red',
            borderRadius: 10,
            marginHorizontal: 10,
            paddingHorizontal:20,
            paddingVertical:10,
            flexDirection:'row',
            justifyContent:'center', 
            },
            errorToastText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            },

            errorToastSubText:{
            color:'white',
            fontSize:16,
            paddingLeft:10,
            marginTop:2
            },

            close:{
            position:'absolute',
            right:10,
            alignSelf:'center'
            }
        })

    export default Toaster;