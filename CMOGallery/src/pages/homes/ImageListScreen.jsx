import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView
} from 'react-native';
import colors from '../../constants/color';
import Header from '../components/Header';
import { CrossImg, DownloadFixImg, DownloadingImg, ShareFixImg } from '../assets';
import commonStyle from '../components/Style';
import { useDispatch, useSelector } from 'react-redux';
import { getPhotos, recordDownloadHistory, searchImage } from '../../redux/actions/EventAction';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import LoaderScreen from '../components/LoaderScreen';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { downloadAndZipImages } from '../../utils/zipCreate';
import ModalMessage from '../components/ModalMessage';

const {width, height} = Dimensions.get('window')
// ✅ ImageCard component
const ImageCard = ({ item, isSelected, onSelect }) => (
  <View style={{ ...styles.imageCard, height: item.height }}>
    <TouchableOpacity style={styles.imageTouchable} onPress={onSelect}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.topShadow} />
        {isSelected && (
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

const ImageListScreen = (props) => {
  const [downloadProcess, setDownloadProcess] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('Loading event all images...');
  const [message2, setMessage2] = useState('');
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [downloadPath, setDownloadPath] = useState("")
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const event = useSelector((state) => state.event);
  const user = useSelector(state=>state.login.user)

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getPhotos({ id: props?.route?.params?.id, limit: 16, page: 1 }));
  
      const photos = result.payload?.data?.photos || [];
      const total = result.payload?.data?.total; 
  
  
      if (typeof total === 'number') {
        setCount(Math.ceil(total / 16));
      }
  
      if (photos.length < 16 || photos.length >= total) {
        setHasMore(false);
      }
    };
  
    if(props?.route?.params?.screen != 'UploadPhotoScreen'){
      fetchData();
    }
    else{
      let total = event.eventPhotos?.length;
      setCount(Math.ceil(total / 16));
      if (event.eventPhotos.length < 16) {
        setHasMore(false);
      }
    }
   
  }, []);


  const toggleSelectImage = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  

  async function downloadImageToLocal(url, index) {
    const extension = url.split('.').pop().split(/\#|\?/)[0]; // get file extension
    const localPath = `${RNFS.CachesDirectoryPath}/shared_image_${index}.${extension}`;

    const res = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
    }).promise;

    if (res.statusCode === 200) {
      return Platform.OS === 'android' ? 'file://' + localPath : localPath;
    } else {
      throw new Error('Failed to download image');
    }
  }

  const shareImages = async (urls) => {
    try {
      if(urls.length == 0) return;
      setLoader(true);
      setMessage('Please wait...');
      
      const localImagePaths = await Promise.all(
        urls.map((url, index) => downloadImageToLocal(url, index))
      );
  
      const shareOptions = {
        title: 'Share images',
        urls: localImagePaths,
      };
  
      setLoader(false);
      setMessage('Loading event all images...');
      
      await Share.open(shareOptions);
    } catch (error) {
      
      if (error?.message?.includes('User did not share') || error?.message?.includes('User cancelled')) {
        console.log('User cancelled sharing');
      } else {
        console.error('Error sharing images:', error);
      }
      setLoader(false); 
      setMessage('');
    }
  };

  // ✅ Updated renderItem function
  const renderItem = ({ item }) => (
    <ImageCard
      item={item}
      isSelected={selectedImages.includes(item?.image)}
      onSelect={() => toggleSelectImage(item.image)}
    />
  );

  const selectAllHandle = () => {
    if (selectedImages?.length == event?.eventPhotos?.length) {
      setSelectedImages([]);
    } else {
      let result = event?.eventPhotos?.map((value) => {
        return value.image;
      });
      setSelectedImages(result);
    }
  };

  
  const downloadZipHandle = async() => {
    if(selectedImages?.length==0)return;
    setDownloadProcess(true)
    setMessage("Your selected images are downloading")
    setMessage2("Please wait...")
    if(selectedImages?.length>0){
    let getFilePath = await downloadAndZipImages(selectedImages)
    
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
     let object = {
        title: "Custom Download",
        image: selectedImages[0],
        photoCount: selectedImages?.length,
        date: formattedDate,
        photoUrls: selectedImages
      }
     let response = await dispatch(recordDownloadHistory({download:object, userId:user.userId}))
     setDownloadPath(getFilePath)
    }
    setModalOpen(true)
    setDownloadProcess(false)
  }

  const loadMoreHandle = async (direction) => {
    if (direction === 'next' && hasMore) {
      setLoader(true)
      const nextPage = page + 1;
  
      const result = await dispatch(getPhotos({
        id: props?.route?.params?.id,
        limit: 16,
        page: nextPage,
      }));
  
      const newPhotos = result.payload?.data?.photos || [];
      if (newPhotos.length < 16) {
        setHasMore(false);
      }
      
      setPage(nextPage);
      setLoader(false)
    }

    else if(direction === 'next' && !hasMore){
      setPage(prevPage);
      setHasMore(true); 
    }
  
   else if (direction === 'previous' && page > 1) {
      const prevPage = page - 1;
  
      const result =  data
  
      const newPhotos = result || [];
  
      setData(newPhotos); 
      setPage(prevPage);
      setHasMore(true); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header screen="All Images" />
      {props?.route?.params?.title && (
        <View style={styles.titleSection}>
          <Text style={{ ...commonStyle.title, width: '75%' }}>
            {props?.route?.params?.title}
          </Text>

          <View style={{ position: 'absolute', right: 20, paddingTop: 10 }}>
            {event?.eventPhotos?.length>0 &&
            <TouchableOpacity onPress={() => selectAllHandle()} style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>Select All</Text>
              <View
                style={{
                  ...styles.checkboxContainer,
                  backgroundColor: 'white',
                  position: 'relative',
                  borderColor: 'black',
                  right: -5,
                  top: 0,
                }}
              >
                {selectedImages.length == event.eventPhotos?.length && (
                  <View style={styles.checkbox}>
                    <Text style={{ ...styles.checkmark, color: colors.primary }}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
             }
          </View>
        </View>
      )}

      <View style={styles.imagesSection}>
        <FlatList
          data={event?.eventPhotos?.slice((page - 1) * 16, page * 16)}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
   {event?.eventPhotos?.length>0 &&
        <View style={styles.pagination}>
          <TouchableOpacity disabled={page == 1} onPress={() => loadMoreHandle('previous')} 
          style={{...styles.paginateBtn, backgroundColor:page == 1?colors.border:colors.primary}}>
            <Text style={{color:page == 1?"gray":"white", fontWeight:'bold'}}>Previous</Text>
          </TouchableOpacity>

            <View style={{...styles.paginateBtn, width:'33%'}}>
              <Text style={{color:'white', fontWeight:'bold'}}>Page {page} of {count}</Text>
            </View>

          <TouchableOpacity disabled={page == count} onPress={() => loadMoreHandle('next')} 
          style={{...styles.paginateBtn, backgroundColor:page == count?colors.border:colors.primary}}>
            <Text style={{color:page == count?"gray":'white', fontWeight:'bold'}}>Next</Text>
          </TouchableOpacity>
        </View>
      }

      {event.eventPhotos?.length == 0 &&
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
             <Text>No event photos</Text>
        </View>
         }
      </View>
      
      {event?.eventPhotos?.length>0 &&
      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={() => shareImages(selectedImages)} style={styles.link}>
          <Image source={ShareFixImg} style={{ ...styles.icon }} />
          <Text style={styles.linkText}> Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => downloadZipHandle()} style={[styles.link, { backgroundColor: colors.primary }]}>
          <Image source={DownloadFixImg} style={styles.icon} />
          <Text style={[styles.linkText, { color: colors.secondary }]}> Download</Text>
        </TouchableOpacity>
      </View>
      }
  

      {(loader || downloadProcess) && <LoaderScreen  backgroundColor="rgba(255, 255, 255, 0.8)" screen="ImageListScreen" message={message} message2={message2}  />}
      {modalOpen && <ModalMessage message={downloadPath} closeModal={() => setModalOpen(false)} />}
    </SafeAreaView>
  );
};


// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleSection: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection:'row'
  },
  imagesSection: {
    flex: 1,
    paddingBottom:'40%',
    paddingHorizontal:10
  },
  imageCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    
  },
  imageTouchable: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: 220,
  },
  
  fullImage: {
    width: width,
    height: height,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
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
  linkText: {
    fontSize: 16,
    color: colors.primary,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  checkboxContainer:{
    width:20, 
    height:20,
    borderWidth:2,
    position:'absolute',
    right:10,
    top:10,
    borderColor:colors.primary,
    borderRadius:5,
    backgroundColor:colors.primary
  },
  checkbox:{

  },
  checkmark:{
    color:'white',
    fontSize:16,
    marginTop:-3,
    marginLeft:3
  },

  pagination:{
    width:'100%', 
    position:'absolute', 
    bottom:'18%',
    justifyContent:'center',
    alignSelf:'center',
    flexDirection:'row'
  },

  paginateBtn:{
    backgroundColor:colors.primary,
    padding:6,
    borderRadius:10,
    paddingHorizontal:20,
    marginHorizontal:5,
    width:'29%',
    justifyContent:'center',
    height:40,
    alignItems:'center'
  } 
});

export default ImageListScreen;
