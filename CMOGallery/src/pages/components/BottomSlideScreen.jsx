import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput,
  Dimensions, ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList,
  Platform} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import {closeFilter} from '../../redux/reducers/filterReducer';
import colors from '../../constants/color';
import commonStyle from './Style';
import { getDistricts, getEvents, searchEventByDistrict } from '../../redux/actions/EventAction';
import {  RefreshImg } from '../assets';


const { height, width } = Dimensions.get('window')
export default function BottomSlideScreen(props) {
  const refRBSheet = useRef();
  const [isChecked, setChecked] = useState('');
  const isOpen = useSelector((state) => state.filter.isOpen);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isOpen) {
      refRBSheet.current?.open();
    } else {
      refRBSheet.current?.close(); 
    }
  }, [isOpen]);

  const handleClose = () => {
    dispatch(closeFilter())
  }

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   const day = String(currentDate.getDate()).padStart(2, '0');
  //   const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  //   const year = currentDate.getFullYear();
  //   const updatedDate = `${day}/${month}/${year}`;
  //   if (event.type === "set") { // user selected something
  //       const currentDate = selectedDate || date;
  //       setDate(currentDate);
  //       setVisibleDate(updatedDate)
  //     }
  //   //  setDateShow(false); 
  // };

  const submitHandle = async() => {
  dispatch(closeFilter())
   setTimeout(async() => {
    await dispatch(searchEventByDistrict(isChecked))
   }, 0);
  }

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => setChecked(item.name)} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isChecked == item.name && styles.checkedBox]}>
            
          </View>
            <Text style={styles.label}>{item?.name}</Text>
        </TouchableOpacity>
    )
  }

  const districts = useSelector(state=>state.event?.districts)
  return (
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
            height:height/1.4,
            borderTopEndRadius:30,
            borderTopLeftRadius:30
          }
        }}

        onClose={() => {
          handleClose();
        }}
      >
        <View style={styles.sheetContent}>
          <View style={styles.topHR}></View>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.eventText}>Districts</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={()=>{
                dispatch(getEvents({}))
                dispatch(getDistricts({}))
                dispatch(closeFilter())
                setChecked('')
                }} style={styles.clearAll}>
              <Image source={RefreshImg} style={{width:20, height:20}} />
                <Text>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{width:'100%', alignItems:'flex-start'}}>
          <View style={styles.list}>
          <FlatList
          data={districts}
          renderItem={renderItem}
          keyExtractor={(item, index)=> index}
          />

          </View>

          <View style={{...styles.header, ...styles.date}}>
          <TouchableOpacity
                  onPress={()=>submitHandle()}
                  disabled={isChecked==""}
                  style={[commonStyle.submitBtn, {backgroundColor: isChecked=="" ? colors.border : colors.primary}]}>
                <Text style={[styles.btnText, {color: isChecked=="" ? 'gray' : colors.secondary}]}>Proceed</Text>
                </TouchableOpacity>
          </View>
          {/* {Platform.OS == 'android' ?
            <View style={styles.dateSection}>
              <TouchableOpacity style={{...commonStyle.textInput, alignItems:'flex-start'}}>
                <Text>DD / MM / YYYY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{...commonStyle.textInput, alignItems:'flex-start', marginTop:10}}>
                <Text>DD / MM / YYYY</Text>
              </TouchableOpacity>
            </View>
          :
          <View>
            <View>
              <DateTimePicker
                value={date}
                mode="date" 
                display="compact"
                onChange={onChange}
                />
            </View>

            <View style={{marginTop:10}}>
              <DateTimePicker
                value={date}
                mode="date" 
                display="compact"
                onChange={onChange}
                />
            </View>
              
          </View>
          } */}
          </View>
        </View>

        
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal:20
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
    justifyContent:'space-between',
    marginBottom:10,
    justifyContent:'center'
  },
  headerLeft:{
    width:'50%',

  },
  headerRight:{
    width:'50%',
    alignItems:'flex-end',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:colors.border,
    paddingHorizontal:25,
    paddingVertical:5,
    borderRadius:20,
    marginTop:10,
    marginHorizontal:5
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 10,
    borderRadius:15
  },
  checkedBox: {
   backgroundColor:colors.secondary
  },
  checkmark: {
    color: '#00000',
    fontSize: 18,
    fontWeight: 'bold',
    position:'absolute',
    marginTop:-3,
    marginLeft:-1
  },
  label:{
    fontSize:14
  },
  eventText:{
    fontSize:16, 
    color:'#00000',
    fontWeight:'bold'
  },
  clearAll:{
    backgroundColor:colors.border,
    borderRadius:20,
    paddingHorizontal:20,
    paddingVertical:5,
    flexDirection:'row'
  },
  list:{
    flexDirection:'row',
    flexWrap:'wrap'
  },

  date:{
    marginTop:20, 
    borderTopWidth:1, 
    width:'100%', 
    borderColor:colors.border, 
    paddingTop:20
  },
  dateSection:{
    width:'100%'
  }
});
