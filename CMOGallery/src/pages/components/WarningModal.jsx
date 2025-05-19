import {Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import { CrossImg } from '../assets';
import colors from '../../constants/color';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { downloadTrigger, resetDownloadTrigger } from '../../redux/reducers/EventReducer';
const { width, height } = Dimensions.get("window");

const WarningModal = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    return (
        <Modal visible={true} transparent animationType="slide">
        <View style={styles.modalSection}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => dispatch(resetDownloadTrigger())} style={{ position: 'absolute', right: 5, top: 5 }}>
              <Image source={CrossImg} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          
            <Text style={styles.headingText}>Are you sure ?</Text>
            <Text> Proceeding will download all images related to this event to your device. 
  You can cancel if you don’t want to continue.</Text>
            <View style={{ flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-around' }}>
             
              <TouchableOpacity
              onPress={() => dispatch(resetDownloadTrigger())}
               style={{ ...styles.link, backgroundColor: colors.border, borderRadius: 5, height: 40,  }}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() => dispatch(downloadTrigger())}
               style={{ ...styles.link, backgroundColor: colors.primary, borderRadius: 5, height: 40 }}>
                <Text style={{ color: 'white' }}>Yes To Proceed</Text>
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
        justifyContent:'center',
       
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
        width:'auto',
        paddingHorizontal:30,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        flexDirection: 'row',
      },
})
export default WarningModal