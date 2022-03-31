import React, {useState, useEffect} from 'react';
// import firebase from '@react-native-firebase/app';
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';
import {Text, Alert, View} from 'react-native';
import Axios from 'axios';
import appConfig from '@appConfig';

import {connect, useDispatch} from 'react-redux';
import {setToken} from '@reduxAction/tokenAction';

//IOS 권한 획득
async function requestUserPermission() {
  let authStatus = await messaging().hasPermission();
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
  if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
    authStatus = messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true,
    });
  }
}

function FCM(props) {
  const [loading, setLoading] = useState(true);
  const [pushMessageId1, setPushMessageId1] = useState('');
  const [pushMessageId2, setPushMessageId2] = useState('');
  const [pushMessageId3, setPushMessageId3] = useState('');
  const dispatch = useDispatch();

  const getData = async () => {
    await requestUserPermission();

    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken != null) {
          console.log('getToken', fcmToken);
          dispatch(setToken(fcmToken));
        }
      })
      .catch(function (error) {
        console.log('Get Token Error : ' + error);
      });
  };

  React.useEffect(() => {
    getData();

    messaging().onMessage(remoteMessage => {
      if (!pushMessageId1 && remoteMessage.messageId) {
        setPushMessageId1(remoteMessage.messageId);
        onAlert(remoteMessage);
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!pushMessageId2 && remoteMessage.messageId) {
        setPushMessageId2(remoteMessage.messageId);
        onAlert2(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!pushMessageId3 && remoteMessage) {
          setPushMessageId3(remoteMessage.messageId);
          onAlert2(remoteMessage);
        }
      });
  }, []);

  const onAlert = req => {
    Alert.alert(req.notification.title, req.notification.body, [
      //{text: '취소', onPress: () => console.log('cancel'), style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          //console.log(req.data.url);
          //props.setActMenuUrl(req.data.url);
        },
      },
    ]);
  };

  const onAlert2 = req => {
    //props.setActMenuUrl(req.data.url);
  };

  if (loading) {
    return null;
  }

  return <View></View>;
}

const mapStateToProps = state => {
  return {
    token: state.token.token,
    fcmId: state.token.fcmId,
    mb_id: state.login.mb_id,
  };
};
export default connect(mapStateToProps)(FCM);
