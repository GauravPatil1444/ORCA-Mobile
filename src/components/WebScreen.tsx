import { View, TextInput, Dimensions, Image, TouchableOpacity, StatusBar, KeyboardAvoidingView, FlatList, Text, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';
import WebView from 'react-native-webview';

type DrawerProps = DrawerScreenProps<DrawerParamList,'WebScreen'>;

const WebScreen = ({route}:DrawerProps) => {
    const [searchinp, setsearchinp] = useState('');
    const [chatData, setchatData] = useState<any>([]);
    const [edit, setedit] = useState(true);
    const list = useRef<any>(null);
    const [Agent, setAgent] = useState<any>('');
    const [classes_to_remove, setprompt] = useState<string|undefined>('');
    const [invoke, setinvoke] = useState(false);

    useEffect(() => {
        setsearchinp('');
    }, [chatData]);

    useEffect(() => {
        setAgent(route.params?.link);
        setprompt(route.params?.classes_to_remove);
        setchatData([]);
        console.log(route.params?.link);
        // console.log();
        setchatData([]);
        
    }, [route.params]);

    useEffect(() => {
        if (chatData.length > 0) {
          setTimeout(() => {
            list.current?.scrollToOffset({ offset: 99999, animated: true });
          }, 100);
        }
    }, [chatData]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBackgroundColor("white");
            StatusBar.setBarStyle("dark-content");
        }, [])
    );

    const requestorca = async (inp: string) => {
        try {
            // setqueryParams({
            //     link: inp,
            //     query: Agent,
            //     classes_to_remove: classes_to_remove ?? ""
            // });
            setinvoke(false);
            setTimeout(() => {
                setinvoke(true);
                setchatData(1);
            }, 1000);
            
            // setchatData(prevChatData => [...prevChatData, { "type": "system", "content": res["response"] }]);
        } catch (e){
            console.log(e);
            setedit(true);
        }
    };

    const handleUserInput = async (inp: string) => {
        if(inp!=""){
            setedit(false);
            // setchatData(prevChatData => [...prevChatData, { "type": "user", "content": inp }]);
            await requestorca(inp);
            setinvoke(false);
            setedit(true);
        }
    };

    useEffect(() => {
      setinvoke(false);
    }, [searchinp])
    

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                {chatData.length!=0&&invoke?
                    <WebView source={{ uri: `https://3b9e-2409-4081-97-c4cd-4961-2148-f5d2-5504.ngrok-free.app/owst?link=${Agent}&query=${searchinp}&classes_to_remove=${classes_to_remove} ` }} style={{ flex: 1 }} />
                :<View style={{flex:1,paddingHorizontal:15, alignItems:'center',flexDirection:'row',gap:5}}><Text style={{fontSize:Dimensions.get('window').width/12,marginLeft:Dimensions.get('window').width/10}}>Welcome,</Text><ScrollView horizontal={true}><Text style={{color:'rgb(38, 121, 255)',fontSize:Dimensions.get('window').width/12}}>Gaurav</Text></ScrollView></View>}
            </View>
            <KeyboardAvoidingView behavior='height' enabled={true} keyboardVerticalOffset={0} style={styles.keyboardAvoidingContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        editable={edit}
                        style={styles.inputField}
                        placeholder={`Message ${Agent}`} 
                        placeholderTextColor="rgba(39, 39, 39, 0.76)"
                        cursorColor="rgba(39, 39, 39, 0.76)"
                        enterKeyHint='search'
                        returnKeyType='search'
                        inputMode='search'
                        value={searchinp}
                        onChangeText={setsearchinp}
                        onSubmitEditing={() => handleUserInput(searchinp)}
                    />
                    <TouchableOpacity style={styles.sendbtn} onPress={() => handleUserInput(searchinp)}>
                        {searchinp.length !== 0 ? (
                            <Image style={styles.sendIcon} source={require('../assets/send.png')} />
                        ) : (
                            <Image style={styles.sendIcon} source={require('../assets/mic.png')} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageContainer: {
        // flex: 1,
        paddingLeft:10,
        height: Dimensions.get('window').height - Dimensions.get('window').height / 6,
    },
    inputContainer: {
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(39, 39, 39, 0.76)',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.76)'
    },
    inputField: {
        flex: 1,
        padding: 15,
        borderRadius: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
    },
    sendbtn: {
        padding: 10,
    },
    sendIcon: {
        width: 30,
        height: 30,
    },
    keyboardAvoidingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    userContent: {
        flexDirection: 'row-reverse',
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    systemContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 15,
        // backgroundColor:'pink'
    },
    userText: {
        padding: 10,
        backgroundColor: 'rgba(135, 207, 235, 0.26)',
        borderRadius: 10,
        fontSize: 16
    },
    systemText: {
        fontSize: 16
    },
    chatContainer: {
        paddingVertical: 10,
    }
});

export default WebScreen;
