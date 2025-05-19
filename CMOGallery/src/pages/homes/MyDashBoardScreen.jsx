import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, 
  Dimensions, Text, View, 
  SafeAreaView, FlatList,
  TouchableOpacity, ImageBackground } from 'react-native';
import colors from '../../constants/color';
import Header from '../components/Header';
import commonStyle from '../components/Style';
import { DownloadImg } from '../assets';
import { useDispatch, useSelector } from 'react-redux';
import { getPhotos, getUserDownloadHistory, recordDownloadHistory } from '../../redux/actions/EventAction';
import { useIsFocused } from '@react-navigation/native';
import { removeBadge } from '../../redux/reducers/EventReducer';
import { downloadAndZipImages } from '../../utils/zipCreate';
import LoaderScreen from '../components/LoaderScreen';
import ModalMessage from '../components/ModalMessage';
const { width, height } = Dimensions.get("window");

const MyDashboardScreen = () => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState("Downloads list is loading...")
  const [message2, setMessage2] = useState("Please wait...");
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadPath, setDownloadPath] = useState("")
  const user = useSelector(state=>state.login.user)
  const loader = useSelector(state=>state.event.loading)
  const userDownloadHistory = useSelector(state=>state.event.userDownloadHistory)
 
  const isFocused = useIsFocused();
  useEffect(()=>{
    dispatch(getUserDownloadHistory(user.userId))

    if (isFocused) {
      dispatch(removeBadge())
    }
  },[isFocused])

  const downloadZipHandle = async(item) => {
    setDownloadLoader(true)
    setMessage("Your image is download")
    if(item?.photoUrls?.length>0){
    let getFilePath = await downloadAndZipImages(item?.photoUrls)
    
     setDownloadPath(getFilePath)
    }
    setModalOpen(true)
    setMessage("Download list is loading")
    setDownloadLoader(false)
  }



  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
                <View style={styles.left}>
                    <ImageBackground 
                    imageStyle={{ borderRadius: 15 }} 
                    style={styles.eventImg}
                    source={{uri:item?.image}} >
                      <View style={{...commonStyle.directoryContent}}>
                        <View>
                        <Text style={{...commonStyle.imageCountText, fontSize:14}}>{item.photoCount}</Text>
                        <Text style={{...commonStyle.photosText, fontSize:12}}>photos</Text>
                        </View>
                      </View>
                      </ImageBackground>
                </View>
                <View style={styles.right}>
                  <Text style={commonStyle.title}>
                  {item?.title?.length > 15 ? item?.title?.substring(0, 15) + '...' : item?.title}
                  </Text>

                  <View style={{paddingVertical:10}}>
                    <Text style={styles.date}>{item?.date}</Text>
                  </View>

                  <TouchableOpacity 
                  onPress={() => downloadZipHandle(item)}
                  style={{flexDirection:'row', borderWidth:1, width:'70%', borderColor:colors.border, borderRadius:5, padding:5, justifyContent:'center'}}>
                    <Text style={styles.viewMore}> Download </Text>
                    {/* <Image source={DownloadImg} style={{width:25, height:25}} /> */}
                  </TouchableOpacity>
                </View>
            </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header screen='My Downloads' />
        <View style={{...commonStyle.section}}>
            <FlatList
            data={userDownloadHistory}
            renderItem={renderItem}
            keyExtractor={(item, index)=>index}
            style={{paddingBottom:20}} 
            />
            
        </View>
        {userDownloadHistory.length == 0 &&
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
             <Text>No download history</Text>
        </View>
         }

     {(loader || downloadLoader) && <LoaderScreen backgroundColor="rgba(255, 255, 255, 0.8)" message={message} message2={message2} />}
     {modalOpen && <ModalMessage message={downloadPath} closeModal={() => setModalOpen(false)} /> }
   

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    width:'100%',
    paddingBottom:50
  },
  card:{
    flexDirection:"row",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth:1,
    borderColor:colors.border,
    width:width/1.1,
    marginTop:10
  },
  eventImg:{
    width:width/3.4,
    height:width/3.4,
  },
  left:{
    width:'35%',
  },
  right:{
    width:'65%',
    padding:10
  },
  date:{
    fontSize:12
  },
  viewMore:{
    color:'gray',
    fontSize:12,
    marginTop:4,
    height:20
  }
});

export default MyDashboardScreen;
