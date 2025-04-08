import { View, Dimensions, StatusBar, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';

const SplashScreen = () => {

    const [firstAnimation, setfirstAnimation] = useState(false);
    const [secondAnimation, setsecondAnimation] = useState(false);
    const [visited, setvisited] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        startup();
    }, [])
    

    const startup = () => {
        setfirstAnimation(true);
        setTimeout(() => {
            setsecondAnimation(true);
        }, 3000);
        setTimeout(async()=>{
            try{
                const path = RNFS.DocumentDirectoryPath + '/Agents.txt';
                const data = await RNFS.readFile(path,'utf8');
                const Agents = await JSON.parse(data);
                if(Agents.length==0){
                    setvisited(true);
                    navigation.dispatch(DrawerActions.jumpTo('AgentSelector'));
                }
                else{
                    setvisited(true);
                    navigation.dispatch(DrawerActions.jumpTo('ChatScreen',{"Agent":Agents[0]["Agent"],"prompt":Agents[0]["prompt"]}));
                }
            }
            catch{
                setvisited(true);
                navigation.dispatch(DrawerActions.jumpTo('AgentSelector'));
            }
        },5000)
    }

    useFocusEffect(
        useCallback(() => {
          StatusBar.setBackgroundColor('#FFFFFF');
          StatusBar.setBarStyle('light-content');
          
        }, [])
    );

    return (
        <View style={styles.container}>
            <LottieView style={styles.splash} source={require('../assets/orca.json')} autoPlay={firstAnimation} loop={false} onAnimationFinish={() => { setfirstAnimation(false) }} />
            <LottieView style={{ position: 'absolute', width: '40%', height: '40%' }} source={require('../assets/text.json')} autoPlay={secondAnimation} loop={false} onAnimationFinish={() => { setsecondAnimation(false) }} />
            {visited&&<TouchableOpacity style={{position:'absolute',top:'60%', backgroundColor: 'rgba(135, 207, 235, 0.26)', width: '30%', padding: 10, alignItems: 'center', borderRadius: 8 }}>
                <Text style={{ color: '#192A56', fontSize: 16, fontWeight: 'bold' }}>Restart</Text>
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    splash: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});

export default SplashScreen