import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {Header, Left, Right, Body, Title} from 'native-base';
import appConfig from '@appConfig';
import Axios from 'axios';
import * as common from '@component/common';

export function Headerr(props) {
  const [actMenu, setActMenu] = React.useState('1');
  const [actMenuUrl, setActMenuUrl] = React.useState('');
  const [headerUse, setHeaderUse] = React.useState(true);
  const [headerName, setHeaderName] = React.useState(true);
  const [headerTitle, setHeaderTitle] = React.useState('');

  useEffect(() => {
    if (props.webViews.current) {
      const formData = new FormData();
      formData.append('webview_url', props.webViews.current.startUrl);

      formData.append('method', 'proc_site_config');
      Axios.post(appConfig.jsonUrl, formData)
        .then(function (response) {
          //console.log(response.data);
          if (response.data.result == 'Y') {
            var HeaderMenu = response.data.item[0].HeaderMenu;
            var HeaderMenuName = response.data.item[0].HeaderMenuName;
            setHeaderUse(HeaderMenu);
            setHeaderName(HeaderMenuName);
          } else {
            console.log('사이트정보가 없습니다');
          }
        })
        .catch(function (error) {
          console.log(
            'GET INFO : 사이트정보 가져오기에 실패하였습니다' + error,
          );
        });
      /*E:사이트정보 가져오기*/
    }
  }, [props]);

  const page_goBack = () => {
    //Linking.openURL("carwash://card_pay");
    //Linking.openURL("carwash://");
    //Linking.openURL("cusWebview");
    webViews.current.goBack();
  };

  const onHeaderBackPress = () => {
    if (props.webViews && props.webViews.current) {
      props.webViews.current.goBack();
      return true;
    }
    return false;
  };

  const FuncSetMenu = () => {
    //let webUrl = "";
    //webUrl = appConfig.siteUrl+"/index.php?chk_app=Y";
    //props.setActMenu('1');
    //props.setActMenuUrl(webUrl);
    setActMenu('1');
    props.navigation.navigate('Main');
  };

  const FuncSetCart = () => {
    let webUrl = '';
    webUrl = appConfig.siteUrl + '/shop/cart.php?chk_app=Y';
    setActMenu('2');
    props.setActMenuUrl(webUrl);
  };

  const FuncSetSearch = () => {
    let webUrl = '';
    webUrl = appConfig.siteUrl + '/shop/search.php?chk_app=Y';
    setActMenu('2');
    props.setActMenuUrl(webUrl);
  };

  return (
    <View>
      {headerUse == 'false' || headerUse == '' ? (
        <Header
          transparent
          style={{
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#bbbbbb',
          }}>
          <StatusBar
            backgroundColor="#2EBAC2"
            barStyle="default"
            style={{backgroundColor: '#2EBAC2'}}
          />
          <Left>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              onStartShouldSetResponder={() => onHeaderBackPress(props)}>
              <Image
                style={{
                  width: 35,
                  height: 25,
                  resizeMode: 'contain',
                  marginLeft: 1,
                }}
                source={require('./img/back2.png')}
              />
            </View>
          </Left>
          <Body>
            <Title>
              <Text style={{color: '#000000', fontWeight: 'bold'}}>
                {headerName}
              </Text>
            </Title>
          </Body>
          <Right></Right>
        </Header>
      ) : (
        <Header
          transparent
          style={{
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#eeeeee',
          }}>
          <StatusBar
            backgroundColor="#2EBAC2"
            barStyle="default"
            style={{backgroundColor: '#2EBAC2'}}
          />
          <Left>
            <TouchableOpacity onPress={() => FuncSetMenu('1')}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 45,
                    height: 25,
                    resizeMode: 'contain',
                    marginLeft: 1,
                  }}
                  source={require('./img/logo.png')}
                />
              </View>
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>
              <Text
                style={{
                  color: '#2790a5',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}>
                {props.title}
              </Text>
            </Title>
          </Body>
          <Right style={{width: 90}}>
            <TouchableOpacity onPress={() => FuncSetCart('2')}>
              <View
                style={{
                  width: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 33,
                    height: 33,
                    resizeMode: 'contain',
                    marginLeft: 1,
                  }}
                  source={require('./img/cart.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => FuncSetSearch('2')}>
              <View
                style={{
                  width: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 29,
                    height: 29,
                    resizeMode: 'contain',
                    marginLeft: 1,
                  }}
                  source={require('./img/search.png')}
                />
              </View>
            </TouchableOpacity>
          </Right>
        </Header>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  plat: {
    top: 0,
    width: '100%',
    height: 60,
    paddingTop: 10,
  },
  Text_on: {
    color: '#5c71b5',
  },
  img: {
    marginTop: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: 5,
          width: 5,
        },
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export default Headerr;
