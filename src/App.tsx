import 'react-native-gesture-handler';
import { View, Image, TouchableOpacity, SafeAreaView, ScrollView, Text, Dimensions, FlatList } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import SplashScreen from './components/SplashScreen';
import ChatScreen from './components/ChatScreen';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import ModelSelector from './components/ModelSelector';
import DocumentModel from './components/DocumentModel';
import URLmodel from './components/URLmodel';
import { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';


export type DrawerParamList = {
  ChatScreen: { "model": string } | undefined;
  SplashScreen: undefined;
  DocumentModel: undefined;
  URLmodel: undefined;
  ModelSelector: undefined;
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const App = () => {

  const [models, setmodels] = useState<string[]>([]);

  const startup = async () => {
    const path = RNFS.DocumentDirectoryPath + '/models.txt';
    const data = await RNFS.readFile(path, 'utf8');
    const models = await JSON.parse(data);
    setmodels(models["models"]);
  }

  useEffect(() => {
    startup();
  }, [])


  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="SplashScreen"
        backBehavior="history"
        screenOptions={{
          drawerStyle: { backgroundColor: 'white' },
          drawerLabelStyle: { color: 'rgb(39, 39, 39)' }
        }}
        drawerContent={(props) => {
          return (
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.profile}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity style={styles.logo}>
                    <Text style={{ color: 'white', fontSize: 25 }}>G</Text>
                  </TouchableOpacity>
                  <ScrollView horizontal={true}>
                    <Text style={{ color: '#192A56', fontSize: Dimensions.get('window').width / 15 }}>Gaurav</Text>
                  </ScrollView>
                </View>
                <Text style={{ color: '#192A56', fontSize: 15, paddingLeft: 5 }}>patilgauravajit@gmail.com</Text>
                <TouchableOpacity style={{ backgroundColor: 'rgba(135, 207, 235, 0.26)', width: '30%', padding: 10, alignItems: 'center', borderRadius: 8 }}>
                  <Text style={{ color: '#192A56', fontSize: 15, fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
              </View>
              {/* <DrawerItemList {...props} /> */}
              <View style={{height:'72%', alignItems: 'center', gap:10 }}>
                <TouchableOpacity style={styles.DrawerTabs} onPress={()=>{props.navigation.dispatch(DrawerActions.jumpTo('ModelSelector'))}}>
                  <Text style={styles.DrawerTabText}>Build Tools</Text>
                </TouchableOpacity>
                {models.length != 0 && <FlatList
                  style={{width:'100%',paddingLeft:10}}
                  contentContainerStyle={{gap:10,width:'95%'}}
                  data={models}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                  <TouchableOpacity style={styles.DrawerTabs} onPress={()=>{props.navigation.dispatch(DrawerActions.jumpTo('ChatScreen',{"model":item}))}}>
                    <Text style={styles.DrawerTabText}>{item}</Text>
                  </TouchableOpacity>
                  )}
                />}
              
              </View>
              {/* <View><Text>Hello World!</Text></View>  */}
            </SafeAreaView>
          )

        }}
      >
        <Drawer.Screen
          name="ModelSelector"
          component={ModelSelector}
          options={({ navigation }) => ({
            title: 'Build Tools',
            headerStyle: {
              backgroundColor: 'white'
            },
            headerTitleStyle: {
              color: 'rgb(39, 39, 39)'
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 15 }}>
                <Image
                  style={{ width: 25, height: 25, marginRight: 15, tintColor: 'rgb(39, 39, 39)' }}
                  source={require("./assets/menu.png")}
                />
              </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
            drawerItemStyle: {
              display: 'none',
            }
          }}
        />
        <Drawer.Screen
          name="DocumentModel"
          component={DocumentModel}
          options={{
            headerShown: false,
            drawerItemStyle: {
              display: 'none',
            }
          }}
        />
        <Drawer.Screen
          name="URLmodel"
          component={URLmodel}
          options={{
            headerShown: false,
            drawerItemStyle: {
              display: 'none',
            }
          }}
        />
        <Drawer.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ navigation, route }) => ({
            title: route.params?.model,
            headerStyle: {
              backgroundColor: 'white'
            },
            headerTitleStyle: {
              color: 'rgb(39, 39, 39)'
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 15 }}>
                <Image
                  style={{ width: 25, height: 25, marginRight: 15, tintColor: 'rgb(39, 39, 39)' }}
                  source={require("./assets/menu.png")}
                />
              </TouchableOpacity>
            )
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#192A56',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profile: {
    width: '100%',
    height: 'auto',
    // backgroundColor:'pink',
    gap: 20,
    // alignItems:'center',
    paddingVertical: 20,
    paddingHorizontal: 15
  },
  DrawerTabs: {
    padding: 15,
    backgroundColor: 'rgba(135, 207, 235, 0.26)',
    width: '95%',
    height: 'auto',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 15
  },
  DrawerTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    height: 'auto'
  }
});

export default App;
