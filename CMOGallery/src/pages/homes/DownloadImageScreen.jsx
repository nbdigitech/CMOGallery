import {Image, Modal, StyleSheet, Dimensions, Text, View, ImageBackground, TouchableOpacity, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../constants/color'
import { CGMapImg, BackWImg, EditImg, DownloadDarkImg, uploadImg } from '../assets'
import MasonryList from '@react-native-seoul/masonry-list';
import { useState } from 'react';
const {width, height} = Dimensions.get("window")
const DownloadImageScreen = () => {
    
    const data = [
        {id:1,uri:"https://indiacsr.in/wp-content/uploads/2024/01/Vishnu-Deo-Sai-Chief-Minister-of-Chhattisgarh-_IndiaCSR.jpg", height:200},
        {id:2,uri:"https://i.pinimg.com/736x/7a/ad/c0/7aadc010cc350e426694132f5c4f5157.jpg", height:250},
        {id:3,uri:"https://i.pinimg.com/736x/0a/cf/a0/0acfa0865c9b7315d4d2f2eb50615422.jpg", height:266},
        {id:4,uri:"https://i.pinimg.com/736x/18/b7/e1/18b7e17b779525b3f0c629800f3f623d.jpg", height:300},
        {id:5,uri:"https://i.pinimg.com/474x/6e/61/c6/6e61c6d50ef83f7be2150e2a7508d411.jpg", height:200},
        {id:6,uri:"https://i.pinimg.com/474x/6e/61/c6/6e61c6d50ef83f7be2150e2a7508d411.jpg", height:250}
    ]

    const [image, setImage] = useState(null);
    return (
        <SafeAreaView  style={styles.container}>
            <View style={styles.header}>
                    <View style={{...styles.headerColum}}>
                    <TouchableOpacity>
                        <Image style={styles.headerIcon} source={BackWImg} />
                    </TouchableOpacity>
                    </View>
                    <View style={{...styles.headerColum, alignItems:"center"}}>
                    <TouchableOpacity>
                        <Text style={styles.headerText}>Profile</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={{...styles.headerColum, alignItems:"flex-end"}}>
                    <TouchableOpacity>
                    <Image style={styles.headerIcon} source={EditImg} />
                    </TouchableOpacity>
                    </View>
                </View>
            <ScrollView>
            <View style={styles.profileSection}>
                <ImageBackground style={styles.map} source={CGMapImg} >
                    <View style={styles.profile}>
                    <Image 
                    style={styles.profileImg}
                    source={{uri:"https://grandnews.in/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-29-at-6.48.35-PM-e1709213548759.jpeg"}}></Image>
                    <Text style={styles.profileName}>विष्णुदेव साय</Text>
                    </View>

                    <View style={styles.menuSection}>

                    </View>
                </ImageBackground>
            </View>

            <View style={styles.boxContainer}>
                <View style={{...styles.box, backgroundColor:colors.primaryBox}}>
                        <View>
                        <Image
                            source={uploadImg}
                            style={{ width: 30, height: 30, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                        <Text>872</Text>
                        <Text>Total Image</Text>
                    </View>
                </View>
                <View style={{...styles.box, backgroundColor:colors.secondaryBox}}>
                            <Image
                            source={uploadImg}
                            style={{ width: 30, height: 30, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                    <Text>872</Text>
                    <Text>Total Image</Text>
                </View>
            </View>

            <View style={styles.imagesSection}>            
                <MasonryList
                data={data}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                <View style={{ margin: 5 }}>
                <TouchableOpacity onPress={()=>setImage(item.uri)}>
                <Image
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: item.height, borderRadius: 10 }}
                    resizeMode="cover"
                />
                </TouchableOpacity>
                </View>
                )}
                />
            </View>
            </ScrollView>

            <Modal
                visible={image!=null}
                onRequestClose={() => setImage(null)}
            >
                <TouchableOpacity style={styles.modalContainer} onPress={() => setImage(null)}>
                <Image
                    source={{ uri: image }}
                    style={styles.fullImage}
                    resizeMode="contain"
                />
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    profileSection:{
        backgroundColor:colors.primary,
        width:width,
        height:width/1.1,
        justifyContent:"center"
    },
    header:{
        top:0,
        padding:15,
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:colors.primary
    },
    map:{
        height:width/1.3,
        width:width/2,
        alignSelf:"center",
        justifyContent:"center",
        alignItems:"center"
    },
    profile:{
        width:width,
        alignItems:"center"
    },
    profileImg:{
        width:100,
        height:100,
        borderRadius:50,
        marginTop:-width/6,
        marginBottom:10,
    },
    headerIcon:{
        width:25,
        height:25
    },
    headerColum:{
        width:"33%",
    },
    headerText:{
        color:"white",
        fontWeight:"bold",
        fontSize:16
    },
    profileName:{
        color:"white",
        fontWeight:"bold",
        fontSize:16,
    },
    boxContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:20,
        alignItems:"center",
        paddingVertical:20
    },
    box:{
        width:width/2.34,
        height:width/2.35,
        backgroundColor:"orange",
        borderRadius:20,
        justifyContent:"center",
        alignItems:"center"
    },
    imagesSection:{
        flexDirection:"row",
        paddingHorizontal:20
    },
    recentImagesSection:{
        width:width/3,
    },
    recentImage:{
        width:"100%",
        height:100,
        borderRadius:20
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
})
export default DownloadImageScreen