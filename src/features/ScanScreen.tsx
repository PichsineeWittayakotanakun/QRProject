import {Linking, Platform, StyleSheet, Text, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const ScanScreen = () => {
  const navigation = useNavigation();
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const noAccessAlert = () =>
    Alert.alert(
      'No camera access',
      'Please go to the device settings page and allow app to access the camera.',
      [
        {
          text: 'OK',
          onPress: () => {
            Linking.openSettings();
            navigation.goBack();
          },
        },
      ],
    );
  const checkCameraPermission = async () => {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    const result = await check(permissionType);
    if (result === 'denied') {
      const reqResult = await request(permissionType);
      if (reqResult === 'granted') {
        checkCameraPermission();
      } else if (reqResult === 'blocked' || reqResult === 'denied') {
        noAccessAlert();
      }
    } else if (result === 'blocked') {
      noAccessAlert();
    } else if (result === 'granted') {
      setIsCameraVisible(true);
    }
  };
  useEffect(() => {
    if (isFocused) {
      checkCameraPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <View>
      <Text>ScanScreen</Text>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  modalCameraNoAccess: {
    rowGap: 16,
  },
});
