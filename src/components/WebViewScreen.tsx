import { View, Text } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview';
import { useEffect, useState } from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';
import { StyleSheet } from 'react-native';

type DrawerProps = DrawerScreenProps<DrawerParamList,'WebViewScreen'>;

const WebViewScreen = ({route}:DrawerProps) => {

  const [link, setlink] = useState<string|undefined>('');
  const [searchinp, setsearchinp] = useState<string|undefined>('');
  const [classes_to_remove, setclasses_to_remove] = useState<string|undefined>('');

  useEffect(() => {
    setclasses_to_remove(route.params.classes_to_remove);
    setsearchinp(route.params.searchinp);
    setlink(route.params.link);
    
  }, [route.params])

  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      <View style={{alignItems:'center',backgroundColor:'transparent'}}><Text style={styles.userText}>{searchinp}</Text></View>
      {<WebView source={{ uri: `https://orca-574216179276.asia-south1.run.app/owst?link=${link}&query=${searchinp}&classes_to_remove=${classes_to_remove} ` }} style={{ flex: 1 }} />}
    </View>
  )
}

export default WebViewScreen

const styles = StyleSheet.create({
  userText: {
    padding: 10,
    backgroundColor: 'rgba(135, 207, 235, 0.26)',
    borderRadius: 10,
    fontSize: 16,
    width:'90%',
    fontWeight:'bold'
  }
})