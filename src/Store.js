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

function Store(props) {
  setTimeout(() => {
    SplashScreen.hide();
  }, 1000);

  const [actMenu, setActMenu] = React.useState('2');
  const [headerTitle, setHeaderTitle] = React.useState('스토어');
  const url = appConfig.siteUrl + '/app/sg_point.php';

  return (
    <Container>
      <CusWebview
        url={url}
        props={props}
        headerTitle={headerTitle}
        actMenu={actMenu}
        navigation={props.navigation}
      />
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Store);
