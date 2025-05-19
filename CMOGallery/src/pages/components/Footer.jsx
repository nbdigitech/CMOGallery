import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import commonStyle from '../components/Style';
const Footer = () => {
    const navigation = useNavigation();
    return(
        <View style={commonStyle.policySection}>
            <TouchableOpacity onPress={()=>navigation.navigate('PrivacyPolicyScreen')} style={commonStyle.extraBtn}>
                <Text style={commonStyle.questionText}>Privacy Policy </Text>
            </TouchableOpacity>
            <View style={styles.divider}>
                <Text style={styles.text}> | </Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('TermServiceScreen')} style={commonStyle.extraBtn}>
                <Text style={commonStyle.questionText}>Terms Of Services </Text>
            </TouchableOpacity>
            <View style={styles.divider}>
                <Text style={styles.text}> | </Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('TermsOfUse')} style={commonStyle.extraBtn}>
                <Text style={commonStyle.questionText}>Terms Of Use </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        color:'gray',
        marginTop:-1,
        paddingHorizontal:5
    }
})

export default Footer;