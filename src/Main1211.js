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

import {Container, Footer, Content} from 'native-base';
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

import Header from './Header';

function Main(props) {
  setTimeout(() => {
    SplashScreen.hide();
  }, 1000);

  const [isConnected, setIsConnected] = useState(true);
  const [isLoadong, setLoading] = useState(false);
  const [mainScreen, setMainScreen] = React.useState(true);
  const [headerUse, setHeaderUse] = React.useState(true);
  const [footerUse, setFooterUse] = React.useState(true);
  const [latitude_t, set_latitude_t] = React.useState('');
  const [longitude_t, set_longitude_t] = React.useState('');
  const [actMenu, setActMenu] = React.useState('3');
  const [actMenuUrl, setActMenuUrl] = React.useState('');
  const [loginPage, setLoginPage] = React.useState('');
  const token = props.token.token;

  React.useEffect(() => {
    InternetCheck();
    //console.log(props.token.token);
    setActMenu(props.actMenu);
    if (props.token && props.token.token) {
      //let webUrl = appConfig.siteUrl+"/bbs/login.php";
      //let webUrl = appConfig.siteUrl+"?chk_app=Y";
      let webUrl = appConfig.siteUrl + '?chk_app=Y';
      setActMenuUrl(webUrl);
    }
  }, [props.actMenu, props.token.token]);

  React.useEffect(() => {
    //requestCameraPermission();
    //requestLocationPermission();
    InternetCheck();
  }, []);

  //?????? ->  RN ?????? ??????
  const onWebViewMessage = (webview) => {
    let jsonData = JSON.parse(webview.nativeEvent.data);
    //setMainScreen(jsonData.MainScreen);
    //setHeaderUse(jsonData.HeaderMenu);
    //setFooterUse(jsonData.FooterMenu);
    //setFooterUse(webview.nativeEvent.data);

    //console.log(jsonData);
  };

  //RN -> ????????? POST ??????
  const onSendWebViewMessage = (webview) => {
    var UserData = {
      chk_app: 'Y',
      loginPage: loginPage,
      token_id: props.token.token,
    };

    webview.current.postMessage(JSON.stringify(UserData));
  };

  //?????????

  const requestCameraPermission = async () => {
    // We need to ask permission for Android only
    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '???????????? ????????? ??????',
          message: '?????????????????? ???????????? ???????????? ?????? ??????????????? ?????????.',
          buttonNegative: '??????',
          buttonPositive: '??????',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("????????? ?????? ??????");
      } else {
        // Permission Denied
        console.log('CAMERA Permission Denied');
      }
    } else {
      //console.log("????????? ?????? ??????");
    }
  };

  //????????????
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '???????????? ???????????? ??????',
          message: '?????????????????? ???????????? ??????????????? ????????? ????????? ???????????????.',
          buttonNegative: '??????',
          buttonPositive: '??????',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("???????????? ??????");
        Auth_App();
      } else {
        //console.log("???????????? ????????????");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //????????? ?????? ??????
  const InternetCheck = async () => {
    NetInfo.fetch().then((state) => {
      //console.log("Connection type", state.type); //wi-fi
      //console.log("Is connected?", state.isConnected);	//true, false
      if (state.isConnected === false) {
        //Alert.alert('???????????? ????????????\n????????? ???????????? ???????????????','', [{text: 'OK', onPress:() => BackHandler.exitApp()}] )
        setIsConnected(false);
        return false;
      } else {
        setIsConnected(true);
        return true;
      }
    });
  };

  async function Auth_App() {
    const geo_info = await Geolocation.getCurrentPosition(
      (position) => {
        console.log('position.coords', position.coords);
        const {latitude, longitude} = position.coords;
        set_latitude_t(latitude);
        set_longitude_t(longitude);
      },
      (error) => {
        //console.log('error', error);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 1000},
    );
  }

  const FuncSetMenu = (menu) => {
    let webUrl = '';

    if (menu == '1') {
      webUrl = appConfig.siteUrl + '/index.php?chk_app=Y';
    } else if (menu == '2') {
      webUrl = appConfig.siteUrl + '/shop_main.php?chk_app=Y';
    } else if (menu == '3') {
      webUrl = appConfig.siteUrl + '/bbs/board.php?chk_app=Y&bo_table=review';
    } else if (menu == '4') {
      webUrl = appConfig.siteUrl + '/mypage.php?chk_app=Y';
    } else if (menu == '5') {
      webUrl = appConfig.siteUrl + '/life_management.php?chk_app=Y';
    } else {
      //webUrl = appConfig.siteUrl+"/bbs/login.php?chk_app=Y&token_id="+token;

      webUrl = appConfig.siteUrl;
    }

    setActMenu(menu);
    setActMenuUrl(webUrl);
  };

  //console.log(mainScreen);
  //??????????????? Back ??????
  const webview = React.useRef(null);
  const onAndroidBackPress = () => {
    //console.log(webview.current.startUrl);
    var link = webview.current.startUrl;

    if (mainScreen == true) {
      Alert.alert('[??????]', '?????? ?????????????????????????', [
        {
          text: '?????????',
          onPress: () => null,
          style: 'cancel',
        },
        {text: '???', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    } else {
      if (webview.current) {
        webview.current.goBack();
        return true;
      }
      return false;
    }
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, [mainScreen]);

  const patchPostMessageFunction = function () {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = function (message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace(
        'hasOwnProperty',
        'postMessage',
      );
    };
    window.postMessage = patchedPostMessage;
  };
  const patchPostMessageJsCode =
    '(' + String(patchPostMessageFunction) + ')();';

  const onNavigationStateChange = (webview) => {
    //console.log(InternetCheck());
    InternetCheck(); //???????????? ?????? ??????

    //?????? ????????? ?????? ??????
    if (webview.url.indexOf(appConfig.siteUrl) == '-1') {
      //LinkingAndroid.openURL(webview.url);
    }

    //console.log(webview.url);
    if (
      webview.url != 'about:blank' &&
      actMenuUrl != webview.url &&
      !webview.url.startsWith('intent://')
    ) {
      setActMenu('');
      setActMenuUrl(webview.url);
    }

    /*S:??????????????? ????????????*/
    const formData = new FormData();
    formData.append('webview_url', webview.url);
    formData.append('method', 'proc_site_config');
    Axios.post(appConfig.jsonUrl, formData)
      .then(function (response) {
        if (response.data.result == 'Y') {
          var MainScreen = response.data.item[0].MainScreen;
          var HeaderMenu = response.data.item[0].HeaderMenu;
          var FooterMenu = response.data.item[0].FooterMenu;
          setMainScreen(MainScreen);
          setHeaderUse(HeaderMenu);
          setFooterUse(FooterMenu);
        } else {
          console.log('?????????????????? ????????????');
        }
      })
      .catch(function (error) {
        console.log('GET INFO : ??????????????? ??????????????? ?????????????????????');
      });
    /*E:??????????????? ????????????*/

    //?????? ??? ??????
    if (
      webview.url.startsWith('http://') ||
      webview.url.startsWith('https://') ||
      webview.url.startsWith('about:blank')
    ) {
      return true;
    }

    if (Platform.OS === 'android') {
      LinkingAndroid.canOpenURL(webview.url).then((res) => {
        if (res) {
          LinkingAndroid.openURL(webview.url);
        } else {
          //SendIntentAndroid.openChromeIntent(webview.url).then(res => {
          SendIntentAndroid.openAppWithUri(webview.url).then((res) => {
            if (!res) {
              console.log(
                '??? ????????? ??????????????????. ?????? ????????????????????? ???????????????',
              );
            } else {
              console.log('??????');
            }
          });
        }
      });
    } else {
      Linking.openURL(webview.url).catch((err) => {
        console.log('??? ????????? ??????????????????. ?????? ????????????????????? ???????????????');
      });
    }
    return false;
  };

  function onMessage(e) {
    const {data} = e.nativeEvent;
    let response = data;
    while (decodeURIComponent(response) !== response) {
      response = decodeURIComponent(response);
    }
    response = JSON.parse(response);
    //callback(response);
  }

  const home_txt = styles.Text_on;
  const store_txt = styles.Text_on;
  const review_txt = styles.Text_on;
  const mypage_txt = styles.Text_on;

  console.log(actMenuUrl);
  return (
    <Container>
      <Header
        navigation={props.navigation}
        title="??????"
        webview={webview}
        isConnected={isConnected}
        setActMenu={setActMenu}
        setActMenuUrl={setActMenuUrl}
      />

      {isConnected == true ? (
        <View style={{flex: 1}}>
          <WebView
            source={{uri: actMenuUrl}}
            originWhitelist={['*']}
            useWebKit={true}
            scrollEnabled={false}
            injectedJavaScript={patchPostMessageJsCode}
            javaScriptEnabled={true}
            startInLoadingState={true}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              onSendWebViewMessage(webview);
              setLoading(false);
            }}
            onMessage={(webview) => onWebViewMessage(webview)}
            //onMessage={onMessage}
            //onLoadEnd={webview => onSendWebViewMessage(webview)}	//RN ->WebView
            //onMessage={webview => onWebViewMessage(webview)}		//WebView -> RN
            onShouldStartLoadWithRequest={(webview) =>
              onNavigationStateChange(webview)
            } //for iOS
            //onShouldStartLoadWithRequest={event => handleNav(event)}
            onNavigationStateChange={(webview) =>
              onNavigationStateChange(webview)
            } //for Android
            ref={webview}
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
              ???????????? ????????????
            </Text>
            <Text
              style={{
                color: '#2EBAC2',
                marginTop: 5,
                fontSize: 16,
                textAlign: 'center',
              }}>
              ????????? ???????????? ?????? ????????? ?????????
            </Text>
          </View>
        </View>
      )}

      <FCM navigation={props.navigation} setActMenuUrl={setActMenuUrl}></FCM>
      {footerUse == 'false' || footerUse == '' ? (
        <Footer
          transparent
          style={{backgroundColor: '#006caa', height: 0}}></Footer>
      ) : (
        <Footer transparent style={{backgroundColor: '#ffffff', height: 60}}>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={[styles.topmenu, {flex: 1}]}
              onPress={() => FuncSetMenu('1')}>
              {actMenu == '1' ? (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu1_on.png')}
                />
              ) : (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu1_off.png')}
                />
              )}
              <Text style={[styles.Text, home_txt]}>???????????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topmenu, {flex: 1}]}
              onPress={() => {
                props.navigation.navigate('Management');
              }}>
              {actMenu == '5' ? (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu5_on.png')}
                />
              ) : (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu5_off.png')}
                />
              )}
              <Text style={[styles.Text, home_txt]}>????????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topmenu, {flex: 1}]}
              onPress={() => {
                FuncSetMenu('2');
              }}>
              {actMenu == '2' ? (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu2_on.png')}
                />
              ) : (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu2_off.png')}
                />
              )}
              <Text style={[styles.Text, review_txt]}>?????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topmenu, {flex: 1}]}
              onPress={() => {
                FuncSetMenu('3');
              }}>
              {actMenu == '3' ? (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu3_on.png')}
                />
              ) : (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu3_off.png')}
                />
              )}
              <Text style={[styles.Text, store_txt]}>???????????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topmenu, {flex: 1}]}
              onPress={() => FuncSetMenu('4')}>
              {actMenu == '4' ? (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu4_on.png')}
                />
              ) : (
                <Image
                  style={[styles.img]}
                  source={require('./img/menu4_off.png')}
                />
              )}
              <Text style={[styles.Text, mypage_txt]}>???????????????</Text>
            </TouchableOpacity>
          </View>
        </Footer>
      )}
    </Container>
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
    marginTop: Platform.OS === 'ios' ? 20 : 0,
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

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(Main);
