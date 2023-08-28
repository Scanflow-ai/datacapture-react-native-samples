import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import Tcon from '../screens/images/svg/icons8-tick-2.svg';
import IconClose from '../screens/images/svg/iconClose.svg';
import Fonts from './Fonts';

import AsyncStorage from '@react-native-async-storage/async-storage';
const CameraManager = NativeModules.SFScannerBarcodeModule;

const SettingScreen = ({navigation, route}: any) => {
  const {scanType} = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const [autoFlashLight, setAutoflashlight] = useState(false);
  const [autoAutoExposure, setAutoExposure] = useState(false);
  const [zoomOption, setZoomOption] = useState('');
  const [resolution, setResolution] = useState('');

  const [zoomOptionLocal, setZoomOptionLocal] = useState(false);

  const [batchInventry, setbatchInvetry] = useState([]);
  const [oneOfManydata, setOneManyData] = useState([]);

  const MyModule = NativeModules.MyModule;
  const eventEmitter = new NativeEventEmitter(MyModule);

  useEffect(() => {
    eventEmitter.addListener('onBatchScanResult', onBatchScanResultSuccess);
    eventEmitter.addListener('onOneOfManyCodeResult', onOneOfManyCodeResult);
    eventEmitter.addListener('onOneofManyCodeRemoved', onOneofManyCodeRemoved);
    eventEmitter.addListener(
      'onOneofManyCodeSelected',
      onOneofManyCodeSelected,
    );
    eventEmitter.addListener('onScanBarcodeDetection', onScanBarcodeDetection);
    eventEmitter.addListener('onScanResultFailure', onScanResultFailure);
    eventEmitter.addListener('onScanResultSuccess', onScanResultSuccess);

    return () => {
      eventEmitter.removeAllListeners('onBatchScanResult');
      eventEmitter.removeAllListeners('onOneOfManyCodeResult');
      eventEmitter.removeAllListeners('onOneofManyCodeRemoved');
      eventEmitter.removeAllListeners('onOneofManyCodeSelected');
      eventEmitter.removeAllListeners('onScanBarcodeDetection');
      eventEmitter.removeAllListeners('onScanResultFailure');

      eventEmitter.removeAllListeners('onScanResultSuccess');
    };
  });

  function onBatchScanResultSuccess(data: any) {
    if (data.length > 1) {
      setbatchInvetry(batchInventry.concat(JSON.parse(data)));
    }
  }

  function onOneOfManyCodeResult(data: any) {
    console.log('onOneOfManyCodeResult--->', data);
  }

  function onOneofManyCodeRemoved(data: any) {
    console.log('onOneofManyCodeRemoved--->', data);
  }

  function onOneofManyCodeSelected(data: any) {
    setOneManyData(oneOfManydata.concat(JSON.parse(data)));
  }

  function onScanBarcodeDetection(data: any) {
    console.log('onScanBarcodeDetection-->', data);
  }

  function onScanResultFailure(data: any) {
    console.log('onOneofManyCodeSelected--->', data);
  }

  function onScanResultSuccess(data: any) {
    console.log('data-->', data);
    return false;
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('cameraInformation');
      const {flash, exposer, zoom, resolution} = JSON.parse(jsonValue);

      if (flash !== null) {
        setAutoflashlight(Boolean(flash));
      }
      if (exposer !== null) {
        setAutoExposure(Boolean(exposer));
      }
      if (zoom !== null) {
        setZoomOption(zoom);
      }
      if (resolution !== null) {
        setResolution(resolution);
      }
    } catch (e) {
      // error reading value
    }
  };

  const autoflashlight = () => {
    setAutoflashlight(!autoFlashLight);
  };

  const autoExposure = () => {
    setAutoExposure(!autoAutoExposure);
  };

  const zoomCamera = (item: any) => {
    if (item === 'autoZoom') {
      setZoomOption('autoZoom');
    } else if (item === 'touchZoom') {
      setZoomOptionLocal(!zoomOptionLocal);
      setZoomOption('touchZoom');
    } else if (item === 'none') {
      setZoomOption('none');
    }
  };

  const cameraResolution = (item: any) => {
    if (item === 'SD_480P') {
      setResolution('SD_480P');
    } else if (item === 'HD_720P') {
      setResolution('HD_720P');
    } else if (item === 'FULL_HD_1080P') {
      setResolution('FULL_HD_1080P');
    } else if (item === 'UHD_4K') {
      setResolution('UHD_4K');
    }
  };

  const apply = () => {
    setModalVisible(false);
    let data = {
      flash: autoFlashLight,
      exposer: autoAutoExposure,
      zoom: zoomOptionLocal,
      resolution: resolution,
    };
    console.log('== dataa===', data);
    storeData(data);
    setZoomOptionLocal(!zoomOptionLocal);
  };

  const cancel = () => {
    setModalVisible(false);
  };

  const storeData = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('cameraInformation', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const applyValue = async () => {
    await CameraManager.BackPress();

    navigation.navigate('CameraScreen', {
      scanType: scanType,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.settingView}>
          <Text style={styles.settingText}>Setting</Text>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{marginRight: 20}}>
            <IconClose height={23} width={23} />
          </TouchableOpacity>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxAutoView}>
            <TouchableOpacity
              onPress={() => autoflashlight()}
              style={autoFlashLight ? styles.checkBox : styles.checkBoxenable}>
              {autoFlashLight ? <Tcon height={15} width={15} /> : null}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>Enable auto flashlight</Text>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxAutoView}>
            <TouchableOpacity
              onPress={() => autoExposure()}
              style={
                autoAutoExposure ? styles.checkBox : styles.checkBoxenable
              }>
              {autoAutoExposure ? <Tcon height={15} width={15} /> : null}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>Enable auto exposure</Text>
        </View>

        <Text style={styles.zoomOptionText}>Zoom Option</Text>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            <TouchableOpacity
              onPress={() => zoomCamera('touchZoom')}
              style={
                zoomOption === 'touchZoom'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {zoomOption === 'touchZoom' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>Enable one touch zoom</Text>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            {/* <View style={styles.checkBox} /> */}
            <TouchableOpacity
              onPress={() => zoomCamera('autoZoom')}
              style={
                zoomOption === 'autoZoom'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {zoomOption === 'autoZoom' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>Enable auto zoom</Text>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            <TouchableOpacity
              onPress={() => zoomCamera('none')}
              style={
                zoomOption === 'none'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {zoomOption === 'none' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>None</Text>
        </View>

        <Text style={styles.resulution}>Select Resolution</Text>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            {/* <View style={styles.checkBox} /> */}
            <TouchableOpacity
              onPress={() => cameraResolution('HD_720P')}
              style={
                resolution === 'HD_720P'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {resolution === 'HD_720P' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>HD - 720p</Text>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            {/* <View style={styles.checkBox} /> */}
            <TouchableOpacity
              onPress={() => cameraResolution('FULL_HD_1080P')}
              style={
                resolution === 'FULL_HD_1080P'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {resolution === 'FULL_HD_1080P' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>Full HD - 1080p</Text>
        </View>

        <View style={styles.flashView}>
          <View style={styles.selectionBoxView}>
            {/* <View style={styles.checkBox} /> */}
            <TouchableOpacity
              onPress={() => cameraResolution('UHD_4K')}
              style={
                resolution === 'UHD_4K'
                  ? styles.zomeCheckBox
                  : styles.zomeUnCheckBox
              }>
              {resolution === 'UHD_4K' ? (
                <View style={styles.checkboxEnable} />
              ) : (
                <View style={styles.checkBoxDisable} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.optionText}>4K</Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => cancel()}
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'blue',
              borderRadius: 30,
            }}>
            <Text style={{fontSize: 20, color: 'blue'}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              applyValue();
            }}
            style={{
              height: 50,
              width: 150,
              backgroundColor: 'blue',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'blue',
              borderRadius: 30,
              marginLeft: 20,
            }}>
            <Text style={{fontSize: 20, color: 'white'}}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  headers: {
    height: '50%',
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  backIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  htitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  htitleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.appfont_regular,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  bottomSheetView: {
    flex: 1,
    marginTop: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
  },
  flashView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionBoxView: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  selectionBoxAutoView: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 2,
    borderColor: 'blue',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  checkBoxenable: {
    height: 20,
    width: 20,
    borderRadius: 2,
    borderColor: 'grey',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zomeCheckBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zomeUnCheckBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 17,
    color: '#000',
    fontFamily: Fonts.appfont_regular,
  },
  settingText: {
    fontSize: 25,
    marginLeft: 10,
    // marginTop: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  settingView: {
    height: 70,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    // alignItems: 'center',
    borderBottomWidth: 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoomOptionText: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20,
    color: 'grey',
  },
  checkboxEnable: {
    backgroundColor: 'blue',
    height: 10,
    width: 10,
    borderRadius: 10,
  },
  checkBoxDisable: {
    backgroundColor: 'white',
    height: 10,
    width: 10,
    borderRadius: 10,
  },
  resulution: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20,
    color: 'grey',
  },
  qrcodeStyle: {
    fontSize: 15,
    fontFamily: Fonts.appfont_regular,
    marginLeft: 20,
    color: 'black',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  barcodeStyle: {
    fontSize: 15,
    fontFamily: Fonts.appfont_regular,
    marginLeft: 20,
    color: '#00008b',
    alignSelf: 'center',
    textDecorationLine: 'underline',
    flexWrap: 'wrap',
  },
});

export default SettingScreen;
