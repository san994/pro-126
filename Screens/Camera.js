import React from 'react';
import {View,Button,Platform} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class Camera extends React.Component{
    constructor(){
        super()
        this.state={
            image:null
        }
    }

    componentDidMount=()=>{
        this.get_permission()
    }

    //permissions
    get_permission=async()=>{
        if(Platform.OS !== 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== 'granted'){
                alert('sorry e need permission to use the camera roll')
            }
        }  
    }

    //picking image
    PickImage=async()=>{
      try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })

        if(!result.cancelled){
          this.setState({image:result.data})
          this.uploadImage(result.uri)
        }

      }catch(err){
          console.log(err)
      }
    }

    //uploading image
    uploadImage=async(uri)=>{
        const data = FormData()
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = ` image/${uri.split('.')[uri.split('.').length-1]}`

        const filetoupload={
            uri:uri,
            filename:filename,
            type:type
        }

        data.append('alphabet',filetoupload)

        fetch("https://5992-103-139-88-130.ngrok.io/predict-alphabet",{
            method:'POST',
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((responce)=>responce.json())
        .then((result)=>{
            console.log('success',result)
        })
        .catch((error)=>{
            console.log("error",error)
        })
    }

    render(){
        return(
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Button
            title="pick an image from camera roll"
            onPress={()=>this.PickImage()}
            />
            </View>
        )
    }
}