import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import RNFS from 'react-native-fs';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message'
import RNRestart from 'react-native-restart';
import { firebase_auth } from '../../firebaseConfig'
import { db } from '../../firebaseConfig';
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

type DrawerProps = DrawerScreenProps<DrawerParamList, 'URLAgent'>;

const URLAgent = ({ route }: DrawerProps) => {

  const [Agent, setAgent] = useState<string | undefined>('');
  const [classes, setclasses] = useState<string | undefined>('');
  const [selected, setselected] = useState('')
  const [deleteoption, setdeleteoption] = useState(false);
  const [range, setrange] = useState(500);
  const [overlap, setoverlap] = useState(0);
  const [link, setlink] = useState('');
  const [loader, setloader] = useState(false);
  const [deleteloader, setdeleteloader] = useState(false);

  const uid = firebase_auth.currentUser?.uid;

  const navigation = useNavigation();

  const save = async () => {
    // console.log(docs);
    if (link !== "") {
      try {
        setloader(true);
        const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
        let Agents = [];
        try {
          let res = await RNFS.readFile(path, 'utf8')
          Agents = JSON.parse(res);
          console.log(typeof (Agents), Agents);
        }
        catch {
          Agents = [];
        }
        finally {
          const Agent_data = {
            "Agent": Agent,
            "link": link,
            "Agent_type": "URLAgent",
            "classes_to_remove": classes
          }
          await Agents["URLAgents"].splice(0, 0, Agent_data);
          console.log(Agents);
          await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
          // const docRef = await addDoc(collection(db, "users", `${uid}/UserPreferences`), Agents);
          
          const uid = firebase_auth.currentUser?.uid;

          const docRef = collection(db, "users", `${uid}/UserPreferences`);
          const docSnap = await getDocs(docRef);
          const docref = doc(db, "users", `${uid}`, "UserPreferences", docSnap.docs[0].id);
          await updateDoc(docref, Agents);
          
          // navigation.dispatch(DrawerActions.jumpTo('WebScreen', { "link": link, "classes_to_remove": classes }))
          showToast("success", "Agent Deployed!");
          setloader(false);
          RNRestart.restart();
        }
      }
      catch (e) {
        // console.log(e);
        showToast("error", "Something went wrong !");
        setloader(false);
      }
    }
    else {
      showToast("info", "Fill all the fields");
    }
  }

  const Handlesave = () => {

    if (Agent != '') {
      save();
    }
  }

  const DeleteAgent = async () => {
    if (classes === "URL") {
      try {
        setdeleteloader(true);
        const response = await fetch('https://orca-574216179276.asia-south1.run.app/delete', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "collection_name": Agent })
        });
        console.log(response);
      }
      catch {
        setdeleteloader(false);
      }
    }
    try {
      setdeleteloader(true);
      const path = RNFS.DocumentDirectoryPath + '/URLAgents.txt';
      let res = await RNFS.readFile(path, 'utf8')
      let Agents = await JSON.parse(res);
      let index: number = -1;
      for (let i = 0; i < Agents.length; i++) {
        if (Agents["URLAgents"][i]["Agent"] === Agent) {
          index = i;
          console.log(Agents["URLAgents"][i]["Agent"], "deleted");
          break;
        }
      }
      Agents["URLAgents"].splice(index, 1);
      await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
      // const docRef = await addDoc(collection(db, "users", `${uid}/UserPreferences`), Agents);
      const docRef = collection(db, "users", `${uid}/UserPreferences`);
      const docSnap = await getDocs(docRef);
      const docref = doc(db, "users", `${uid}`, "UserPreferences", docSnap.docs[0].id);
      await updateDoc(docref, Agents);
        
      // navigation.dispatch(DrawerActions.jumpTo('AgentSelector'));
      // showToast ("success", "Agent Deleted!");
      setdeleteloader(false);
      RNRestart.restart();
    }
    catch {
      // console.log("Something went wrong!");
      showToast("error", "Something went wrong !");
      setdeleteloader(false);
    }

  }

  const webUpload = async () => {
    if (link !== "" && Agent !== "") {
      try {
        setloader(true);
        const response = await fetch("https://orca-574216179276.asia-south1.run.app/webupload", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "link": link, "collection_name": Agent, "range": range, "overlap": overlap })
        });
        const res = await response.json();
        console.log(res);
        const path = RNFS.DocumentDirectoryPath + '/URLAgents.txt';
        let Agents = [];
        try {
          let res = await RNFS.readFile(path, 'utf8')
          Agents = JSON.parse(res);
          console.log(typeof (Agents), Agents);
        }
        catch {
          Agents = [];
        }
        finally {
          const Agent_data = {
            "Agent": Agent,
            "link": link,
            "Agent_type": "Web_URLAgent",
            "classes_to_remove": "URL"
          }
          Agents.splice(0, 0, Agent_data);
          await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
          // navigation.dispatch(DrawerActions.jumpTo('ChatScreen', { "Agent": Agent, "prompt": 'URL' }))
          setloader(false);
          RNRestart.restart();
        }
      }
      catch (e) {
        console.log(e);
        showToast("error", "Something went wrong !");
        setloader(false);
      }
    }
    else {
      showToast("info", "Fill all the fields");
    }
  }

  const handleConfirm = () => {
    if (selected !== "") {
      selected === "website" ? Handlesave() : webUpload();
    }
    else {
      showToast("info", "Select type first!");
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

  useEffect(() => {
    setAgent(route.params?.Agent);
    setclasses(route.params?.classes_to_remove);
    if (route.params?.Agent) {
      setdeleteoption(true);
    }
    else {
      setdeleteoption(false);
    }
  }, [route.params])


  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 15, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text>Select type :</Text>
        <View style={{ width: '90%', height: 'auto' }}>
          <TouchableOpacity style={[styles.filetag, { backgroundColor: selected == "website" ? 'rgba(135, 207, 235, 0.26)' : 'white' }]}><Text style={{ fontWeight: 'bold' }} onPress={() => { setselected('website') }} >🌐 Website - Organizational / Business</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.filetag, { backgroundColor: selected == "webpage" ? 'rgba(135, 207, 235, 0.26)' : 'white' }]}><Text style={{ fontWeight: 'bold' }} onPress={() => { setselected('webpage') }}>🌐 Web Page - Article or Blog</Text></TouchableOpacity>
        </View>
      </View>

      {deleteoption && <TouchableOpacity disabled={deleteloader} style={[styles.btn, { width: '40%', height: 'auto', backgroundColor: 'rgba(255, 69, 69, 0.26)' }]} onPress={() => { DeleteAgent() }}>
        {!deleteloader ? <><Text style={{ color: 'rgb(255, 0, 0)', fontSize: 15, fontWeight: 'bold' }}>Delete Agent</Text>
          <Image
            style={{ width: 20, height: 20, tintColor: 'rgb(255, 0, 0)' }}
            source={require("../assets/trash.png")}
          /></> :
          <ActivityIndicator
            animating={true}
            color={'rgb(255, 0, 0)'}
            size={'small'}
          >
          </ActivityIndicator>}
      </TouchableOpacity>}

      <TextInput
        style={[styles.inputField]}
        placeholder="Paste URL here"
        placeholderTextColor="rgba(39, 39, 39, 0.76)"
        cursorColor="rgba(39, 39, 39, 0.76)"
        enterKeyHint='done'
        returnKeyType='done'
        inputMode='url'
        value={link}
        onChangeText={setlink}
      />
      {<TextInput
        style={[styles.inputField]}
        placeholder="Set Agent name"
        placeholderTextColor="rgba(39, 39, 39, 0.76)"
        cursorColor="rgba(39, 39, 39, 0.76)"
        enterKeyHint='done'
        returnKeyType='done'
        inputMode='search'
        value={Agent}
        onChangeText={setAgent}
      />}

      {selected === "website" && <>
        <Text style={{ marginBottom: -10 }}>Remove unwanted classes</Text>
        <TextInput
          style={styles.inputField}
          multiline={true}
          numberOfLines={4}
          placeholder="Insert comma separated classes"
          placeholderTextColor="rgba(39, 39, 39, 0.76)"
          cursorColor="rgba(39, 39, 39, 0.76)"
          enterKeyHint='done'
          returnKeyType='done'
          inputMode='search'
          value={classes}
          onChangeText={setclasses}
        /></>}

      {selected === "webpage" && <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center' }}>

        <Text style={{ marginBottom: -10, marginTop: 10 }}>Chunk size</Text>
        <Slider
          minimumValue={500}
          maximumValue={1500}
          onSlidingComplete={() => { setrange }}
          value={range}
          step={500}
          renderStepNumber={true}
          minimumTrackTintColor='#0073FF'
          maximumTrackTintColor='#0073FF'
          style={{ width: '75%', height: 60 }}
        />

        <Text style={{ marginBottom: -10, marginTop: 10 }}>Chunk Overlap size</Text>
        <Slider
          minimumValue={0}
          maximumValue={250}
          onSlidingComplete={() => { setoverlap }}
          value={overlap}
          step={50}
          renderStepNumber={true}
          minimumTrackTintColor='#0073FF'
          maximumTrackTintColor='#0073FF'
          style={{ width: '75%', height: 60 }}
        />

      </View>}

      <TouchableOpacity disabled={loader} style={[styles.btn, { backgroundColor: 'rgba(69, 255, 85, 0.2)', width: '30%', height: 'auto' }]} onPress={() => handleConfirm()}>
        {!loader ? <><Text style={{ color: 'rgb(1, 107, 10)', fontSize: 15, fontWeight: 'bold' }}>Confirm</Text>
          <Image
            style={{ width: 18, height: 18, tintColor: 'rgb(1, 107, 10)' }}
            source={require("../assets/tick.png")}
          /></> :
          <ActivityIndicator
            animating={true}
            color={'rgb(1, 107, 10)'}
            size={'small'}
          >
          </ActivityIndicator>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 30,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: '90%',
    height: '25%',
    borderWidth: 2,
    borderColor: '#0073FF',
    borderRadius: 8,
    borderStyle: 'dashed'
  },
  btn: {
    backgroundColor: 'rgba(135, 207, 235, 0.26)',
    width: '40%',
    height: '30%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 5
  },
  filepicker: {
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '25%',
    backgroundColor: 'white',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#0073FF',
    gap: 15
  },
  filetag: {
    padding: 15,
    borderRadius: 5,
    width: '100%',
    height: 'auto'
  },
  inputField: {
    width: '80%',
    height: 'auto',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
    borderWidth: 1,
  },
})

export default URLAgent