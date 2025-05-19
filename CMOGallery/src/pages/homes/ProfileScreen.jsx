import React, { useState, useEffect } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import colors from '../../constants/color';
import {
  CGMapImg,
  EditImg,
  uploadImg,
  DownNavImg,
  DownloadDarkImg,
  LogoImg
} from '../assets';
import Header from '../components/Header';
import ImageCard from '../components/ImageCard';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import commonStyle from '../components/Style';
import { useSelector, useDispatch } from 'react-redux';
import { getDistricts, getEvents, getUserDownload } from '../../redux/actions/EventAction';
import LoaderScreen from '../components/LoaderScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import WarningModal from '../components/WarningModal';
import ModalMessage from '../components/ModalMessage';
import Toaster from '../components/Toaster';


const { width, height } = Dimensions.get("window");


const ProfileScreen = () => {
  // const [localWarningCheck, setLocalWarningCheck] = useState(null);
  const [data, setData] = useState([])
  const [localLoader, setLocalLoader] = useState(false)
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const user = useSelector(state=>state.login.user)
  const event = useSelector(state=>state.event)
  const loader = useSelector(state=>state.event.loading)
  const userEventData = useSelector(state=>state.event.userDownloads)
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [modalOpen, setModalOpen] = useState(false)
  const [downloadPath, setDownloadPath] = useState("")
  const [copy, setCopy] = useState(false)
  const [downloadLoader, setDownloadLoader] = useState(false)
  const warningModal = useSelector(state=>state.event.downloadWarningModal)
  const isFocused = useIsFocused();
  useEffect(()=>{
    if(user.userId){
      dispatch(getUserDownload(user.userId))
    }
  },[])

  useEffect(() => {
    (async () => {
      try {
        let result = await AsyncStorage.getItem('events');
        let parsed = result ? JSON.parse(result) : [];
        setData(parsed);
      } catch (e) {
        console.log(e, 'testing');
      }
    })();
  }, [isFocused]);

  useEffect(()=>{
    dispatch(getEvents({}))
    dispatch(getDistricts({}))
  },[])

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
    setLocalLoader(false)
    setModalOpen(true)
    setDownloadPath(path)
    }
  }

//   useEffect(() => {
//     if(warningModal){
//      setLocalWarningCheck(true)
//     }
//     else{
//      setLocalWarningCheck(false)
//     }
//  },[warningModal])

  const renderItem = ({ item, index }) => {
    if(data.includes(item?._id)){
    const customHeight = index % 2 === 0 ? 200 : 250;
    return (
      <View style={{width:'100%',  justifyContent:"space-around", alignItems:'center'}}>
        <ImageCard item={item}
        setCopy={() => {
          setCopy(true)
          setTimeout(() => {
            setCopy(false)
          }, 3000);
        }}
         customHeight={customHeight} downloadProcess={(key, path = "") => downloadProcess(key, path)} />
      </View>
    )
    }
  };


 const result = data.map(id => event?.eventsList.find(item => item._id === id));
  return (
    <SafeAreaView style={styles.container}>
      <Header onLogout={() => {
        setLocalLoader(true)
      }} screen="Profile" />

      <View style={{flex:1, justifyContent:'space-between'}}>
          <MasonryList
          data={result}
          keyExtractor={(item) => item?._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          style={{ padding: 10}}
          ListHeaderComponent={
            <>
            {/* 👤 Profile Section */}
            <View style={styles.profileSection}>
              <ImageBackground source={CGMapImg} style={styles.map}>
                <View style={styles.profile}>
                  {user?.signInWith == 'google' ?
                  <Image
                    style={styles.profileImg}
                    source={{
                      uri: user?.user.photo,
                    }}
                  />
                    :
                  <Image
                    style={styles.profileImg}
                    source={LogoImg}
                  />

                }
                  <Text style={styles.profileName}>{user?.user?.name}</Text>
                </View>

                <View style={styles.porfileBottomSection}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("MyDashboardScreen")}
                    style={styles.profileColumn}
                  >
                    <Image source={DownNavImg} style={styles.iconImg} />
                    <Text style={styles.iconText}>My Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>navigation.navigate('UpdateProfile')} style={styles.profileColumn}>
                    <Image source={EditImg} style={styles.iconImg} />
                    <Text style={styles.iconText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.boxContainer}>
              <View style={[styles.box, { backgroundColor: colors.primaryBox }]}>
                <View style={styles.boxContent}>
                <Image source={DownloadDarkImg} style={styles.boxIcon} />
                  <Text style={styles.boxValue}>{userEventData?.downloads}</Text>
                  <Text style={styles.boxLabel}>Total Download</Text>
                </View>
              </View>
              <View style={[styles.box, { backgroundColor: colors.secondaryBox }]}>
                <View style={styles.boxContent}>
                  <Image source={DownloadDarkImg} style={styles.boxIcon} />
                  <Text style={styles.boxValue}>{userEventData?.photos}</Text>
                  <Text style={styles.boxLabel}>Total Image</Text>
                </View>
              </View>
            </View>

            {/* 🕵️ Recent View Heading */}
            <View style={styles.heading}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "bold" }}>
                Recent View
              </Text>
            </View>
          </> 
          }
        />
  </View>

      {
        data?.length == 0 &&
        <View style={{...commonStyle.notAvailableText, position:'absolute',
         bottom:10}}>
          <Text>Recent view not available</Text>
        </View>
      }

      {(loader || localLoader || downloadLoader) && <LoaderScreen backgroundColor="rgba(255, 255, 255, 0.8)" message2={message2} message={message} /> }
      {modalOpen && <ModalMessage message={downloadPath} closeModal={() => setModalOpen(false)} /> }
      {copy && <Toaster type={'success'} message={'Copied'} />}
       {/* {localWarningCheck &&<WarningModal /> } */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  profileSection: {
    backgroundColor: colors.primary,
    width: width,
    height: width / 1.1,
    justifyContent: "center",
  },
  map: {
    height: width / 1.3,
    width: width / 2,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    width: width,
    alignItems: "center",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -width / 6,
    marginBottom: 10,
  },
  profileName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
  },
  box: {
    width: width / 2.34,
    height: width / 2.35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  boxContent: {
    width: '100%',
    alignItems: 'center',
  },
  boxIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginBottom: 8,
  },
  boxValue: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical:10
  },
  boxLabel: {
    fontSize: 15,
    color:colors.primary
  },
  imagesSection: {
    flexDirection: "row",
    // paddingHorizontal: '2%',
    flexWrap:'wrap',
    justifyContent:'space-around',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width,
    height,
  },
  porfileBottomSection:{
    position:'absolute',
    bottom:'8%',
    justifyContent:'space-between',
    width:width,
    flexDirection:'row',
  },
  iconImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 6,
  },
  iconText:{
    fontSize:14,
    color:'white',
    marginTop:10
  },
  profileColumn:{
    width:'50%',
    alignItems:'center'
  },
  heading:{
    paddingHorizontal:15,
  },
});

export default ProfileScreen;
