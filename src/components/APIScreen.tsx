import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import CodeHighlighter from 'react-native-code-highlighter';
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';


const APIScreen = () => {

    const [layoutBackground, setlayoutBackground] = useState(true);

    
    const CODE_STR_DOC_PY = `   url = "https://orca-574216179276.asia-south1.run.app/search"
    payload = {
        "data": input,
        "collection_name": Agent,
        "prompt": prompt
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    result = response.json()
    print(result)
    `;

    const CODE_STR_DOC_JS = ` const response = await fetch("https://orca-574216179276.asia-south1.run.app/search", 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { 
                        "data": inp, 
                        "collection_name": Agent, 
                        "prompt": prompt 
                    }
                )
            });
    const result = response.json();
    console.log(result);
            `;

    const CODE_STR_URL_PY = "`https://orca-574216179276.asia-south1.run.app/owst?link=${link}&query=${query}&classes_to_remove=${classes_to_remove}`\n# Directly feed the above API into a webview component";
    const CODE_STR_URL_JS = "`https://orca-574216179276.asia-south1.run.app/owst?link=${link}&query=${query}&classes_to_remove=${classes_to_remove}`\n// Directly feed the above API into a webview component";

    const handleCopy = (id: number) => {
        showToast("success", "Copied!");

        if (id == 1) {
            Clipboard.setString(layoutBackground ? CODE_STR_DOC_PY : CODE_STR_DOC_JS);
        }
        else {
            Clipboard.setString(layoutBackground ? CODE_STR_URL_PY : CODE_STR_URL_JS);
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

    return (
        <View style={styles.container}>
            <View style={[styles.btnlayout, { backgroundColor: layoutBackground ? "rgba(135, 207, 235, 0.26)" : "rgba(255, 174, 69, 0.25)" }]}>
                <TouchableOpacity style={[{ backgroundColor: layoutBackground ? "#0073FF" : "white", borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }, styles.togglebtns]} onPress={() => { setlayoutBackground(!layoutBackground) }}>
                    <Text style={{ color: layoutBackground ? "white" : "#0073FF" }}>Python</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{ backgroundColor: layoutBackground ? "white" : "rgb(235, 103, 2)", borderBottomRightRadius: 8, borderTopRightRadius: 8, width: '25%', alignItems: 'center' }, styles.togglebtns]} onPress={() => setlayoutBackground(!layoutBackground)}>
                    <Text style={{ color: layoutBackground ? "rgb(235, 103, 2)" : "white" }}>JavaScript</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerheader}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Document Agent</Text>
                <TouchableOpacity style={[styles.profilebtns, { backgroundColor: layoutBackground ? "rgba(135, 207, 235, 0.26)" : "rgba(255, 174, 69, 0.25)" }]} onPress={() => { handleCopy(1) }}>
                    <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Copy</Text>
                    <Image style={{ width: 16, height: 16, tintColor: '#192A56' }} source={require('../assets/copy.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={[styles.codeContainer]}>
                <View style={[styles.borderbox, { borderColor: layoutBackground ? "rgba(4, 182, 252, 0.59)" : "rgba(252, 153, 4, 0.59)" }]}>
                    <CodeHighlighter
                        hljsStyle={atomOneDarkReasonable}
                        textStyle={{ fontSize: 12 }}
                        language="typescript"
                    >
                        {layoutBackground ? CODE_STR_DOC_PY : CODE_STR_DOC_JS}
                    </CodeHighlighter>
                </View>
            </View>

            <View style={styles.containerheader}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>URL Agent</Text>
                <TouchableOpacity style={[styles.profilebtns, { backgroundColor: layoutBackground ? "rgba(135, 207, 235, 0.26)" : "rgba(255, 174, 69, 0.25)" }]} onPress={() => { handleCopy(2) }}>
                    <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Copy</Text>
                    <Image style={{ width: 16, height: 16, tintColor: '#192A56' }} source={require('../assets/copy.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={[styles.codeContainer, { height: '20%' }]}>
                <View style={[styles.borderbox, , { borderColor: layoutBackground ? "rgba(4, 182, 252, 0.59)" : "rgba(252, 153, 4, 0.59)" }]}>
                    <CodeHighlighter
                        hljsStyle={atomOneDarkReasonable}
                        textStyle={{ fontSize: 12 }}
                        language="typescript"
                    >
                        {layoutBackground ? CODE_STR_URL_PY : CODE_STR_URL_JS}
                    </CodeHighlighter>
                </View>
            </View>
        </View>
    );
};

export default APIScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        gap: 10
    },
    codeContainer: {
        width: '100%',
        height: '45%',
        // backgroundColor:'pink',
        alignItems: 'center',
    },
    borderbox: {
        width: '100%',
        height: 'auto',
        borderWidth: 4,
        // borderColor: 'rgba(4, 182, 252, 0.59)',
        // borderRadius: 8,
        // borderStyle: 'dashed',
        alignItems: 'center',
        // padding: 10,
    },
    containerheader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profilebtns: {
        width: 'auto',
        gap: 5,
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row'
    },
    btnlayout: {
        flexDirection: 'row',
        padding: 8,
        borderRadius: 8
    },
    togglebtns: {
        width: '25%',
        alignItems: 'center',
        padding: 5,
    }

});
