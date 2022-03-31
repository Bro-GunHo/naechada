/**
 * @format
 */

import React, {Component} from 'react';
import {AppRegistry, Text, TextInput, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

//Register background handler // app closed & background 일때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  //console.log('Message handled in the background!', remoteMessage);
  //PushNotification.setApplicationIconBadgeNumber(1);
  if (Platform.OS == 'android') {
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      PushNotification.setApplicationIconBadgeNumber(number + 1);
    });
  } else {
    PushNotificationIOS.getApplicationIconBadgeNumber(function (number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number + 1);
    });
  }
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => HeadlessCheck);
