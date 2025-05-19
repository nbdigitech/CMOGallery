import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, 
  Dimensions, Text, View, 
  SafeAreaView, FlatList,
  TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomSlideScreen from '../components/BottomSlideScreen';
import colors from '../../constants/color';
import Toaster from '../components/Toaster';
import commonStyle from '../components/Style';
import ImageCard from '../components/ImageCard';
import { useDispatch, useSelector } from 'react-redux';
import { getDistricts, getEvents } from '../../redux/actions/EventAction';
import { Banner1Img, Banner2Img, Banner3Img, FilterImg, RefreshImg } from '../assets';
import LoaderScreen from '../components/LoaderScreen';
import MasonryList from '@react-native-seoul/masonry-list';
import { openFilter } from '../../redux/reducers/filterReducer';
import ModalMessage from '../components/ModalMessage';
import WarningModal from '../components/WarningModal';

const { width, height } = Dimensions.get("window");

const images = [
  Banner1Img,
  Banner2Img,
  Banner3Img
];


const MyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, 
  };


  return (
    <View style={styles.sliderContainer}>
      {/* Image Slider */}
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <TouchableOpacity key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
        ))}
      </View>

  
    </View>
  );
};


const DashboardScreen = () => {
  const [image, setImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [message2, setMessage2] = useState("Loading event list...");
  const [downloadLoader, setDownloadLoader] = useState(false)
  const [localWarningCheck, setLocalWarningCheck] = useState(false)
  const [path, setPath] = useState("")
  const [copy, setCopy] = useState(false)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getEvents({}))
    dispatch(getDistricts({}))
  },[])

  const event = useSelector(state=>state.event)
  const loginSuccess = useSelector(state=>state.login.loginSuccess)
  const loader = useSelector(state=>state.event.loading)
  const warningModal = useSelector(state=>state.event.downloadWarningModal)
  const messageModal = useSelector(state=>state.event.messageModal)
  // const downloadPath = useSelector(state=>state.event.downloadPath)
  

  const renderItem = ({item, index}) => {
  const customHeight = index % 2 === 0 ? 200 : 250;
  return (
  <View style={{width:'100%',
    justifyContent:"space-around", alignItems:'center'}}>
    <ImageCard item={item} setCopy={() => {
      setCopy(true)
      setTimeout(() => {
        setCopy(false)
      }, 3000);
    }
      } customHeight={customHeight} 
      downloadProcess={(key, path = "") => downloadProcess(key, path)} />
  </View>
  );
};

const filterHandle = () => {
  dispatch(openFilter())
}

const downloadProcess = (key, path = "") => {
  if(key){
  setMessage("Your Image is downloading")
  setMessage2("Please Wait...")
  setDownloadLoader(true)
  }
  else{
  setMessage("")
  setMessage2("Loading event list...")
  setDownloadLoader(false)
  setModalOpen(true)
  setPath(path)
  }
}

useEffect(() => {
   if(warningModal){
    setLocalWarningCheck(true)
   }
   else{
    setLocalWarningCheck(false)
   }
},[warningModal])

  return (
    <>
   <SafeAreaView style={styles.container}>
  <Header screen='DashboardScreen' />
  <View style={{flex:1, justifyContent:'space-between'}}>
          <MasonryList
          data={event?.eventsList}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          style={{ padding: 10}}
          ListHeaderComponent={
            <>
              <View style={{ height: height / 4 }}>
                <MyCarousel />
              </View>
              <View style={styles.heading}>
                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold', width:'50%' }}>
                  Recent Events
                </Text>
                <View style={{width:"50%", alignItems:"flex-end", justifyContent:"center"}}>
                <View style={{flexDirection:"row",}}>
               
                <TouchableOpacity onPress={filterHandle}>
                  <Image source={FilterImg} style={styles.notificationImg} />
                </TouchableOpacity>
                </View>
              </View>
              </View>
            </>
          }
        />
  </View>

    {
        event?.eventsList?.length == 0 &&
        <View style={commonStyle.notAvailableText}>
          <Text>Event not available</Text>
        </View>
      }

  <Modal visible={image !== null} onRequestClose={() => setImage(null)}>
    <TouchableOpacity style={styles.modalContainer} onPress={() => setImage(null)}>
      <Image source={{ uri: image }} style={styles.fullImage} resizeMode="contain" />
    </TouchableOpacity>
  </Modal>
</SafeAreaView>
   {copy && <Toaster type={'success'} message={'Copied'} />}
   {loginSuccess && <Toaster type={'success'} message={'LoggedIn Successfully'} />}
   <BottomSlideScreen />
   {(loader || downloadLoader) && <LoaderScreen backgroundColor="rgba(255, 255, 255, 0.8)" message={message} message2={message2} />}
   {modalOpen && <ModalMessage closeModal={() => {
    setPath("")
    setModalOpen(false)
   }} message={path} /> }
   {localWarningCheck &&<WarningModal /> }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  
  imagesSection: {
    flexDirection: "row",
    // paddingHorizontal: '2%',
    flexWrap:'wrap',
    justifyContent:'space-between',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height,
  },
  imageContainer: {
    width: width,  // Full width of the device
    height: 200,   // Height for image
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Inactive dots color
  },
  activeDot: {
    backgroundColor: 'white', // Active dot color
  },
  paginationText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  heading:{
    paddingHorizontal:15,
    paddingTop:20,
    flexDirection:'row'
    },
  notificationImg:{
    width:25,
    height:25,
    marginLeft:10,
    position:'absolute',
    right:0,
    top:-8
    },

});

export default DashboardScreen;
