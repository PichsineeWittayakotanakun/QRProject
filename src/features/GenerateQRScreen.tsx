import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../shared/colors';
import QRCode from 'react-native-qrcode-svg';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const GenerateQRScreen = () => {
  const [value, setValue] = useState<string>('Hello world!');
  const [qrValue, setQrValue] = useState<string>(value);
  const buttonDisable = value.length === 0;
  const viewShotRef = useRef<ViewShot>(null);
  const [permissionToggle, setPermissionToggle] = useState<number>(0);
  const noAccessAlert = () =>
    Alert.alert(
      'No camera access',
      'Please go to the device settings page and allow app to access save to gallery.',
      [
        {
          text: 'OK',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
    );
  const saveToAlbumSuccess = () =>
    Alert.alert('Success!', 'Save to album success', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  const saveToAlbumFail = () =>
    Alert.alert('Fail!', 'Save to album fail', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);

  const checkCameraPermission = async () => {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    const result = await check(permissionType);
    if (result === 'denied') {
      const reqResult = await request(permissionType);
      if (reqResult === 'granted') {
        setPermissionToggle(permissionToggle + 1);
      } else if (reqResult === 'blocked' || reqResult === 'denied') {
        noAccessAlert();
      }
    } else if (result === 'blocked') {
      noAccessAlert();
    } else if (result === 'granted') {
      captureQRCode();
    }
  };

  useEffect(() => {
    if (permissionToggle > 0) {
      checkCameraPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionToggle]);

  const captureQRCode = () => {
    setTimeout(() => {
      try {
        if (viewShotRef.current && viewShotRef.current.capture) {
          viewShotRef.current
            .capture()
            .then(async (uri: string) => {
              await CameraRoll.saveAsset(uri, {type: 'photo'});
            })
            .then(() => {
              saveToAlbumSuccess();
            });
        } else {
          saveToAlbumFail();
        }
      } catch (error) {
        saveToAlbumFail();
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} style={styles.scrollviewContainer}>
        <View style={styles.contentContainer}>
          <TextInput
            value={value}
            onChangeText={text => setValue(text)}
            placeholder="QR code value"
            style={styles.textInputContainer}
          />
          {buttonDisable ? (
            <TouchableOpacity
              style={styles.buttonDisableContainer}
              disabled={true}>
              <Text style={styles.buttonTextDisable}>Generate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setQrValue(value)}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
          )}
          <ViewShot ref={viewShotRef} options={{format: 'png', quality: 0.9}}>
            <View style={styles.qrContainer}>
              <QRCode value={qrValue} ecl="H" quietZone={10} size={200} />
            </View>
          </ViewShot>
          <Text style={styles.qrValueText}>{`QR value : ${qrValue}`}</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              checkCameraPermission();
            }}>
            <Text style={styles.buttonText}>Save QR Image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenerateQRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewContainer: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    rowGap: 16,
  },
  textInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDisableContainer: {
    backgroundColor: colors.disable,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.white,
  },
  buttonTextDisable: {
    color: colors.white,
  },
  qrContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    alignSelf: 'center',
  },
  qrValueText: {
    textAlign: 'center',
  },
});
