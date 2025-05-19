import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import DashboardScreen from './homes/DashboardScreen';
import MyDashboardScreen from './homes/MyDashBoardScreen';
import SearchEventScreen from './homes/SearchEventScreen';
import colors from '../constants/color';
import {
  DownNavImg, SearchFaceImg, ProfileNavImg,
  SearchImg, SerachDarkImg, HomeDarkImg,
  DownloadDarkImg, ProfileDarkImg, HomeWhiteImg, UploadDarkImg
} from './assets';
import ProfileScreen from './homes/ProfileScreen';
import UploadPhotoScreen from './authentications/UploadPhotoScreen';
import ImageListScreen from './homes/ImageListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateProfile from './homes/UpdateProfile';
import LoaderScreen from './components/LoaderScreen';
import { useSelector } from 'react-redux'; // 👈 Redux selector

const BottomStack = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const Stack = createNativeStackNavigator();

// 🔧 Custom TabBar with badge
const CustomTabBar = ({ state, descriptors, navigation }) => {
  // const downloadCount = useSelector(state => state.download.newCount); // 👈 adjust if needed
  const badgeCount = useSelector(state=>state.event.userDownloadViewLeft)
  const icons = [
    { default: HomeWhiteImg, active: HomeDarkImg },
    { default: SearchImg, active: SerachDarkImg },
    { default: SearchFaceImg, active: UploadDarkImg },
    { default: DownNavImg, active: DownloadDarkImg },
    { default: ProfileNavImg, active: ProfileDarkImg }
  ];

  const labels = ['Home', 'Search', 'Upload', 'My Download', 'Profile'];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabWidth = isFocused ? width * 0.3 : width * 0.15;
        const iconSource = isFocused ? icons[index].active : icons[index].default;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabButton,
              {
                width: tabWidth,
                backgroundColor: isFocused ? colors.secondary : 'transparent',
              },
            ]}
          >
            <View>
              <Image source={iconSource} style={styles.iconImg} />
              {/* 👇 Badge only on My Download tab (index === 3) */}
              {index === 3 && badgeCount>0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{badgeCount}</Text>
                </View>
              )}
            </View>
            {isFocused && <Text style={styles.labelText}>{labels[index]}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigation = () => {
  return (
    <BottomStack.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <BottomStack.Screen name="DashboardScreen" component={DashboardScreen} />
      <BottomStack.Screen name="SearchEventScreen" component={SearchEventScreen} />
      <BottomStack.Screen name="UploadPhotoScreen" component={UploadPhotoScreen} />
      <BottomStack.Screen name="MyDashboardScreen" component={MyDashboardScreen} />
      <BottomStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </BottomStack.Navigator>
  );
};

const DashboardNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigation} />
      <Stack.Screen name="ImageListScreen" component={ImageListScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:10
  },
  tabButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 2,
    paddingHorizontal: 8,
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },
  labelText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DashboardNavigation;
