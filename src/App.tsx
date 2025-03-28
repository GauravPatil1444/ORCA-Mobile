import 'react-native-gesture-handler';
import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import SplashScreen from './components/SplashScreen';
import ChatScreen from './components/ChatScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="SplashScreen"
        backBehavior="history"
        screenOptions={{
          drawerStyle: { backgroundColor: 'white' },
          drawerLabelStyle: { color: 'rgb(39, 39, 39)' }
        }}
      >
        <Drawer.Screen 
          name="SplashScreen" 
          component={SplashScreen}
          options={{
            headerShown:false,
            drawerItemStyle:{
              display:'none',
            }
          }}
         />
        <Drawer.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ navigation }) => ({
            title:'SMART',
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
  }
});

export default App;
