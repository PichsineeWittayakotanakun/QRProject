import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../shared/colors';
import QRCode from 'react-native-qrcode-svg';

const GenerateQRScreen = () => {
  const [value, setValue] = useState<string>('Hello world!');
  const [qrValue, setQrValue] = useState<string>(value);
  const buttonDisable = value.length === 0;
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
          <View style={styles.qrContainer}>
            <QRCode value={qrValue} ecl="H" quietZone={10} size={200} />
          </View>
          <Text style={styles.qrValueText}>{`QR value : ${qrValue}`}</Text>
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
