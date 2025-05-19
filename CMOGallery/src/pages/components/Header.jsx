import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native'
import { LogoImg, NotImg, FilterImg, BackArrowImg, BackWImg, EditImg, LogoutImg  } from '../assets';
import { useNavigation } from '@react-navigation/native';
import {  useDispatch } from 'react-redux';
import colors from '../../constants/color';
import { openFilter } from '../../redux/reducers/filterReducer';
import * as Keychain from 'react-native-keychain';
import { getDistricts, getEvents } from '../../redux/actions/EventAction';
import { logoutUser } from '../../redux/actions/loginAction';
const Header = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    

    const handleLogout = async () => {
      try {
        props.onLogout()
        await Keychain.resetGenericPassword();
        dispatch(logoutUser(false))
      } catch (error) {
        console.log('Error resetting credentials', error);
      }
    };

    const getEventHandle = ()  => {
      dispatch(getEvents({}))
      dispatch(getDistricts({}))
    }

    return (
    <View style={[styles.header, { backgroundColor: props.screen === 'Profile' ? colors.primary : 'white' }]}>
      <View style={{...styles.headerColumn, flexDirection:"row", width:"100%"}}>
      {props.screen=='DashboardScreen' ?
        <TouchableOpacity onPress={() => getEventHandle()} style={{flexDirection:"row",  width:"50%"}}>
          <Image source={LogoImg} style={styles.logo} />
          <Text style={styles.dashboardText}> Dashboard</Text>
        </TouchableOpacity>
        :
        <View  style={{flexDirection:"row",  width:"100%"}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={props.screen === 'Profile'?BackWImg:BackArrowImg} style={styles.backImg} />
          </TouchableOpacity>
          <Text  style={[styles.searchText, { color: props.screen === 'Profile' ? 'white' : colors.primary }]}>{props.screen}</Text>
        </View>
      }
        {/* {props.screen=='DashboardScreen' &&
        <View style={{width:"50%", alignItems:"flex-end", justifyContent:"center"}}>
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={filterHandle}>
            <Image source={FilterImg} style={styles.notificationImg} />
          </TouchableOpacity>
          <Image source={NotImg} style={styles.notificationImg} />
          </View>
        </View>
        } */}

      {props.screen=='Profile' &&
        <View style={styles.rightSection}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={handleLogout}>
          <Text style={{color:'white', fontWeight:'bold'}}> Logout </Text>
            <Image source={LogoutImg} style={styles.EditImg} />
            
          </TouchableOpacity>
        </View>
        }
      </View>
    </View>
  );
    }

  const styles = StyleSheet.create({
    header: {
    top: 0,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    },
    dashboardText:{
    fontWeight:"bold",
    fontSize:20,
    marginTop:4
    },
    searchText:{
    fontWeight:"bold",
    fontSize:20,
    marginLeft:10,
    marginTop:-1
    },
    headerColumn: {
    width: "33%",
    },
    logo:{
    width:35,
    height:35
    },
    notificationImg:{
    width:20,
    height:20,
    marginLeft:10
    },

    headerIcon: {
    width: 25,
    height: 25,
    },
    headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    },
    backImg:{
      width:25,
      height:25
    },
    EditImg:{
      width:25,
      height:25
    },
    rightSection:{
      width:"20%", 
      alignItems:'flex-end', 
      position:'absolute', 
      top:0, 
      right:0
    }
    })
  export default Header;