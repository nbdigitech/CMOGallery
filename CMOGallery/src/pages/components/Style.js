import { StyleSheet } from "react-native";
import colors from "../../constants/color";
import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window')
const commonStyle = StyleSheet.create({
    textInput:{
        backgroundColor:"white",
        width:"90%",
        height:50,
        borderRadius:40,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderColor:"#e6e6e6",
        paddingLeft:20,
        color:'black'
    },
    section:{
        width:"100%",
        alignItems:"center",
        paddingVertical:10,
        flexDirection:'row'
      },
      googleBtn:{
        backgroundColor:"white",
        width:"90%",
        height:50,
        borderRadius:40,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderColor:colors.border,
        flexDirection:'row'
    },
    submitBtn:{
        backgroundColor:colors.primary,
        width:"90%",
        height:50,
        borderRadius:40,
        justifyContent:"center",
        alignItems:"center",
        marginTop:10
    },
    contentBox:{
        backgroundColor:"white",
        paddingHorizontal:10,
        paddingVertical:50,
        width:"100%",
        borderRadius:20,
        alignItems:"center"
    },
    section:{
        width:"100%",
        alignItems:"center",
        paddingVertical:10,
    },
    dividerContainer:{
        width:"100%",
        alignItems:"center",
        flexDirection:"row",
        paddingVertical:20,
        paddingLeft:'5%',
        paddingRight:'5%',
    },
    hr:{
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
        marginHorizontal:5
    },
    centerText:{
        paddingHorizontal:10,
    },
    questionText:{
        color:"gray",
        fontSize:12
    },
    policySection:{
        position:"absolute",
        bottom:20,
        flexDirection:"row"
    },
    linkText:{
        fontSize:12
    },
    errorMessage:{
        color:'red',
        alignSelf:'flex-start',
        paddingLeft:25
    },
    directoryContent: {
        flexDirection: "row",
        position: "absolute",
        paddingBottom: 10,
        bottom: -1,
        width: "100%",
        paddingHorizontal: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottomLeftRadius:15,
        borderBottomEndRadius:15
      },
      imageCountText: {
        color: "white",
        fontSize: 18,
      },

      photosText: {
        color: "white",
      },

    title:{
        fontSize:16,
        color:colors.primary,
        fontWeight:'500'
    },
    linksSection:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:width/3,
        marginTop:10
      },
      linkIMg:{
        width:30,
        height:30
      },
      notAvailableText:{
        width:'100%', 
        alignItems:'center',
        flex:1,
        // position:'absolute',
        // bottom:10
      }
})
export default commonStyle