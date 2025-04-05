import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { pick, keepLocalCopy, types } from '@react-native-documents/picker'
import RNFS from 'react-native-fs';
import { useState } from 'react';

const DocumentModel = () => {

  const [filename, setfilename] = useState<string|null>('');
  const [fileexists, setfileexists] = useState(false);
  const [pdfpath, setpdfpath] = useState<string>('');

  const Filepicker = async()=>{
    if(pdfpath!=""){
      try{
        await RNFS.unlink(RNFS.DocumentDirectoryPath+"/"+pdfpath);
        console.log("previous one deleted!");
      }
      catch(e){
        console.log(e);
      }
    }
    setfileexists(false);
    setfilename('');
    try {
      const [{ name, uri }] = await pick({type:[types.pdf,types.json,types.csv,types.images]})
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
        const path = copyResult.localUri.split('files/')[1].split('/')[0]+"/"+name;
        console.log(path);
        setpdfpath(path);
        // RNFS.unlink(path);
        
        
        
        // const files = await RNFS.readDir(RNFS.DocumentDirectoryPath+"/d278039f-2303-4f09-af91-03a071dc4144");
        // console.log(files[0].path);
        // try{
        //   const filePath = "/data/user/0/com.orca/files/d278039f-2303-4f09-af91-03a071dc4144";
        //   const content = await RNFS.readFile(filePath, 'utf8');
        //   console.log("File Content:", content);
        // }
        // catch(e){
        //   console.log(e);
        // }
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

  const process = async()=>{
    const dir = RNFS.DocumentDirectoryPath+"/"+pdfpath;
    // console.log(docs);
    try {
      const formData = new FormData();
  
      formData.append('file', {
        uri: `file://${dir}`, // prepend file:// on Android
        name: filename,
        type: getMimeType(filename), // detect content-type
      });
      
      formData.append('collection_name', 'sample');

      const response = await fetch('https://bde6-202-160-145-173.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await response.json();
      console.log(result);
      RNFS.unlink(dir);
    } 
    catch (err) {
      console.error(err);
      RNFS.unlink(dir);
    }
  }

  return (
    <View style={{flex:1,alignItems:'center',gap:15}}>
      <View style={styles.filepicker}>
        
        <TouchableOpacity style={styles.btn} onPress={()=>{Filepicker()}}>
          <Text style={{color:'#192A56',fontSize:15,fontWeight:'bold'}}>Choose file</Text>
        </TouchableOpacity>

        <View style={{alignItems:'center',flexDirection:'row',gap:5}}>
          
          <Text>Supported type :</Text>
          <View style={[{backgroundColor:'rgba(255, 69, 69, 0.25)'},styles.filetag]}><Text style={{color:'rgb(255, 0, 0)'}}>pdf</Text></View> 
          <View style={[{backgroundColor:'rgba(255, 174, 69, 0.25)'},styles.filetag]}><Text style={{color:'rgb(235, 103, 2)'}}>json</Text></View> 
          <View style={[{backgroundColor:'rgba(69, 255, 85, 0.25)'},styles.filetag]}><Text style={{color:'rgb(1, 107, 10)'}}>csv</Text></View> 
          <View style={[{backgroundColor:'rgba(190, 69, 255, 0.25)'},styles.filetag]}><Text style={{color:'rgb(153, 1, 235)'}}>image</Text></View> 
        
        </View>
        <Text style={{color:'#192A56',fontSize:15,fontWeight:'bold'}}>{filename}</Text>
      </View>
      {fileexists&&<TouchableOpacity style={[styles.btn,{backgroundColor:'rgba(69, 255, 85, 0.2)',width:'30%',height:'auto'}]} onPress={()=>{process()}}>
          <Text style={{color:'#192A56',fontSize:15,fontWeight:'bold'}}>Confirm</Text>
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  btn:{
    backgroundColor:'rgba(135, 207, 235, 0.26)',
    width:'40%',
    height:'30%',
    padding:10, 
    alignItems:'center', 
    justifyContent:'center',
    borderRadius:8,
  },
  filepicker:{
    marginTop:5,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'90%',
    height:'25%',
    backgroundColor:'white',
    borderStyle:'dashed',
    borderWidth:2,
    borderColor:'#0073FF',
    gap:15
  },
  filetag:{
    padding:5,
    borderRadius:5
  }
})

export default DocumentModel