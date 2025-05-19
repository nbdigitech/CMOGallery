import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Toast from "react-native-toast-message";
import { CrossImg } from "../assets";
import { useDispatch } from "react-redux";

const NetworkListner = () => {

useEffect(()=>{
Toast.show({
    type: 'error',
    text: '',
    position: 'bottom', 
    visibilityTime: 5000,
    bottomOffset: 10,
});
},[])


const toastConfig = {
error: () => (
    <View style={styles.errorToastContainer}>
    <Image source={CrossImg} style={{width:25, height:25, marginTop:8, marginLeft:10}} />
    <Text style={styles.errorToastSubText}>Oops! Please ensure that your internet connection is active and try again.</Text>
    </View>
)
};

    return (
        <Toast config={toastConfig} />
    )
}

const styles = StyleSheet.create({
        errorToastContainer: {
        backgroundColor: 'red',
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal:20,
        paddingVertical:10,
        flexDirection:'row',
        justifyContent:'center', 
        width:'95%',
        marginBottom:60
        },
        errorToastText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        },

        errorToastSubText:{
        color:'white',
        fontSize:16,
        paddingLeft:10
        },

        close:{
        position:'absolute',
        right:10,
        alignSelf:'center'
        }
    })

export default NetworkListner;