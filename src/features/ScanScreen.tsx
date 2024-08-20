import {
  Linking,
  Platform,
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FlashIcon from '../assets/images/flash.svg';
import CameraRollIcon from '../assets/images/cameraRoll.svg';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Torch from 'react-native-torch';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import colors from '../shared/colors';
const ScanScreen = () => {
  const navigation = useNavigation();
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [torch, setTorch] = useState<boolean>(false);
  const toggleFlash = () => {
    if (torch) {
      Torch.switchState(false);
      setTorch(false);
    } else {
      //NOTE: iOS fails silently, on Android, you can still call without the try/catch block and it won't cause a crash
      try {
        Torch.switchState(true);
        setTorch(true);
      } catch (e) {
        ToastAndroid.show(
          'We seem to have an issue accessing your torch',
          ToastAndroid.SHORT,
        );
      }
    }
  };

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

  const device = useCameraDevice('back');

  const codeScannedError = (title: string) =>
    Alert.alert(title, 'Please try again', [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);

  const codeScannedSuccess = (value: string) =>
    Alert.alert('Valid QR', `QR value: ${value}`, [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);

  const onCodeScanned = (codes: any) => {
    if (codes.length === 0) {
      codeScannedError('Invalid QR');
      return;
    }

    const value = codes[0]?.value;
    codeScannedSuccess(value);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned,
  });

  const onCameraError = () => {
    return;
  };

  const openGallery = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
    };
    const result = await launchImageLibrary(options);
    if (result.errorCode) {
      return;
    } else if (result.assets && result.assets.length > 0) {
      RNQRGenerator.detect({
        base64: result.assets[0].base64,
      })
        .then(detectedQRCodes => {
          const {values} = detectedQRCodes; // Array of detected QR code values. Empty if nothing found
          if (values[0].length > 0) {
            codeScannedSuccess(values[0]);
          } else {
            codeScannedError('Value not found');
          }
        })
        .catch(() => {
          codeScannedError('Can not detect QR');
        });
    }
  };

  return (
    <View style={styles.contianer}>
      {device && isCameraVisible && (
        <>
          <Camera
            style={styles.contianer}
            onError={onCameraError}
            device={device}
            isActive={true}
            enableZoomGesture={true}
            codeScanner={codeScanner}
          />
          <View style={styles.flashContainer}>
            <TouchableOpacity
              style={styles.buttonButton}
              onPress={() => toggleFlash()}>
              <FlashIcon />
            </TouchableOpacity>
            <Text>Flash</Text>
          </View>
          <View style={styles.uploadContainer}>
            <TouchableOpacity
              style={styles.buttonButton}
              onPress={() => openGallery()}>
              <CameraRollIcon />
            </TouchableOpacity>
            <Text>Upload Photo</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
  },
  uploadContainer: {
    position: 'absolute',
    bottom: 8,
    right: 48,
    rowGap: 8,
    alignItems: 'center',
  },
  flashContainer: {
    position: 'absolute',
    bottom: 8,
    left: 48,
    rowGap: 8,
    alignItems: 'center',
  },
  buttonButton: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
    borderWidth: 1,
    padding: 12,
  },
});
