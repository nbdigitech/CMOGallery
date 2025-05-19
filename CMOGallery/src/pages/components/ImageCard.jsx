import { useNavigation } from '@react-navigation/native';
import {View, TouchableOpacity, Text, StyleSheet, 
    ImageBackground, Image, Dimensions, Share} from 'react-native';
import commonStyle from './Style';
import { DownloadImg, LinkImg, ShareImg, DownloadingImg } from '../assets';
import Clipboard from '@react-native-clipboard/clipboard';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadAndZipImages } from '../../utils/zipCreate';
import { useEffect, useState } from 'react';
import { getPhotos, recordDownloadHistory } from '../../redux/actions/EventAction';
import { useDispatch, useSelector } from 'react-redux';
import LoaderScreen from './LoaderScreen';
import { downloadWarningModal, resetDownloadTrigger } from '../../redux/reducers/EventReducer';
const { width } = Dimensions.get('window')
const ImageCard = ({ item,  customHeight, downloadProcess, setCopy, startDownload }) => {
    const user = useSelector(state=>state.login.user)
    const eventTrigger = useSelector(state=>state.event.downloadTrigger)
    const [itemId, setItemId] = useState("")
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const clickEventHandle = async() => {
      let data = JSON.parse(await AsyncStorage.getItem('events')) || [];
      let result = data;
      if(!data.includes(item?._id)){
        result.unshift(item?._id)
      }
      else{
        result = data.filter(id => id !== item?._id);
        result.unshift(item?._id)
      }
      AsyncStorage.setItem('events', JSON.stringify(result))
      navigation.navigate('ImageListScreen', { id: item?._id, title:item?.name })
    }
    const copyToClipboard = (uri) => {
      if (typeof setCopy === 'function') {
        setCopy();
      } 
        Clipboard.setString(uri);
      };

    const onShare = async (uri) => {
    try {
        const result = await Share.share({
        message: (uri),
        url: uri, 
        });
        if (result.action === Share.sharedAction) {
        if (result.activityType) {
            console.log('Shared with activity type: ', result.activityType);
        } else {
            console.log('Content shared');
        }
        } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
        }
    } catch (error) {
        console.error(error.message);
    }
    };

useEffect(() => {
  if(eventTrigger && itemId){
  const downloadZipHandle = async() => {
    dispatch(resetDownloadTrigger())
    downloadProcess(true)
    let data = await dispatch(getPhotos({id:itemId, limit:'full', page:2}));
    
    if(data?.payload){
     let result = data?.payload?.data?.photos?.map((value)=>{
        return value.image
      })
    if(result?.length == 0){
      downloadProcess(false)
      return;
    }
     
    let getFilePath = await downloadAndZipImages(result)
    
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
     let object = {
        title: item.name,
        image: item.cover,
        photoCount: item?.photo_count,
        date: formattedDate,
        photoUrls: result
      }

     let response = await dispatch(recordDownloadHistory({download:object, userId:user.userId}))
     setItemId("")
     downloadProcess(false, getFilePath)
    }

    else{
    downloadProcess(false)
    }
  }
  downloadZipHandle()
}
else{
  dispatch(resetDownloadTrigger())
}
},[eventTrigger])
    

    
    return (
      <View style={styles.imageCard}>
        <TouchableOpacity
          style={{ borderRadius: 15, overflow: 'hidden' }}
          onPress={()=> clickEventHandle()}
        >
          <ImageBackground
            source={{ uri: item?.cover }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
            imageStyle={{borderRadius:15}}
          >
            <View style={commonStyle.directoryContent}>
              <View>
                <Text style={commonStyle.imageCountText}>{item.photo_count}</Text>
                <Text style={commonStyle.photosText}>photos</Text>
              </View>
              <View style={styles.eventDateSection}>
                <Text style={styles.eventDate}>{item?.date}</Text>
              </View>
            </View>
          </ImageBackground>
          <View 
          onStartShouldSetResponder={() => true}
          onResponderStart={(event) => event.stopPropagation()}
          style={styles.imgBottomSection}>
            <Text style={commonStyle.title}>{item?.name?.length > 15 ? item?.name?.substring(0, 15) + '...' : item?.name}</Text>
            <View style={commonStyle.linksSection}>
             
              <TouchableOpacity disabled={item?.photo_count == 0} onPress={()  => 
              {
                setItemId(item?._id)
                dispatch(downloadWarningModal())
              }
                }>
                <Image source={DownloadImg} style={commonStyle.linkIMg} />  
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => onShare(`https://nbdigital.online/album/${item?._id}`)}>
                <Image source={ShareImg} style={commonStyle.linkIMg} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>copyToClipboard(`https://nbdigital.online/album/${item?._id}`)}>
                <Image source={LinkImg} style={commonStyle.linkIMg} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    );
    }

const styles = StyleSheet.create({
    imageCard:{
    marginVertical:10, 
    width: '95%',
    },
    
    eventDateSection:{
    width: width / 4, 
    justifyContent: "center", 
    alignItems: "flex-end" 
},
    eventDate: {
    fontSize: 11,
    color: "white",
    position: "absolute",
    bottom: 2,
    right: 0, 
    },
    imgBottomSection:{
        marginTop:10
     },
})

export default ImageCard