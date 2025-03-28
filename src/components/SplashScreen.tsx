import { View, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const SplashScreen = () => {

    const [firstAnimation, setfirstAnimation] = useState(false);
    const [secondAnimation, setsecondAnimation] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        startup();
    }, [])

    const startup = () => {
        setfirstAnimation(true);
        setTimeout(() => {
            setsecondAnimation(true);
        }, 3000);
        setTimeout(()=>{
            navigation.dispatch(DrawerActions.jumpTo('ChatScreen'))
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