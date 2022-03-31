import React, {Component, useEffect, useState} from 'react';
import {createAppContainer, NavigationEvents} from 'react-navigation';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import 'react-native-gesture-handler';

import {Provider, connect, useDispatch} from 'react-redux';
import initStore from './src/redux/store';

import {Root, NativeBaseProvider} from 'native-base';
import Main from './src/Main';
import Best from './src/Best';
import Management from './src/Management';
import Store from './src/Store';
import Review from './src/Review';
import Mypage from './src/Mypage';
import FCM from '@component/FCM';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const store = initStore();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Stack_Navigation(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="atobien">
      <Stack.Screen
        name="Auth"
        options={{title: '', headerTransparent: true, headerShown: false}}
        component={Main}
      />
    </Stack.Navigator>
  );
}

function Apps(props) {
  React.useEffect(() => {
    // setTimeout(() => {
    //   //SplashScreen.hide();
    // }, 2000);

    PushNotification.setApplicationIconBadgeNumber(0);
  }, []);

  return (
    <Provider store={store}>
      {/* <NativeBaseProvider> */}
      <FCM />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            cardStyle: {backgroundColor: '#fff'},
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          // mode="card"
          initialRouteName="Main">
          {/*메인 */}
          <Stack.Screen
            name="Main"
            options={{
              title: '',
              headerTransparent: true,
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
            component={Main}
          />

          {/* 학습하기 */}
          <Stack.Screen
            name="Best"
            options={{
              title: '',
              headerTransparent: true,
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
            component={Best}
          />

          {/* 마이페이지 */}
          <Stack.Screen
            name="Mypage"
            options={{
              title: '',
              headerTransparent: true,
              headerShown: false,
              animationTypeForReplace: 'pop',
            }}
            component={Mypage}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </NativeBaseProvider> */}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// 스택 네비게이터를 앱 컨데이너에 담기
export default Apps;
