import { View, TextInput, Dimensions, Image, TouchableOpacity, StatusBar, KeyboardAvoidingView, FlatList, Text, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = () => {
    const [searchinp, setsearchinp] = useState('');
    const [chatData, setchatData] = useState<{ type: string; content: string }[]>([]);
    const [edit, setedit] = useState(true);
    const list = useRef<any>(null);

    useEffect(() => {
        setsearchinp('');
    }, [chatData]);

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
            const response = await fetch("https://c806-202-160-145-185.ngrok-free.app/search", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "data": inp, "collection_name": "SMART" })
            });
            const res = await response.json();
            setchatData(prevChatData => [...prevChatData, { "type": "system", "content": res["response"] }]);
        } catch {
            setedit(true);
        }
    };

    const handleUserInput = async (inp: string) => {
        if(inp!=""){
            setedit(false);
            setchatData(prevChatData => [...prevChatData, { "type": "user", "content": inp }]);
            await requestorca(inp);
            setedit(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                {chatData.length!=0?<FlatList
                    style={styles.chatContainer}
                    data={chatData}
                    ref={list}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            {item.type === "user" ? (
                                <View style={styles.userContent}>
                                    <Text style={styles.userText}>{item.content}</Text>
                                </View>
                            ) : (
                                <View style={styles.systemContent}>
                                    <Text style={styles.systemText}>{item.content}</Text>
                                </View>
                            )}
                        </View>
                    )}
                />:<View style={{flex:1,paddingHorizontal:15, alignItems:'center',flexDirection:'row',gap:5}}><Text style={{fontSize:Dimensions.get('window').width/12,marginLeft:Dimensions.get('window').width/8}}>Welcome,</Text><ScrollView horizontal={true}><Text style={{color:'rgb(38, 121, 255)',fontSize:Dimensions.get('window').width/12}}>Gaurav</Text></ScrollView></View>}
            </View>
            <KeyboardAvoidingView behavior='height' enabled={true} keyboardVerticalOffset={0} style={styles.keyboardAvoidingContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        editable={edit}
                        style={styles.inputField}
                        placeholder="Message ORCA"
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
        color: 'rgba(39, 39, 39, 0.76)',
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
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 15,
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

export default ChatScreen;
