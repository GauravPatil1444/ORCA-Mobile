import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { DrawerActions } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import RNFS from 'react-native-fs';

const AgentSelector = () => {

  const [Agenttype, setAgenttype] = useState<string | null>()

  const navigation = useNavigation();

  const HandleNext = async () => {
    if (Agenttype != null) {
      console.log(Agenttype);
      navigation.dispatch(DrawerActions.jumpTo(Agenttype))
    }
    else {
      console.log("Select Agent type first!");
      showToast("info", "Select Agent type first!");
    }
  }

  const showToast = (type: string, message: string) => {
    Toast.show({
      type: type,
      text1: message,
      text1Style: { color: 'rgb(25,42,86)', fontSize: 18 },
      visibilityTime: 4000,
    });
  }

  // useEffect(() => {
  //   try{
  //     const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
  //     const data:any = RNFS.readFile(path, 'utf8');
  //     console.log(data.json())
  //   }
  //   catch{
  //     navigation.dispatch(DrawerActions.jumpTo('Authentication'));     
  //   }
  
  // }, [])
  

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 15 }}>

      <Text style={{ color: '#192A56', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Select Agent Type</Text>

      <TouchableOpacity style={[styles.filepicker, { backgroundColor: Agenttype == "DocumentAgent" ? 'rgba(135, 207, 235, 0.26)' : 'rgba(135, 207, 235, 0.2)', borderColor: Agenttype == "DocumentAgent" ? '#0073FF' : 'rgba(135, 207, 235, 0.2)' }]} onPress={() => { setAgenttype("DocumentAgent") }}>

        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Document Agent</Text>

        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>

          <Text>Supported type :</Text>
          <View style={[{ backgroundColor: 'rgba(255, 69, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(255, 0, 0)' }}>pdf</Text></View>
          <View style={[{ backgroundColor: 'rgba(255, 174, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(235, 103, 2)' }}>json</Text></View>
          <View style={[{ backgroundColor: 'rgba(69, 255, 85, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(1, 107, 10)' }}>csv</Text></View>
          <View style={[{ backgroundColor: 'rgba(190, 69, 255, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(153, 1, 235)' }}>image</Text></View>

        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.filepicker, { padding: 25, height: 'auto', backgroundColor: Agenttype == "URLAgent" ? 'rgba(135, 207, 235, 0.26)' : 'rgba(135, 207, 235, 0.2)', borderColor: Agenttype == "URLAgent" ? '#0073FF' : 'rgba(135, 207, 235, 0.2)' }]} onPress={() => { setAgenttype("URLAgent") }}>

        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>URL Agent</Text>

        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 5 }}>

          <Text>Supported type :</Text>
          <View>
            <View style={[styles.filetag]}><Text style={{ fontWeight: 'bold' }}>🌐 Website - Organizational / Business</Text></View>
            <View style={[styles.filetag]}><Text style={{ fontWeight: 'bold' }}>🌐 Web Page - Article or Blog</Text></View>
          </View>

        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => { HandleNext() }}>
        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({

  filepicker: {
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '25%',
    gap: 15,
    borderWidth: 2
  },
  filetag: {
    padding: 5,
    borderRadius: 5
  },
  btn: {
    backgroundColor: 'rgba(135, 207, 235, 0.26)',
    width: '60%',
    height: 'auto',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

})

export default AgentSelector