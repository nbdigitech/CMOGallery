import {Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import { CrossImg, DownloadingImg } from '../assets';
import colors from '../../constants/color';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");

const ModalMessage = ({closeModal, message}) => {
    const navigation = useNavigation()
    return (
        <Modal visible={true} transparent animationType="slide">
        <View style={styles.modalSection}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => closeModal()} style={{ position: 'absolute', right: 5, top: 5 }}>
              <Image source={CrossImg} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            {/* <LottieView
              source={DownloadingImg} 
              autoPlay
              loop
              style={{ width: 40, height: 40 }}
            /> */}
            <Text style={styles.headingText}>Your selected images have been zipped successfully. Download Path : -</Text>
            <Text style={styles.subTitle}>
            {message}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-around' }}>
              {/* <TouchableOpacity
                style={{ ...styles.link, backgroundColor: colors.border, width: 100, borderRadius: 5, height: 40 }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
              onPress={() => closeModal()}
               style={{ ...styles.link, backgroundColor: colors.primary, borderRadius: 5, height: 40 }}>
                <Text style={{ color: 'white' }}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
}


const styles = StyleSheet.create({
    modalSection:{
        flex:1, 
        alignItems:'center', 
        justifyContent:'center'
      },
      modalContainer: {
        width:width/1.1,
        height:width/1.3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
        paddingHorizontal:20,
        borderColor:colors.primary,
        borderWidth:1
      },

      headingText:{
        fontSize:18,
        color:'black',
        fontWeight:'bold',
        marginVertical:10
      },
      subTitle:{
        // textAlign:'center',
        fontSize:16
      },
      link: {
        width: width / 2.4,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        flexDirection: 'row',
      },
})
export default ModalMessage