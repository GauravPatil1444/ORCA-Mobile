import { View, TextInput, Dimensions, Image, TouchableOpacity, StatusBar, KeyboardAvoidingView, FlatList, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';

type DrawerProps = DrawerScreenProps<DrawerParamList, 'ChatScreen'>;

const ChatScreen = ({ route }: DrawerProps) => {
    const [searchinp, setsearchinp] = useState('');
    const [chatData, setchatData] = useState<{ type: string; content: string }[]>([]);
    const [edit, setedit] = useState(true);
    const list = useRef<any>(null);
    const [Agent, setAgent] = useState<string | undefined>('');
    const [prompt, setprompt] = useState<string | undefined>('');
    const [loader, setloader] = useState(false);

    useEffect(() => {
        setsearchinp('');
    }, [chatData]);

    useEffect(() => {
        setAgent(route.params?.Agent);
        setprompt(route.params?.prompt);
        setchatData([]);
        console.log(route.params?.Agent);

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
            setloader(true);
            const response = await fetch("https://orca-574216179276.asia-south1.run.app/search", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "data": inp, "collection_name": Agent, "prompt": prompt === undefined ? "" : prompt })
            });
            const res = await response.json();
            // console.log(200,response);
            setchatData(prevChatData => [...prevChatData, { "type": "system", "content": res["response"] }]);
            setloader(false);
        } catch {
            showToast("error", "Something went wrong !");
            setedit(true);
            setloader(false);
        }
    };

    const handleUserInput = async (inp: string) => {
        if (inp != "") {
            setedit(false);
            setchatData(prevChatData => [...prevChatData, { "type": "user", "content": inp }]);
            await requestorca(inp);
            setedit(true);
        }
    };

    const showToast = (type: string, message: string) => {
        Toast.show({
            type: type,
            text1: message,
            text1Style: { color: 'rgb(25,42,86)', fontSize: 18 },
            visibilityTime: 4000,
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                {chatData.length != 0 ? <FlatList
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
                /> : <View style={{ flex: 1, paddingHorizontal: 15, alignItems: 'center', flexDirection: 'row', gap: 5 }}><Text style={{ fontSize: Dimensions.get('window').width / 12, marginLeft: Dimensions.get('window').width / 10 }}>Welcome,</Text><ScrollView horizontal={true}><Text style={{ color: 'rgb(38, 121, 255)', fontSize: Dimensions.get('window').width / 12 }}>Gaurav</Text></ScrollView></View>}
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
                    {!loader ? <TouchableOpacity style={styles.sendbtn} onPress={() => handleUserInput(searchinp)}>
                        {searchinp.length !== 0 ? (
                            <Image style={styles.sendIcon} source={require('../assets/send.png')} />
                        ) : (
                            <Image style={styles.sendIcon} source={require('../assets/mic.png')} />
                        )}
                    </TouchableOpacity> : <ActivityIndicator
                        animating={true}
                        color={'#0073FF'}
                        size={'large'}
                    >
                    </ActivityIndicator>}
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
        paddingLeft: 10,
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

export default ChatScreen;
