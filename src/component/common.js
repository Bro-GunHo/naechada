import React, { useState, useEffect } from 'react';
import{View,Text,StyleSheet,TouchableOpacity,ScrollView,Image,Dimensions,SafeAreaView,StatusBar,Alert, AsyncStorage}from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import appConfig from '@appConfig';
import Geolocation from 'react-native-geolocation-service';
import { connect, useDispatch } from 'react-redux';
import { setLocation } from '@reduxAction/locationAction';
import loginAction from '@reduxAction/loginAction';
import Axios from 'axios';
//import LocalNotification from '@component/LocalNotification';

const BannerWidth = Dimensions.get('window').width;


export function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

export function getParseDate(date){
  date = String(date).split(' ');
  var days = String(date[0]).split('-');
  var hours = String(date[1]).split(':');
  return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
}


export function LoginCheck(props){
  
  
  if(props.mb_id==null || props.mb_id ==undefined || props.mb_id == ""){

      
    Alert.alert(
      "",
      '로그인 후 이용가능합니다.',
      [
          {text: '취소'},
          {text: '로그인', onPress: () => props.navigation.navigate("LoginScreen")},
      ]
    )
  
  }
  return false;
}

export function LoginCheckBack(props){
  
  
  if(props.mb_id==null || props.mb_id ==undefined || props.mb_id == ""){

      
    Alert.alert(
      "",
      '로그인 후 이용가능합니다.',
      [
          {text: '취소', onPress: () => props.navigation.goBack()},
          {text: '로그인', onPress: () => props.navigation.navigate("LoginScreen")},
      ]
    )
  
  }
  return false;
}

export function renderPage(image, index) {
  return (
    <View key={index}>
      <Image style={{ width: BannerWidth, height: 240, resizeMode:'cover' }} source={{uri:image}} />
    </View>
  );
}
