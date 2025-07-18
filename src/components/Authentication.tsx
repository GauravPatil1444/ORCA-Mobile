import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from '../../firebaseConfig'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
// import auth from '@react-native-firebase/auth';
// import EncryptedStorage4 from 'react-native-encrypted-storage'
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-toast-message'
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';
import LottieView from 'lottie-react-native';

type DrawerProps = DrawerScreenProps<DrawerParamList, 'Authentication'>;

const Login = ({ navigation }: DrawerProps) => {

    const [emailclick, setemailclick] = useState(false)
    const [inp1width, setinp1width] = useState(1)
    const [inp2width, setinp2width] = useState(1)
    const [inp3width, setinp3width] = useState(1)
    const [inp4width, setinp4width] = useState(1)
    const [loginmode, setloginmode] = useState(true)
    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [nameValid, setnameValid] = useState(true)
    const [passValid, setpassValid] = useState(true)
    const [show1, setshow1] = useState(true);
    const [show2, setshow2] = useState(true)
    const [loader, setloader] = useState(false)
    const RNFS = require('react-native-fs');

    const createAccount = async () => {
        setloader(true);
        if (password == confirmpassword) {
            if (password.length >= 4) {
                try {
                    const response = await createUserWithEmailAndPassword(firebase_auth, email, password)
                    const user_email = response.user.email;
                    const user_id = response.user.uid
                    // console.log(user);
                    const docRef = await addDoc(collection(db, "users", `${user_id}/UserDetails`), {
                        name: username,
                        email: user_email,
                    });
                    console.log("Document written with ID: ", docRef.id);
                    let user_preferences = {
                        "UserDetails": {
                            "name": username,
                            "email": user_email
                        },
                        "DocAgents": [],
                        "URLAgents":[]
                    }

                    const docRef1 = await addDoc(collection(db, "users", `${user_id}/UserPreferences`), user_preferences);
                    // console.log("Document written with ID: ", docRef1.id);
                    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
                    await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')

                    // const docRef2 = await addDoc(collection(db, "users", `${user_id}/topics`), topics);
                    // // console.log("Document written with ID: ", docRef2.id);
                    // const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
                    // await RNFS.writeFile(path1, JSON.stringify(topics), 'utf8')
                    RNRestart.restart();
                    // navigation.navigate('StackNavigation')
                }
                catch (error: any) {
                    const message = error.message;
                    Alert.alert(message);
                    setloader(false);
                };
            }
            else {
                // Alert.alert("Password length must be atleast 4");
                showToast("error", "Password length must be atleast 4");
                setloader(false);
            }
        }
        else {
            // Alert.alert("confirm password doesn't matched !");
            showToast("error", "confirm password doesn't matched !");
            setloader(false);
        }
    }
    const authenticate = async () => {
        setloader(true);
        try {
            const response = await signInWithEmailAndPassword(firebase_auth, email, password);
            // console.log(response);
            const user_id = response.user.uid;
            const docRef = collection(db, "users", `${user_id}/UserPreferences`);
            const docSnap = await getDocs(docRef);

            console.log(docSnap.docs[0].data());
            const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
            await RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')

            RNRestart.restart();
            // navigation.navigate('StackNavigation');
        }
        catch (e: any) {
            // Alert.alert("Invalid email or password !");
            showToast("error", "Invalid email or password !");
            setloader(false);
        }
    }

    const handleName = (text: string) => {
        if (text.length > 20) {
            // Alert.alert("Only 20 charachters allowed");
            showToast("error", "Only 20 charachters allowed");
            setnameValid(false);
        }
        else {
            setnameValid(true);
        }
    }

    const handlePassword = (text: string) => {
        if (text.length > 15) {
            // Alert.alert("Password length between 4 to 15 is allowed");
            showToast("error", "Password length below 15 is allowed");
            setpassValid(false);
        }
        else {
            setpassValid(true);
        }
    }

    const showToast = (type: string, message: string) => {
        Toast.show({
            type: type,
            text1: message,
            text1Style: { fontFamily: 'Inter_24pt-Regular', color: 'rgb(25,42,86)', fontSize: 16 },
            visibilityTime: 4000,
        });
    }


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('white');
            StatusBar.setBarStyle('dark-content');
            setloader(false);
        }, [])
    );

    return (
        <>
        <LottieView style={[{height:'30%', backgroundColor:"white"}]} source={require('../assets/text.json')} autoPlay={true} loop={false}/>
        <KeyboardAvoidingView style={styles.container}>
            {/* <Image style={[styles.Logo, inp4width == 1 ? { width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 2 } : { width: Dimensions.get('window').width / 4, height: Dimensions.get('window').width / 4 }]} source={require('../assets/bot.png')} /> */}
            {loginmode ? <Text style={styles.Logotxt}>Login</Text> :
                <Text style={styles.Logotxt}>Create account</Text>}
            <View style={styles.btnspace}>

                {!loginmode && <TextInput
                    placeholder='Enter your name'
                    placeholderTextColor={'rgba(39, 39, 39, 0.76)'}
                    cursorColor={'rgba(39, 39, 39, 0.76)'}
                    style={[styles.input, { borderWidth: inp1width }]}
                    onFocus={() => { setinp1width(2) }}
                    onEndEditing={() => { setinp1width(1) }}
                    value={username}
                    onChangeText={(text) => { setusername(text), handleName(text) }}
                />}
                <TextInput
                    placeholder='Enter email'
                    placeholderTextColor={'rgba(39, 39, 39, 0.76)'}
                    cursorColor={'rgba(39, 39, 39, 0.76)'}
                    inputMode='email'
                    style={[styles.input, { borderWidth: inp2width }]}
                    onFocus={() => { setinp2width(2) }}
                    onEndEditing={() => { setinp2width(1) }}
                    value={email}
                    onChangeText={(text) => { setemail(text) }}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput
                        placeholder='Enter password'
                        placeholderTextColor={'rgba(39, 39, 39, 0.76)'}
                        cursorColor={'rgba(39, 39, 39, 0.76)'}
                        secureTextEntry={show1}
                        style={[styles.input, { borderWidth: inp3width, marginLeft: 30 }]}
                        onFocus={() => { setinp3width(2) }}
                        onEndEditing={() => { setinp3width(1) }}
                        value={password}
                        onChangeText={(text) => { setpassword(text), handlePassword(text) }}
                    />
                    <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { setshow1(!show1) }}>
                        {show1 ? <Image style={styles.Img} source={require('../assets/show.png')} tintColor={'#0073FF'} /> : <Image style={styles.Img} source={require('../assets/hide.png')} tintColor={'#0073FF'}/>}
                    </TouchableOpacity>
                </View>
                {!loginmode && <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput
                        placeholder='Confirm password'
                        placeholderTextColor={'rgba(39, 39, 39, 0.76)'}
                        cursorColor={'rgba(39, 39, 39, 0.76)'}
                        secureTextEntry={show2}
                        style={[styles.input, { borderWidth: inp4width, marginLeft: 30 }]}
                        onFocus={() => { setinp4width(2) }}
                        onEndEditing={() => { setinp4width(1) }}
                        value={confirmpassword}
                        onChangeText={(text) => { setconfirmpassword(text) }}
                    />
                    <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { setshow2(!show2) }}>
                        {show2 ? <Image style={styles.Img} source={require('../assets/show.png')} tintColor={'#0073FF'}/> : <Image style={styles.Img} source={require('../assets/hide.png')} tintColor={'#0073FF'}/>}
                    </TouchableOpacity>
                </View>}

                <TouchableOpacity disabled={loader} style={[styles.btns, { justifyContent: 'center', backgroundColor: 'rgba(165, 190, 252, 0.197)', }]} onPress={() => { nameValid && passValid ? loginmode ? authenticate() : createAccount() : Alert.alert("Ensure your credentials are in correct format") }}>
                    {loginmode && !loader ? <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Login</Text> :
                        !loader && <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Create account</Text>}
                    {loader && <ActivityIndicator
                        animating={true}
                        color={'#0073FF'}
                        size={'small'}
                    >
                    </ActivityIndicator>}
                </TouchableOpacity>

            </View>
            <View style={styles.redirect}>
                {loginmode ? <Text style={styles.btntxt}>Don't have an account? </Text> :
                    <Text style={styles.btntxt}>Already have an account? </Text>}
                <TouchableOpacity onPress={() => { setloginmode(!loginmode) }}>
                    {loginmode ? <Text style={styles.redirectlink}>Create now</Text> :
                        <Text style={styles.redirectlink}>Login</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView></>
    )
}

export default Login

const styles = StyleSheet.create({
    Img: {
        height: 20,
        width: 20,
    },
    input: {
        color: 'rgba(39, 39, 39, 0.76)',
        alignItems: 'center',
        flexDirection: 'row',
        width: '60%',
        height: 35,
        borderRadius: 8,
        borderColor: '#0073FF',
        fontSize: 15,
        fontFamily: 'Inter_24pt-Regular',
        paddingVertical: 4
    },
    Logoimg: {
        position: 'absolute',
        right: 10,
        height: 25,
        width: 25,
    },
    redirectlink: {
        color: 'rgb(125, 150, 255)',
        fontFamily: 'Inter_24pt-Regular',
    },
    redirect: {
        flexDirection: 'row'
    },
    btnspace: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    btntxt: {
        color: 'rgba(39, 39, 39, 0.76)',
        fontFamily: 'Inter_24pt-Regular',
        fontWeight: 'bold'
    },
    btns: {
        width: '60%',
        height: 'auto',
        alignItems: 'center',
        borderColor: '#0073FF',
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        // backgroundColor:'red'
    },
    Logotxt: {
        color: 'rgba(39, 39, 39, 0.76)',
        fontFamily: 'Inter_24pt-Regular',
        fontSize: 35,
        fontWeight: 'bold'
    },
    Logo: {
        marginTop: '10%',
    },
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        gap: 20,
        flex: 1
    }
})