// import * as React from 'react';

// import { StyleSheet, View } from 'react-native';
// import { DatacaptureBarcodeView } from 'react-native-datacapture-barcode';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <DatacaptureBarcodeView color="#32a852" style={styles.box} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   box: {
//     width: 60,
//     height: 60,
//     marginVertical: 20,
//   },
// });

import React from 'react';
// import {NativeModules, NativeEventEmitter, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeScreen} from './screens/homeScreen';
import DetailsScreen from './screens/detailScreen';
import SettingScreen from './screens/settingScreen';
import CameraScreen from './screens/cameraScreen';

const Auth = createNativeStackNavigator();

export default function App() {
  // const MyModule = NativeModules.MyModule;
  // const eventEmitter = new NativeEventEmitter(MyModule);
  // eventEmitter.addListener('eventName', data => {
  //   ToastAndroid.show(data, ToastAndroid.SHORT);
  // });

  return (
    <NavigationContainer>
      <Auth.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="HomeScreen">
        <Auth.Screen name="HomeScreen" component={HomeScreen} />
        <Auth.Screen name="DetailsScreen" component={DetailsScreen} />
        <Auth.Screen name="SettingScreen" component={SettingScreen} />
      </Auth.Navigator>
    </NavigationContainer>
  );
}
