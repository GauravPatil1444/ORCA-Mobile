import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Image } from 'react-native'
import React from 'react'
import RNFS from 'react-native-fs';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';
import Slider from '@react-native-community/slider';

type DrawerProps = DrawerScreenProps<DrawerParamList, 'URLAgent'>;

const URLAgent = ({ route }: DrawerProps) => {

  const [Agent, setAgent] = useState<string | undefined>('');
  const [classes, setclasses] = useState<string | undefined>('');
  const [selected, setselected] = useState('')
  const [deleteoption, setdeleteoption] = useState(false);
  const [range, setrange] = useState(500);
  const [overlap, setoverlap] = useState(0);
  const [collection, setcollection] = useState('');
  const [link, setlink] = useState('');

  const navigation = useNavigation();

  const save = async () => {
    // console.log(docs);
    if(link!==""){

      try {
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
            "Agent_type": "URLAgent",
            "classes_to_remove": classes
          }
          await Agents.splice(0, 0, Agent_data);
          console.log(Agents);
          await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
          navigation.dispatch(DrawerActions.jumpTo('WebScreen', { "link": link, "classes_to_remove": classes }))
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    else{
      
    }
  }

  const Handlesave = () => {

    if (Agent != '') {
      save();
    }
    else {

    }
  }

  const DeleteAgent = async () => {
    if (classes === "URL") {
      const response = await fetch('https://1824-152-58-20-39.ngrok-free.app/delete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "collection_name": Agent })
      });
      console.log(response);
    }
    try {
      const path = RNFS.DocumentDirectoryPath + '/URLAgents.txt';
      let res = await RNFS.readFile(path, 'utf8')
      let Agents = await JSON.parse(res);
      let index: number = -1;
      for (let i = 0; i < Agents.length; i++) {
        if (Agents[i]["Agent"] === Agent) {
          index = i;
          console.log(Agents[i]["Agent"], "deleted");
          break;
        }
      }
      Agents.splice(index, 1);
      await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
      navigation.dispatch(DrawerActions.jumpTo('AgentSelector'))
    }
    catch {
      console.log("Something went wrong!");
    }

  }

  const webUpload = async () => {
    if (link !== "" && Agent !== "") {
      try {
        const response = await fetch("https://1824-152-58-20-39.ngrok-free.app/webupload", {
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
          navigation.dispatch(DrawerActions.jumpTo('ChatScreen', { "Agent": Agent, "prompt": 'URL' }))
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    else {

    }
  }

  const handleConfirm = () => {
    if (selected !== "") {
      selected === "website" ? Handlesave() : webUpload();
    }
    else {

    }
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
        <Text>Choose type :</Text>
        <View style={{ width: '90%', height: 'auto' }}>
          <TouchableOpacity style={[styles.filetag, { backgroundColor: selected == "website" ? 'rgba(135, 207, 235, 0.26)' : 'white' }]}><Text style={{ fontWeight: 'bold' }} onPress={() => { setselected('website') }} >🌐 Website - Organizational / Business</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.filetag, { backgroundColor: selected == "webpage" ? 'rgba(135, 207, 235, 0.26)' : 'white' }]}><Text style={{ fontWeight: 'bold' }} onPress={() => { setselected('webpage') }}>🌐 Web Page - Article or Blog</Text></TouchableOpacity>
        </View>
      </View>

      {deleteoption && <TouchableOpacity style={[styles.btn, { width: '40%', height: 'auto', backgroundColor: 'rgba(255, 69, 69, 0.26)' }]} onPress={() => { DeleteAgent() }}>
        <Text style={{ color: 'rgb(255, 0, 0)', fontSize: 15, fontWeight: 'bold' }}>Delete Agent</Text>
        <Image
          style={{ width: 20, height: 20, tintColor: 'rgb(255, 0, 0)' }}
          source={require("../assets/trash.png")}
        />
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
      {selected === "webpage" && <TextInput
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

      <TouchableOpacity style={[styles.btn, { backgroundColor: 'rgba(69, 255, 85, 0.2)', width: '30%', height: 'auto' }]} onPress={() => handleConfirm()}>
        <Text style={{ color: 'rgb(1, 107, 10)', fontSize: 15, fontWeight: 'bold' }}>Confirm</Text>
        <Image
          style={{ width: 18, height: 18, tintColor: 'rgb(1, 107, 10)' }}
          source={require("../assets/tick.png")}
        />
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