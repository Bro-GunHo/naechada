import React, { useState, useEffect } from 'react';
import {Platform, PermissionsAndroid, View} from 'react-native';
import appConfig from '@appConfig';
import Geolocation from 'react-native-geolocation-service';
import { connect, useDispatch } from 'react-redux';
import { setLocation } from '@reduxAction/locationAction';
import loginAction from '@reduxAction/loginAction';

function Location(props) {
    const [locationLoad, setLocationLoad] = useState(false);
    const dispatch = useDispatch();
    useEffect(()=>{
        if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse',
        });
        }

        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        }
        
        Geolocation.getCurrentPosition(
        (location) => {
            let userGeo = (
                ({
                    lat: location.coords.latitude,
                    lng:location.coords.longitude
                })
            );
            dispatch(setLocation(userGeo));
            setLocationLoad(true);
            
            //return true;
        },
        (error) => {
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 100000 }
        );
    },[locationLoad]);
    return (
        <View></View>
    );
}

  export default (Location);