import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/features/HomeScreen';
import GenerateQRScreen from './src/features/GenerateQRScreen';
import ScanScreen from './src/features/ScanScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Generate"
          component={GenerateQRScreen}
          options={{headerTitle: 'Generate QR Code'}}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{headerTitle: 'Scan QR Code'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
