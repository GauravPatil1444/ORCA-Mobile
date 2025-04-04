import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

const ModelSelector = () => {

  const [Modeltype, setModeltype] = useState<string|null>()

  const HandleNext = async()=>{
    if(Modeltype!=null){
      console.log(Modeltype);
    }
    else{
      console.log("Select Model type first!");
    }
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 15 }}>

      <Text style={{ color: '#192A56', fontSize: 20, fontWeight: 'bold', marginTop:10 }}>Select Model Type</Text>        

      <TouchableOpacity style={[styles.filepicker,{backgroundColor:Modeltype=="Document"?'rgba(135, 207, 235, 0.26)':'rgba(135, 207, 235, 0.2)',borderColor:Modeltype=="Document"?'#0073FF':'rgba(135, 207, 235, 0.2)'}]} onPress={()=>{setModeltype("Document")}}>

        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Document Model</Text>        

        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>

          <Text>Supported type :</Text>
          <View style={[{ backgroundColor: 'rgba(255, 69, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(255, 0, 0)' }}>pdf</Text></View>
          <View style={[{ backgroundColor: 'rgba(255, 174, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(235, 103, 2)' }}>json</Text></View>
          <View style={[{ backgroundColor: 'rgba(69, 255, 85, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(1, 107, 10)' }}>csv</Text></View>
          <View style={[{ backgroundColor: 'rgba(190, 69, 255, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(153, 1, 235)' }}>image</Text></View>

        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.filepicker,{padding:25,height:'auto',backgroundColor:Modeltype=="URL"?'rgba(135, 207, 235, 0.26)':'rgba(135, 207, 235, 0.2)',borderColor:Modeltype=="URL"?'#0073FF':'rgba(135, 207, 235, 0.2)'}]} onPress={()=>{setModeltype("URL")}}>

        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>URL Model</Text>        

        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 5 }}>

          <Text>Supported type :</Text>
          <View>
            <View style={[styles.filetag]}><Text style={{fontWeight:'bold'}}>🌐 Website - Organizational / Business</Text></View>
            <View style={[styles.filetag]}><Text style={{fontWeight:'bold'}}>🌐 Web Page - Article or Blog</Text></View>
            <View style={[styles.filetag]}><Text style={{fontWeight:'bold'}}>🌐 pdf URL - Online pdf</Text></View>
          </View>

        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={()=>{HandleNext()}}>
        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Next</Text>  
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({

  filepicker:{
    marginTop:5,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'90%',
    height:'25%',
    gap:15,
    borderWidth:2
  },
  filetag:{
    padding:5,
    borderRadius:5
  },
  btn:{
    backgroundColor:'rgba(135, 207, 235, 0.26)',
    width:'60%',
    height:'auto',
    padding:10, 
    alignItems:'center', 
    justifyContent:'center',
    borderRadius:8,
  },

})

export default ModelSelector