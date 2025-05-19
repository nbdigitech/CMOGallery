import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, 
  Dimensions, Text, View, 
  SafeAreaView, TextInput, FlatList,
  TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import colors from '../../constants/color';
import Header from '../components/Header';
import commonStyle from '../components/Style';
import { FilterImg, ViewMoreImg } from '../assets';
const { width, height } = Dimensions.get("window");
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, searchEvent } from '../../redux/actions/EventAction';
import { openFilter } from '../../redux/reducers/filterReducer';


const ListCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
              <View style={styles.left}>
                  <ImageBackground 
                  imageStyle={{ borderRadius: 15 }} 
                  style={styles.eventImg}
                  source={{uri:item?.cover}} >
                    <View style={{...commonStyle.directoryContent}}>
                      <View>
                      <Text style={{...commonStyle.imageCountText, fontSize:14}}>{item?.photo_count}</Text>
                      <Text style={{...commonStyle.photosText, fontSize:12}}>photos</Text>
                      </View>
                    </View>
                    </ImageBackground>
              </View>
              <View style={styles.right}>
                <Text style={commonStyle.title}>
                {item?.name?.length > 15 ? item?.name?.substring(0, 15) + '...' : item?.name}
                </Text>

                <View style={{paddingVertical:15}}>
                  <Text style={styles.date}>{item?.date}</Text>
                </View>

                <TouchableOpacity onPress={()=>navigation.navigate('ImageListScreen', { id: item?._id, title:item?.name })} style={{flexDirection:'row'}}>
                  <Text style={styles.viewMore}>View More </Text>
                  {/* <Image source={ViewMoreImg} style={{width:25, height:15, marginTop:2}} /> */}
                </TouchableOpacity>
              </View>
      </View>
  )
}



const SearchEventScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getEvents({}))
  },[])

  const event = useSelector(state=>state.event)

  const renderItem = ({item, index}) => {
    return (
    <ListCard item={item} />
    );
  };

  const searchEventHandle = () => {
    dispatch(searchEvent(text))
  }

  const handleSearch = (text) => {
    setText(text)

    const filtered = event.eventsList?.filter(item =>
      item?.name.toLowerCase()?.includes(text.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const filterHandle = () => {
    dispatch(openFilter())
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header screen='Search' />
        <View style={commonStyle.section}>
        <View style={styles.headerSection}>
          <TextInput 
          value={text}
          onChangeText={(text)=>handleSearch(text)}
          placeholder='Search' 
          placeholderTextColor="black" style={commonStyle.textInput} />
         
         <TouchableOpacity style={{ width:40, justifyContent:'center', paddingTop:10, paddingLeft:10}} onPress={filterHandle}>
                  <Image source={FilterImg} style={styles.notificationImg} />
          </TouchableOpacity>
         </View>
          
          {text.length > 0 && (
          <View style={styles.suggestionBox}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                onPress={()=>{
                  setText("")
                  navigation.navigate('ImageListScreen', { id: item?._id, title:item?.name })}
                }>
                  <Text style={styles.suggestion}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        </View>
        <FlatList
        data={event?.eventsList}
        renderItem={renderItem}
        keyExtractor={item => item?._id}
          />
        {
        event?.eventsList?.length == 0 &&
        <View style={commonStyle.notAvailableText}>
          <Text>No result found</Text>
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
  },
  card:{
    flexDirection:"row",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal:15,
    borderWidth:1,
    borderColor:colors.border,
    width:'91%',
    marginVertical:5
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
    padding:10,
    justifyContent:'center'
  },
  date:{
    fontSize:12
  },
  viewMore:{
    color:'gray',
    fontSize:14,
    fontWeight:'bold'
  },
  suggestionBox: {
    width:width/1.2,
    position: 'absolute',
    top: 45,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 10,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  suggestion: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  notificationImg:{
    width:25,
    height:25,
    right:0,
    top:-8
    },
    headerSection:{
      width:'100%', 
      paddingHorizontal:'6%', 
      flexDirection:'row', 
      justifyContent:'space-between'
    }
});

export default SearchEventScreen;
