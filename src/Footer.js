import React, {Component, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';

import {
  NativeBaseProvider,
  Box,
  Center,
  HStack,
  Pressable,
  Icon,
} from 'native-base';
import Location from '@component/Location';
import {connect, useDispatch} from 'react-redux';
import appConfig from '@appConfig';
import Axios from 'axios';
import * as common from '@component/common';
import FCM from '@component/FCM';

import {
  NavigationContainer,
  StackActions,
  useFocusEffect,
} from '@react-navigation/native';

export function Footers(props) {
  const [footerUse, setFooterUse] = React.useState(true);
  const [footerName, setFooterName] = React.useState(true);
  const [selected, setSelected] = React.useState(1);
  const dispatch = useDispatch();

  const [actMenu, setActMenu] = React.useState('');
  const [actMenuUrl, setActMenuUrl] = React.useState('');

  const token = props.token.token;
  const mb_id = props.mb_id;

  const home_txt = styles.Text_on;
  const store_txt = styles.Text_on;
  const review_txt = styles.Text_on;
  const mypage_txt = styles.Text_on;

  useEffect(() => {
    console.log('footer urls', props.webViews.current.startUrl);

    if (props.webViews.current && props.webViews.current.startUrl) {
      const formData = new FormData();
      formData.append('webview_url', props.webViews.current.startUrl);
      formData.append('method', 'proc_site_config');
      Axios.post(appConfig.jsonUrl, formData)
        .then(function (response) {
          if (response.data.result == 'Y') {
            var FooterMenu = response.data.item[0].FooterMenu;
            setFooterUse(FooterMenu);
          } else {
            console.log('FOOTER: 사이트정보가 없습니다');
          }
        })
        .catch(function (error) {
          console.log(
            'GET INFO(FOOTER) : 사이트정보 가져오기에 실패하였습니다' + error,
          );
        });
      //E:사이트정보 가져오기
    }

    if (actMenu != props.actMenu) {
      console.log('props.actMenu', props.actMenu);
      setActMenu(props.actMenu);
    }
  }, [props]);

  return (
    <View>
      {/*<FCM navigation={props.navigation} setActMenuUrl={setActMenuUrl}></FCM>*/}
      {props.footerUse == 'false' || props.footerUse == '' ? (
        <View></View>
      ) : (
        <NativeBaseProvider>
          <Box
            flex={1}
            bg="white"
            safeAreaTop
            width="100%"
            maxW="300px"
            alignSelf="center">
            <Center flex={1}></Center>
            <HStack
              bg="indigo.600"
              alignItems="center"
              safeAreaBottom
              shadow={6}>
              <Pressable
                cursor="pointer"
                opacity={selected === 0 ? 1 : 0.5}
                py="3"
                flex={1}
                onPress={() => setSelected(0)}>
                <Center>
                  <Text color="white" fontSize="12">
                    Home
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                cursor="pointer"
                opacity={selected === 1 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => setSelected(1)}>
                <Center>
                  <Text color="white" fontSize="12">
                    Search
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                cursor="pointer"
                opacity={selected === 2 ? 1 : 0.6}
                py="2"
                flex={1}
                onPress={() => setSelected(2)}>
                <Center>
                  <Text color="white" fontSize="12">
                    Cart
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                cursor="pointer"
                opacity={selected === 3 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => setSelected(3)}>
                <Center>
                  <Text color="white" fontSize="12">
                    Account
                  </Text>
                </Center>
              </Pressable>
            </HStack>
          </Box>
        </NativeBaseProvider>
      )}
    </View>
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
    flex: 1,
    height: 55,
    fontSize: 13,
    color: '#5B5A5A',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  img: {
    width: 25,
    marginTop: 3,
    resizeMode: 'contain',
  },
  img2: {
    width: 100,
    height: 150,
    marginBottom: 20,
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

const mapStateToProps = state => {
  return {
    token: state.token,
    location: state.location,
    mb_id: state.login.mb_id,
    mb_name: state.login.mb_name,
    mb_hp: state.login.mb_hp,
    cu_code: state.login.cu_code,
  };
};
export default connect(mapStateToProps)(Footers);
