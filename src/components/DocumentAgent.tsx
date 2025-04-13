import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch, Image } from 'react-native'
import React from 'react'
import { pick, keepLocalCopy, types } from '@react-native-documents/picker'
import RNFS from 'react-native-fs';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../App';

type DrawerProps = DrawerScreenProps<DrawerParamList,'DocumentAgent'>;

const DocumentAgent = ({route}:DrawerProps) => {

  const [filename, setfilename] = useState<string | null>('');
  const [fileexists, setfileexists] = useState(false);
  const [pdfpath, setpdfpath] = useState<string>('');
  const [Agent, setAgent] = useState<string|undefined>('');
  const [prompt, setprompt] = useState<string|undefined>('');
  const [range, setrange] = useState(500);
  const [overlap, setoverlap] = useState(0);
  const [regex, setregex] = useState(false);
  const [expression, setexpression] = useState<string>('');
  const [deleteoption, setdeleteoption] = useState(false);

  const navigation = useNavigation();

  const Filepicker = async () => {
    if (pdfpath != "") {
      try {
        await RNFS.unlink(RNFS.DocumentDirectoryPath + "/" + pdfpath);
        console.log("previous one deleted!");
      }
      catch (e) {
        console.log(e);
      }
    }
    setfileexists(false);
    setfilename('');
    try {
      const [{ name, uri }] = await pick({ type: [types.pdf, types.json, types.csv, types.images] })
      setfilename(name);
      const [copyResult] = await keepLocalCopy({
        files: [
          {
            uri,
            fileName: name ?? 'fallback-name',
          },
        ],
        destination: 'documentDirectory',
      })
      if (copyResult.status === 'success') {
        setfileexists(true);
        const path = copyResult.localUri.split('files/')[1].split('/')[0] + "/" + name;
        console.log(path);
        setpdfpath(path);
      }
    } catch (err) {
      // see error handling
    }
  }

  const getMimeType = (filename: string | null) => {
    if (!filename) return 'application/octet-stream';
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      default: return 'application/octet-stream';
    }
  };

  const process = async () => {
    const dir = RNFS.DocumentDirectoryPath + "/" + pdfpath;
    // console.log(docs);
    if(Agent!==""&&prompt!==""){
      if(regex==true&&expression!=""){

        try {
          const formData = new FormData();
    
          formData.append('file', {
            uri: `file://${dir}`, // prepend file:// on Android
            name: filename,
            type: getMimeType(filename), // detect content-type
          });
    
          formData.append('collection_name', Agent);
          formData.append('pdfoption', regex?"adv":"");
          formData.append('range', range);
          formData.append('overlap', overlap);
          formData.append('regex', expression);
    
          const response = await fetch('https://972a-2409-4081-97-c4cd-9cd3-e5d8-1868-b26b.ngrok-free.app/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          const result = await response.json();
          console.log(result);
          const path = RNFS.DocumentDirectoryPath + '/Agents.txt';
          let Agents = [];
          try {
            let res = await RNFS.readFile(path, 'utf8')
            Agents = JSON.parse(res);
            console.log(typeof(Agents),Agents);
          }
          catch {
            Agents = [];
          }
          finally{
            const Agent_data = {
              "Agent":Agent,
              "Agent_type":"DocumentAgent",
              "prompt":prompt
            }
            Agents.splice(0,0,Agent_data);
            await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
            navigation.dispatch(DrawerActions.jumpTo('ChatScreen', { "Agent": Agent, "prompt": prompt}))
            RNFS.unlink(dir);
          }
        }
        catch(e){
          setfileexists(false);
          console.log(e);
          RNFS.unlink(dir);
        }
      }
      else{
        
      }
    }
    else{

    }
  }

  const HandleProcess = ()=>{

    if(Agent!=''){
      process();
    }
    else{

    }
  }

  const DeleteAgent = async()=>{
    try{
      const response = await fetch('https://972a-2409-4081-97-c4cd-9cd3-e5d8-1868-b26b.ngrok-free.app/delete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"collection_name":Agent})
      });
      console.log(response);
      const path = RNFS.DocumentDirectoryPath + '/Agents.txt';
      let res = await RNFS.readFile(path, 'utf8')
      let Agents = await JSON.parse(res);
      let index:number=-1;
      for(let i=0;i<Agents.length;i++){
        if(Agents[i]["Agent"]===Agent){
          index=i;
          console.log(Agents[i]["Agent"],"deleted");
          break;
        }
      }
      Agents.splice(index,1);
      await RNFS.writeFile(path, JSON.stringify(Agents), 'utf8');
      navigation.dispatch(DrawerActions.jumpTo('AgentSelector'))
    }
    catch(e){
      console.log("Something went wrong!",e);
    }
  }

  useEffect(() => {
    setAgent(route.params?.Agent);    
    setprompt(route.params?.prompt);
    if(route.params?.Agent){
      setdeleteoption(true);
      setfileexists(true);
    }
    else{
      setdeleteoption(false);
      setfileexists(false);
      setfilename('');
    }
  }, [route.params])
  

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 15, backgroundColor:'white' }}>
      <View style={styles.filepicker}>
        {deleteoption==false&&<TouchableOpacity style={styles.btn} onPress={() => { Filepicker() }}>
          <Text style={{ color: '#0073FF', fontSize: 15, fontWeight: 'bold'}}>Choose File</Text>
          <Image
            style={{ width: 20, height: 20}}
            source={require("../assets/file.png")}
          />
        </TouchableOpacity>}
        {deleteoption&&
          <View style={{width:'100%', height:'30%', alignItems:'center', gap:20, justifyContent:'center', flexDirection:'row'}}>
            <TouchableOpacity style={[styles.btn,{width:'40%',height:'80%'}]} onPress={() => { Filepicker() }}>
              <Text style={{ color: '#0073FF', fontSize: 15, fontWeight: 'bold'}}>Add File</Text>
              <Image
                style={{ width: 20, height: 20}}
                source={require("../assets/file.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,{width:'40%',height:'80%', backgroundColor:'rgba(255, 69, 69, 0.26)'}]} onPress={() => {DeleteAgent()}}>
              <Text style={{ color: 'rgb(255, 0, 0)', fontSize: 15, fontWeight: 'bold'}}>Delete Agent</Text>
              <Image
                style={{ width: 20, height: 20, tintColor:'rgb(255, 0, 0)'}}
                source={require("../assets/trash.png")}
              />
            </TouchableOpacity>
          </View>
        }
        
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>

          <Text>Supported type :</Text>
          <View style={[{ backgroundColor: 'rgba(255, 69, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(255, 0, 0)' }}>pdf</Text></View>
          <View style={[{ backgroundColor: 'rgba(255, 174, 69, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(235, 103, 2)' }}>json</Text></View>
          <View style={[{ backgroundColor: 'rgba(69, 255, 85, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(1, 107, 10)' }}>csv</Text></View>
          <View style={[{ backgroundColor: 'rgba(190, 69, 255, 0.25)' }, styles.filetag]}><Text style={{ color: 'rgb(153, 1, 235)' }}>image</Text></View>

        </View>
        <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>{filename}</Text>
      </View>
      {filename?.split('.')[1]=="pdf" && <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Enable Regex : </Text>
        <Switch
          value={regex}
          onChange={()=>{setregex(!regex)}}
          trackColor={{true:'#0073FF',false:'#0073FF'}}
        />
      </View>}
      {fileexists && <><TextInput
        style={styles.inputField}
        placeholder="Set Agent name"
        placeholderTextColor="rgba(39, 39, 39, 0.76)"
        cursorColor="rgba(39, 39, 39, 0.76)"
        enterKeyHint='done'
        returnKeyType='done'
        inputMode='search'
        value={Agent}
        onChangeText={setAgent}
      />
      
      {regex && <TextInput
        style={styles.inputField}
        placeholder="Enter Regular Expression"
        placeholderTextColor="rgba(39, 39, 39, 0.76)"
        cursorColor="rgba(39, 39, 39, 0.76)"
        enterKeyHint='done'
        returnKeyType='done'
        inputMode='search'
        value={expression}
        onChangeText={setexpression}
      />}
      <TextInput
        style={styles.inputField}
        multiline={true}
        numberOfLines={4}
        placeholder="What do you want your Agent to do"
        placeholderTextColor="rgba(39, 39, 39, 0.76)"
        cursorColor="rgba(39, 39, 39, 0.76)"
        enterKeyHint='done'
        returnKeyType='done'
        inputMode='search'
        value={prompt}
        onChangeText={setprompt}
      />
      {regex==false && <> 
      <View style={{width:'100%', flexDirection:'column',alignItems:'center'}}>

        <Text style={{marginBottom:-10, marginTop:10}}>Chunk size</Text>
        <Slider
          minimumValue={500}
          maximumValue={1500}
          onSlidingComplete={()=>{setrange}}
          value={range}
          step={500} 
          renderStepNumber={true}
          minimumTrackTintColor='#0073FF'
          maximumTrackTintColor='#0073FF'
          style={{width:'75%', height:60}}
        />
    
        <Text style={{marginBottom:-10, marginTop:10}}>Chunk Overlap size</Text>
        <Slider
          minimumValue={0}
          maximumValue={250}
          onSlidingComplete={()=>{setoverlap}}
          value={overlap}
          step={50} 
          renderStepNumber={true}
          minimumTrackTintColor='#0073FF'
          maximumTrackTintColor='#0073FF'
          style={{width:'75%', height:60}}
        />

      </View>
      </>}
      <TouchableOpacity style={[styles.btn, { backgroundColor: 'rgba(69, 255, 85, 0.2)', width: '30%', height: 'auto' }]} onPress={() => { HandleProcess() }}>
        <Text style={{ color: 'rgb(1, 107, 10)', fontSize: 15, fontWeight: 'bold' }}>Confirm</Text>
        <Image
          style={{ width: 18, height: 18, tintColor:'rgb(1, 107, 10)'}}
          source={require("../assets/tick.png")}
        />
      </TouchableOpacity></>}
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'rgba(135, 207, 235, 0.26)',
    width: '40%',
    height: '30%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection:'row',
    gap:5
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
    padding: 5,
    borderRadius: 5
  },
  inputField: {
    width:'80%',
    height:'auto',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
    borderWidth:1,
},
})

export default DocumentAgent