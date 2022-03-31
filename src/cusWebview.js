import React, {Component, useEffect, useState, useRef} from 'react';
import {createAppContainer, NavigationEvents} from 'react-navigation';
import {
  Share,
  View,
  Button,
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
  Platform,
} from 'react-native';
import {
  NavigationContainer,
  StackActions,
  useFocusEffect,
} from '@react-navigation/native';

import {Container, Content, Icon} from 'native-base';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import SendIntentAndroid from 'react-native-send-intent';
import LinkingAndroid from 'react-native-intent-linking';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {connect, useDispatch} from 'react-redux';
import appConfig from '@appConfig';
import Axios from 'axios';
import * as common from '@component/common';
import FCM from '@component/FCM';

//userAgent 가져옴
import DeviceInfo from 'react-native-device-info';

import Header from './Header';
import Footer from './Footer';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CusWebview(props) {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoadong, setLoading] = useState(false);
  const [actMenu, setActMenu] = React.useState('');
  const [actMenuUrl, setActMenuUrl] = React.useState('');
  const [loginPage, setLoginPage] = React.useState(appConfig.jsonUrl);

  const [mainScreen, setMainScreen] = React.useState(true);
  const [headerUse, setHeaderUse] = React.useState(true);
  const [footerUse, setFooterUse] = React.useState(true);

  isTopBack;

  const [urls, seTurls] = React.useState(props.url);
  const webViews = React.useRef();

  const [isTopBack, setIsTopBack] = React.useState(false);

  let temp_agent =
    'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19';
  temp_agent += '';
  const [userAgent, setUserAgent] = React.useState(temp_agent);

  React.useEffect(() => {
    //requestCameraPermission();
    //requestLocationPermission();
    InternetCheck();

    //console.log('dev id', DeviceInfo.getDeviceId());

    //유저에이전트 셋팅
    // DeviceInfo.getUserAgent().then((userAgent) => {
    //   //setUserAgent(userAgent);
    //   setUserAgent(
    //     'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
    //   );
    // });
  }, []);

  React.useEffect(() => {
    if (props.url != urls) {
      console.log('change Url', props.url);
      seTurls(props.url);
    }
  }, [props.url]);

  //웹뷰 ->  RN 으로 전송
  const onWebViewMessage = datas => {
    console.log('웹뷰에서 데이터를 받습니다.');
    let jsonData = JSON.parse(datas.nativeEvent.data);
    console.log(jsonData);

    //로그인후 아이디값을 받았다면 저장한다.
    if (jsonData.type == 'login_check') {
      //console.log('token', props.token);
      webSaveToken(jsonData);
    } else if (jsonData.type == 'console') {
      console.log('@webviewLog', jsonData.log);
    } else if (jsonData.type == 'outlink') {
      console.log('@webviewLog', jsonData.url);
      const supported = Linking.canOpenURL(jsonData.url);
      if (supported) {
        Linking.openURL(jsonData.url);
      }
    }
  };

  const webSaveToken = ({mb_id}) => {
    /*S:사이트정보 가져오기*/
    const formData = new FormData();
    formData.append('mb_fcm', props.token.token);
    formData.append('method', 'proc_save_token');
    formData.append('mb_id', mb_id);
    formData.append('device', Platform.OS);

    Axios.post(appConfig.jsonUrl, formData).then(function (response) {
      if (response.data.result == 'Y') {
        console.log('토큰을 기록했습니다.', mb_id);
      } else {
        //console.log(response.data);
      }
    });

    /*E:사이트정보 가져오기*/
  };

  //RN -> 웹뷰로 POST 전송
  const onSendWebViewMessage = webViews => {
    //webViews.current.postMessage(JSON.stringify(UserData));
  };

  const page_goBack = () => {
    //Linking.openURL("carwash://card_pay");
    //Linking.openURL("carwash://");
    //Linking.openURL("cusWebview");
    webViews.current.goBack();
  };

  const page_goForward = () => {
    webViews.current.goForward();
  };
  const page_home = () => {
    webViews.current.injectJavaScript(
      "window.location.href = '/app/index.php';",
    );
  };
  const category = () => {
    webViews.current.injectJavaScript("$('#category').show();");
  };

  function onShouldStartLoadWithRequest(e) {
    let wurl = e.url;
    console.log('onShouldStartLoadWithRequest', e.url);

    if (wurl == 'http://home.naechada.com/bbs/password_lost.php') {
      Linking.openURL(wurl);
      return false;
    }

    let rs = true;
    //var SendIntentAndroid = require('react-native-send-intent');
    if (
      //!wurl.startsWith('https://wakeupearly.co.kr') &&
      //wurl.startsWith('intents://')
      !wurl.startsWith('http://') &&
      !wurl.startsWith('https://') &&
      !wurl.startsWith('javascript:')
    ) {
      console.log('@#!@#');

      wurl = wurl.replace('intents://');

      webViews.current.stopLoading();
      const supported = Linking.canOpenURL(wurl);
      if (supported) {
        Linking.openURL(wurl);
      }

      /*
      if (Platform.OS == 'android') {
        webViews.current.stopLoading();
        SendIntentAndroid.openChromeIntent(wurl).then((isOpened) => {
          if (!isOpened) {
            ToastAndroid.show('어플을 설치해주세요.', ToastAndroid.SHORT);
          }
        });
      } else {
        webViews.current.stopLoading();
        const supported = Linking.canOpenURL(wurl);
        if (supported) {
          Linking.openURL(wurl);
        } else {
          alert('어플을 설치해주세요');
        }
      }*/
      rs = false;
    }

    return rs;
  }

  //백버튼 눌렀을때도 여기로 옴
  const onNavigationStateChange = webViewState => {
    let wurl = webViewState.url;

    //if (webViewState.url == urls) return;

    console.log('onNavigationStateChange', wurl);

    //상단 백버튼
    const BackViewArray = [
      'https://nid.naver.com/oauth2.0/authorize',
      'https://accounts.kakao.com/login?',
      'https://accounts.google.com',
      'https://accounts.youtube.com/accounts/',
      'https://www.google.com/recaptcha/api2/bframe',
      'about:blank',
      'kakaotalk://',
      'https://appleid.apple.com/auth/authorize',
      'https://logins.daum.net/accounts/kakaotemptokenlogin',
    ];

    let temp = false;
    for (const v of BackViewArray) {
      if (wurl.indexOf(v) > -1) {
        temp = true;
        break;
      }
    }
    setIsTopBack(temp);

    //외부 링크일 경우 새창
    /*
		if(wurl.indexOf(appConfig.siteUrl)=="-1"){
            var str = wurl;
            var str2 = "channel.io";
            var urlResult = str.indexOf(str2);

            if(wurl != "about:blank"){
                if(urlResult == "-1"){
                    LinkingAndroid.openURL(wurl);
                }
            }
        }
        */

    setActMenu('');

    /*S:사이트정보 가져오기*/
    // const formData = new FormData();
    // formData.append('webview_url', wurl);
    // formData.append('method', 'proc_site_config');
    // Axios.post(appConfig.jsonUrl, formData)
    //   .then(function (response) {
    //     if (response.data.result == 'Y') {
    //       var MainScreen = response.data.item[0].MainScreen;
    //       var HeaderMenu = response.data.item[0].HeaderMenu;
    //       var FooterMenu = response.data.item[0].FooterMenu;
    //       console.log('사이트정보', response.data.item[0]);
    //       setMainScreen(MainScreen);
    //       setHeaderUse(HeaderMenu);
    //       setFooterUse(FooterMenu);
    //     } else {
    //       console.log('사이트정보가 없습니다');
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log('GET INFO : 사이트정보 가져오기에 실패하였습니다');
    //   });
    /*E:사이트정보 가져오기*/

    // setMainScreen(MainScreen);
    //       setHeaderUse(HeaderMenu);
    //       setFooterUse(FooterMenu);

    //IntentLauncher.startActivityAsync()
    //console.log(wurl);
    seTurls(webViewState.url);
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButton(webViewState.url),
    );
  };

  //닫기가 나와야될 페이지
  const closeArray = [
    '/app/index.php',
    '/bbs/login.php',
    '/app/user/index.php',
  ];

  //메인화면으로 이동되어야 될 페이지
  const homeArray = [
    '/app/sg_learn.php',
    '/app/sg_point.php',
    '/app/sg_mocktest.php',
    '/app/sg_myinfo.php',
  ];
  const handleBackButton = urls => {
    console.log('props.url', urls);

    //모의고사 백버튼
    if (urls.indexOf('/app/sg_test_mo.php') > -1) {
      webViews.current.postMessage(JSON.stringify({type: 'test_mo_back'}));
      return true;
    }

    //학습하기 백버튼
    if (
      urls.indexOf('/app/sg_test.php') > -1 ||
      urls.indexOf('/app/sg_test_answer.php') > -1
    ) {
      webViews.current.postMessage(JSON.stringify({type: 'test_back'}));
      return true;
    }

    //OX 문제 백버튼
    // if (
    //   urls.indexOf('/app/sg_test_ox.php') > -1 ||
    //   urls.indexOf('/app/sg_test_ox_answer.php') > -1
    // ) {
    //   webViews.current.postMessage(JSON.stringify({type: 'test_ox_back'}));
    //   return true;
    // }

    let isClose = false;
    for (const v of closeArray) {
      //console.log(v, urls.indexOf(v));
      if (urls.indexOf(v) > -1) {
        isClose = true;
        break;
      }
    }

    let isHome = false;
    for (const v of homeArray) {
      //console.log(v, urls.indexOf(v));
      if (urls.indexOf(v) > -1) {
        isHome = true;
        break;
      }
    }

    console.log('isHome', isHome);

    if (isClose) {
      Alert.alert('어플을 종료할까요?', '', [
        {text: '네', onPress: () => BackHandler.exitApp()},
        {text: '아니요'},
      ]);
    } else if (isHome) {
      //홈으로 가야되는 페이지라면 홈으로 보냄
      //console.log(props);
      //props.navigation.navigate('Main', {isReset: true});
      // props.navigation.reset({
      //   index: 0,
      //   routes: [{name: 'Main'}],
      // });
      seTurls(appConfig.homeUrl);
    } else {
      webViews.current.postMessage(
        JSON.stringify({type: 'normal_back', urls: urls}),
      );
      //webViews.current.goBack();
    }

    return true;
  };

  //인터넷 연결 확인
  const InternetCheck = async () => {
    NetInfo.fetch().then(state => {
      //console.log("Connection type", state.type); //wi-fi
      // console.log('Is connected?', state.isConnected); //true, false
      if (state.isConnected === false) {
        //Alert.alert('인터넷 연결후에 이용하세요','', [{text: 'OK', onPress:() => BackHandler.exitApp()}] )
        setIsConnected(false);
        return false;
      } else {
        setIsConnected(true);
        return true;
      }
    });
  };

  //카메라
  const requestCameraPermission = async () => {
    // We need to ask permission for Android only
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 사용',
          message:
            appConfig.siteName +
            '에서 고객님의 카메라를 사용 가능하도록 합니다.',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("카메라 사용 가능");
      } else {
        // Permission Denied
        console.log('CAMERA Permission Denied');
      }
    } else {
      //console.log("카메라 사용 가능");
    }
  };

  //위치정보
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치정보 이용',
          message:
            appConfig.siteName +
            '에서 고객님의 위치정보를 활용해 주소를 확인합니다.',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("위치정보 확인");
        Auth_App();
      } else {
        //console.log("위치정보 사용불가");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async function Auth_App() {
    const geo_info = await Geolocation.getCurrentPosition(
      position => {
        console.log('position.coords', position.coords);
        const {latitude, longitude} = position.coords;
        set_latitude_t(latitude);
        set_longitude_t(longitude);
      },
      error => {
        //console.log('error', error);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 1000},
    );
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const debugging = `
  console = new Object();
  console.log = function(log){
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'console', log: log}));
  }
  console.debug = console.log;
  console.info = console.log;
  console.warn = console.log;
  console.error = console.log;
/*
  var appbridge = function(obj){
    window.ReactNativeWebView.postMessage(JSON.stringify(obj));
  }
  */
  `;

  return (
    <SafeAreaView style={{flex: 1}}>
      {isConnected == true ? (
        <View style={{flex: 1, backgroundColor: 'red'}}>
          {isTopBack ? (
            <View style={{marginVertical: 10}}>
              <TouchableOpacity onPress={page_goBack}>
                <Image
                  source={require('../src/img/back2.png')}
                  style={{height: 30, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <WebView
            ref={webViews}
            userAgent={userAgent + ' -- naechadaApp -- ' + Platform.OS}
            source={{uri: urls}}
            onLoadEnd={webViews => {
              //onSendWebViewMessage(webViews);
              setLoading(false);
              onNavigationStateChange(webViews.nativeEvent);
            }}
            //allowsBackForwardNavigationGestures={true}

            pullToRefreshEnabled={true}
            onMessage={webViews => onWebViewMessage(webViews)}
            setSupportMultipleWindows={false}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            //onNavigationStateChange={onNavigationStateChange}
            //onNavigationStateChange={
            //(webViews) =>
            //onNavigationStateChange(webViews)
            //} //for Android
            injectedJavaScript={debugging}
            javaScriptCanOpenWindowsAutomatically={true}
            javaScriptEnabledAndroid={true}
            allowFileAccess={true}
            renderLoading={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            scalesPageToFit={false}
            originWhitelist={['*']}
          />

          {isLoadong && (
            <ActivityIndicator
              color="#009688"
              style={{
                flex: 1,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
            />
          )}
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={require('./img/wifi.png')}
            />
            <Text
              style={{
                color: '#2EBAC2',
                marginTop: 10,
                fontSize: 16,
                textAlign: 'center',
              }}>
              {appConfig.siteName} 서비스는
            </Text>
            <Text
              style={{
                color: '#2EBAC2',
                marginTop: 5,
                fontSize: 16,
                textAlign: 'center',
              }}>
              인터넷 연결후에 앱을 재시작 하세요
            </Text>
          </View>
        </View>
      )}
      {/* <Footer
        actMenu={actMenu}
        footerUse={footerUse}
        navigation={props.navigation}
        webViews={webViews}
        seTurls={seTurls}
      /> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
  },
  ActivityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topmenu: {
    width: 100,
    height: 55,
    fontSize: 13,
    color: '#5B5A5A',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  img: {
    marginTop: 0,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  img2: {
    marginTop: 0,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  Text: {
    fontSize: 11,
  },
  Text_on: {
    color: '#288FA4',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  Text_off: {
    color: '#333333',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
});
