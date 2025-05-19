import {useEffect, useState, useRef} from 'react';
import {Text, View, FlatList, SafeAreaView, PermissionsAndroid, StyleSheet, BackHandler, TouchableOpacity, Image, TextInput, Platform, Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/color'; 
import commonStyle from '../components/Style';
import { CameraImg, ImageUploadImg, uploadImg } from '../assets';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import { searchImage } from '../../redux/actions/EventAction';
import LoaderScreen from '../components/LoaderScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Image as CompressImage} from 'react-native-compressor';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const {width, height} = Dimensions.get('window')
const UploadPhotoScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userImage, setUserImage] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const refRBSheet = useRef();
  let isCancelled = false;
  const event_list = useSelector(state=>state.event.eventsList)
  const dispatch = useDispatch()


async function requestStoragePermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      
      return (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
}

useEffect(()=>{
  requestStoragePermission()
},[])


 
  useEffect(() => {
    if (showModal) {
      refRBSheet.current?.open();
    } else {
      refRBSheet.current?.close(); 
    }
  }, [showModal]);

  useEffect(() => {
    const backAction = () => {
      if (loader) {
        console.log('Back disabled during loading');
        return true; // Back button ko disable karo jab loader chalu ho
      }
      return false; // Normal back
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [loader]);

  const submitHandle = async () => {
    setLoader(true);
    try {
      const response = await dispatch(searchImage(userData));
      
      if (response?.error || response?.payload?.error) {
        setErrorMessage('Image not matched');
        setUserImage('');
      } else {
        setUserImage('');
        setUserData(null);
        navigation.navigate('ImageListScreen', {screen:'UploadPhotoScreen'});
      }
    } catch (err) {
      setErrorMessage('Something went wrong');
      console.log('API error:', err);
    } finally {
      setLoader(false); // Ye loader hataega and tab back allow hoga
    }
  };


  useEffect(() => {
    return () => {
      isCancelled = true;
    };
  }, []);

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      cameraType: 'back', 
      quality: 0.8,
    };
  
    launchCamera(options, async(response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        const compressedUri = await CompressImage.compress(response.assets[0].uri, {
          compressionMethod: 'auto',
          maxSize: 2, // in MB
        })
        response.assets[0].uri = compressedUri;
        setUserImage(response.assets[0].uri)
        setUserData(response.assets[0])
        // aap response.assets[0].uri ko upload ya local state me rakh sakte ho
      }
    });
    setShowModal(false)
  };


  const openGallery = () => {
    const options = {
      mediaType: 'photo', // 'video' bhi use kar sakte ho
      selectionLimit: 1,
    };
  
    launchImageLibrary(options, async(response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        const fileSizeInMB = response.assets[0].fileSize / (1024 * 1024);
        if(fileSizeInMB>5){
          setErrorMessage('File size is too large! (Max - 5 MB)')
          setTimeout(() => {
            setErrorMessage('')
          }, 3000);
          return;
        }

        const compressedUri = await CompressImage.compress(response.assets[0].uri, {
          compressionMethod: 'auto',
          maxSize: 2, // in MB
        })
        response.assets[0].uri = compressedUri;
        setUserImage(response.assets[0].uri)
        setUserData(response.assets[0])
      }
    });

    setShowModal(false)
  };

    return (
        <SafeAreaView style={styles.container}>
            <Header screen='Image Search' />
            <View style={{...commonStyle.contentBox, justifyContent:'center', flex:1, borderRadius:0}}>
                <View style={commonStyle.section}>
                <Text style={styles.title}>Upload Photo</Text>
                {/* <Text style={styles.subTitle}>& Event Details</Text> */}
                </View>

          
                <View style={{...commonStyle.section}}>
                    <TouchableOpacity 
                    onPress={() => setShowModal(true)}
                    style={{...commonStyle.textInput, paddingLeft:0,  height:width/1.2, width:width/1.2,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    borderStyle: 'dotted', 
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius: 8,}} >
                        {userImage == "" ?
                        <>
                        <Image source={uploadImg} style={{width:100, height:100}} />
                        {/* <Text style={{color:colors.primary, fontWeight:'bold', marginTop:10}}> Upload A Photo</Text> */}
                        </>
                        :
                        <View style={{position:'absolute'}}>
                        <Image source={{uri:userImage}} style={styles.userImg} />
                        </View> 
                      }
                    </TouchableOpacity>
                   <Text style={{alignSelf:'flex-start', marginLeft:25, marginTop:10, fontWeight:'bold'}}>Image Format (Jpg, Jpeg, Png)</Text>
                   {errorMessage!="" &&
                   <Text style={{alignSelf:'flex-start', marginLeft:25, marginTop:10, color:'red', fontWeight:'bold'}}>{errorMessage}</Text>
                   }
                   <Text style={{alignSelf:'flex-start', marginLeft:25, marginTop:10, color:'red', fontWeight:'bold'}}>
                   Dont use photos with filters, heavy editing, or blurred backgrounds
                   </Text>
                   </View>

                <View style={commonStyle.section}>
                <TouchableOpacity
                  onPress={()=>submitHandle()}
                  disabled={userImage==""}
                  style={[commonStyle.submitBtn, {backgroundColor: userImage=="" ? colors.border : colors.primary}]}>
                <Text style={[styles.btnText, {color: userImage=="" ? 'gray' : colors.secondary}]}>Proceed</Text>
                </TouchableOpacity>
                </View>

            </View>

          
                {loader && <LoaderScreen
                screen={"UploadPhotoScreen"}
                message2={"The latest AI image search."}
                message={"Searching Related Photo..."}
                backgroundColor="white"
                />}



<View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: "#000"
          },
          container:{
            height:height/3,
            borderTopEndRadius:30,
            borderTopLeftRadius:30
          }
        }}
        onClose={() => setShowModal(false)}
      >
        
        <View style={styles.sheetContent}>
          <View style={styles.topHR}></View>
          <View style={{position:'absolute', top:30}}>
            <Text style={{fontSize:16, color:colors.primary, fontWeight:'bold'}}>Choose an Action</Text>
          </View>
          <View style={styles.header}>
              <TouchableOpacity onPress={() => openGallery()} style={styles.uploadImg}>
                 <Image style={styles.uploadImg} source={ImageUploadImg} />
                 <Text style={{color:colors.primary, fontWeight:'bold', marginTop:5}}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openCamera()} style={styles.uploadImg}>
                 <Image style={styles.uploadImg} source={CameraImg} />
                 <Text style={{color:colors.primary, fontWeight:'bold', marginTop:5}}>Camera</Text>
              </TouchableOpacity>
              </View>
        </View>
        <TouchableOpacity>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </RBSheet>
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
    dateInput:{
        flexDirection:"row",
        justifyContent:'space-between'
    },

      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
      },
      modalContent: {
        marginHorizontal:30,
        borderRadius: 5,
        padding: 10,
        backgroundColor:'white'
      },
      option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      userImg:{
        width:width/1.24,
        height:width/1.24,
        borderRadius:5
    },
    dropDownImg:{
      width:20, 
      height:20
    },
    sheetContent: {
      paddingVertical: 40,
      alignItems: 'center',
      paddingHorizontal:20,
      height:height/3,
      justifyContent:'center'
    },
    topHR:{
      width:width/3,
      height:2,
      backgroundColor:colors.secondary,
      position:'absolute',
      top:10
    },
    header:{
      flexDirection:'row',
      justifyContent:'space-around',
      width:'100%'
    },
    uploadImg:{
      width:50,
      height:50
    }
})

export default UploadPhotoScreen