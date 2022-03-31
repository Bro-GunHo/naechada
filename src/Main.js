import React, {Component, useEffect, useState, useRef} from 'react';
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
  BackHandler,
  ActivityIndicator,
  StatusBar,
  NativeModules,
  SafeAreaView,
} from 'react-native';
import {
  NavigationContainer,
  StackActions,
  useFocusEffect,
} from '@react-navigation/native';

import {Container, Content} from 'native-base';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import SendIntentAndroid from 'react-native-send-intent';
import LinkingAndroid from 'react-native-intent-linking';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {connect, useDispatch} from 'react-redux';
import Axios from 'axios';
import appConfig from '@appConfig';
import FCM from '@component/FCM';

import CusWebview from './cusWebview.js';

var resetCount = 0;

function Main(props) {
  setTimeout(() => {
    SplashScreen.hide();
  }, 4000);

  const [url, setUrl] = useState(appConfig.baseUrl + '?app_login=Y');

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.isReset)
      setUrl(appConfig.baseUrl + '?reset=' + resetCount++);
  }, [props]);

  const token = props.token.token;
  const [actMenu, setActMenu] = React.useState('');
  const [headerTitle, setHeaderTitle] = React.useState(appConfig.siteName);

  return (
    // <SafeAreaView style={{flex: 1}}>
    <CusWebview
      url={url}
      token={props.token}
      headerTitle={headerTitle}
      actMenu={actMenu}
      navigation={props.navigation}
    />
    // </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Main);
