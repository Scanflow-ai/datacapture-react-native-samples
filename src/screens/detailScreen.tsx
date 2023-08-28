import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Modal,
  NativeEventEmitter,
  PermissionsAndroid,
  FlatList,
  BackHandler,
  ToastAndroid,
  Image,
  AppState,
} from "react-native";
import { DatacaptureBarcodeView } from "scanflow-react-native-barcode";
import { DatacaptureTextView } from "scanflow-react-native-text";
import Back_icon from "../screens/images/svg/ic_back_icon.svg";
import Svg_copy from "../screens/images/svg/svg_copy.svg";

import Clipboard from "@react-native-clipboard/clipboard";
import Fonts from "./Fonts";

import Svg_pivot_view_center_line from "../screens/images/svg/svg_pivot_view_center_line.svg";

import Settings from "../screens/images/svg/ic_settings.svg";

// import {useNavigation} from '@react-navigation/native';

import AsyncStorage from "@react-native-async-storage/async-storage";
const CameraManager = NativeModules.SFScannerBarcodeModule;
const CameraManagerText = NativeModules.SFScannerTextModule;

const DetailsScreen = ({ navigation, route }: any) => {
  // const navigation = useNavigation();

  const { scanType } = route.params;

  const [batchBottomSheetVisible, setBatchBottomSheetVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [autoFlashLight, setAutoflashlight] = useState(false);
  const [autoAutoExposure, setAutoExposure] = useState(false);
  const [zoomOption, setZoomOption] = useState(false);
  const [resolution, setResolution] = useState("FULL_HD_1080P");

  const [oneTouch, setOneTouch] = useState(false);

  const [allData, setAllData] = useState({});
  const [scanDetection, setScanDetection] = useState(false);
  const [batchInventry, setbatchInvetry] = useState<string[]>([]);
  const [oneOfManydata, setOneManyData] = useState<string[]>([]);

  const [textImage, setTextImage] = useState("");

  const MyModule = NativeModules.MyModule;
  const eventEmitter = new NativeEventEmitter(MyModule);

  useEffect(() => {
    eventEmitter.addListener("onBatchScanResult", onBatchScanResultSuccess);
    eventEmitter.addListener("onOneOfManyCodeResult", onOneOfManyCodeResult);
    eventEmitter.addListener("onOneofManyCodeRemoved", onOneofManyCodeRemoved);
    eventEmitter.addListener(
      "onOneofManyCodeSelected",
      onOneofManyCodeSelected
    );
    eventEmitter.addListener("onScanBarcodeDetection", onScanBarcodeDetection);
    eventEmitter.addListener("onScanResultFailure", onScanResultFailure);
    eventEmitter.addListener("onScanResultSuccess", onScanResultSuccess);
    eventEmitter.addListener("onScanImageResult", onScanImageResult);

    return () => {
      eventEmitter.removeAllListeners("onBatchScanResult");
      eventEmitter.removeAllListeners("onOneOfManyCodeResult");
      eventEmitter.removeAllListeners("onOneofManyCodeRemoved");
      eventEmitter.removeAllListeners("onOneofManyCodeSelected");
      eventEmitter.removeAllListeners("onScanBarcodeDetection");
      eventEmitter.removeAllListeners("onScanResultFailure");

      eventEmitter.removeAllListeners("onScanResultSuccess");
      eventEmitter.removeAllListeners("onScanImageResult");
    };
  });

  useMemo(() => {
    CameraManager.BackPress();
    CameraManagerText.BackPress();
  }, []);

  useEffect(() => {
    if (route?.params?.cameraConfig?.zoom) {
      setZoomOption(true);
    } else {
      setZoomOption(false);
    }

    if (route?.params?.cameraConfig?.flash) {
      setAutoflashlight(true);
    } else {
      setAutoflashlight(false);
    }

    if (route?.params?.cameraConfig?.exposer) {
      setAutoExposure(true);
    } else {
      setAutoExposure(false);
    }
    setResolution(route?.params?.cameraConfig?.resolution);
  }, [route]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  function handleBackButtonClick() {
    CameraManager.BackPress();
    CameraManagerText.BackPress();
    navigation.navigate("HomeScreen", { scanType: scanType, screen: "" });

    return true;
  }

  function onBatchScanResultSuccess(arrays: any) {
    setbatchInvetry(JSON.parse(arrays));
    ToastAndroid.show(
      "no of scanned : " + batchInventry.length,
      ToastAndroid.SHORT
    );
  }

  function onOneOfManyCodeResult(data: any) {
    setOneManyData(JSON.parse(data));
    ToastAndroid.show(
      "no of scanned : " + oneOfManydata.length,
      ToastAndroid.SHORT
    );
  }

  function onOneofManyCodeRemoved(data: any) {
    console.log("onOneofManyCodeRemoved--->", data);
  }

  function onOneofManyCodeSelected(data: any) {
    console.log("one of many --->", data);
  }

  function onScanBarcodeDetection(data: any) {
    setScanDetection(data);
  }

  function onScanResultFailure(data: any) {
    ToastAndroid.show(
      "scan failed, Please move closer to the container",
      ToastAndroid.SHORT
    );
  }

  function onScanResultSuccess(data: any) {
    setAllData(JSON.parse(data));
    // return false;
  }

  function onScanImageResult(Image: any) {
    setTextImage(Image);
  }

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cameraInformation");
      const { flash, exposer, zoom, resolution, oneTouchZoom, zoomOption } =
        JSON.parse(jsonValue);

      if (flash !== null) {
        setAutoflashlight(Boolean(flash));
      }
      if (exposer !== null) {
        setAutoExposure(Boolean(exposer));
      }
      if (zoom != null) {
        setZoomOption(Boolean(zoom));
      }

      if (oneTouchZoom != null) {
        setOneTouch(Boolean(oneTouchZoom));
      }
      if (resolution !== null) {
        setResolution(resolution);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (Object.keys(allData).length > 0) {
      if (scanType !== "Batch Scan" || scanType !== "One of many code") {
        setBottomSheetVisible(true);
      }
    }
  }, [allData, scanType]);

  useEffect(() => {
    console.log("close event ", scanDetection);

    if (scanDetection === false) {
      setTimeout(
        function () {
          setBottomSheetVisible(false);
        }.bind(this),
        1000
      );
    }
  }, [scanDetection]);

  const goBack = async () => {
    await CameraManager.BackPress();
    await CameraManagerText.BackPress();
    navigation.navigate("HomeScreen", {
      scanType: scanType,
      screen: "",
    });
  };

  const onPressSetting = async () => {
    CameraManager.BackPress();
    CameraManagerText.BackPress();

    navigation.navigate("HomeScreen", {
      scanType: scanType,
      screen: "SettingScreen",
    });
  };

  const renderData = (item: any) => {
    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 18,
              fontFamily: Fonts.appfont_regular,
              marginLeft: 40,
              color: "#0F0E13",
            }}
          >
            {item?.text || item?.decodedValue}
          </Text>
        </View>

        <View style={{ height: 30, width: 70 }}>
          <Svg_copy />
        </View>
      </View>
    );
  };

  const header = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backIcon}>
          <Back_icon />
        </TouchableOpacity>
        <View style={styles.htitle}>
          <Text style={styles.htitleText}>
            {scanType === "Horizontal Container Scanning" ||
            scanType === "Vertical Container Scanning"
              ? "Container Scan"
              : scanType}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onPressSetting()}
          style={styles.setting}
        >
          <Settings width={29} />
        </TouchableOpacity>
      </View>
    );
  };

  const centerIcon = () => {
    return (
      <View
        style={{
          height: "2%",
          width: "100%",
          right: 0,
          left: "3%",
          top: "52%",
          position: "absolute",
          zIndex: 1,
          marginRight: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg_pivot_view_center_line width={"100%"} height={28} />
      </View>
    );
  };

  const dataCaptureTest = () => {
    return (
      <DatacaptureTextView
        LicenseKey={"597ad4cadeaa3a3533b8ff1a69eb606ce1f18417"}
        isBeepSound={true}
        isScanType={scanType}
        isVibrartion={true}
        isAutoFlashlight={autoFlashLight}
        isAutoExposure={autoAutoExposure}
        isContinuousScan={true}
        isAutoZoom={
          scanType === "Batch Scan" || scanType === "One of many code"
            ? false
            : zoomOption
        }
        setCameraResolution={resolution}
        oneTouchZoom={oneTouch}
      />
    );
  };

  const dataCaptureBarcode = () => {
    return (
      <DatacaptureBarcodeView
        LicenseKey={"597ad4cadeaa3a3533b8ff1a69eb606ce1f18417"}
        isBeepSound={true}
        isScanType={scanType}
        isVibrartion={true}
        isAutoFlashlight={autoFlashLight}
        isAutoExposure={autoAutoExposure}
        isContinuousScan={true}
        isAutoZoom={
          scanType === "Batch Scan" || scanType === "One of many code"
            ? false
            : zoomOption
        }
        setCameraResolution={resolution}
        oneTouchZoom={oneTouch}
      />
    );
  };
  return (
    <View style={styles.container}>
      {header()}
      {scanType === "Pivot View" && centerIcon()}
      {scanType === "Horizontal Container Scanning" ||
      scanType === "Vertical Container Scanning" ||
      scanType === "Tire VIN Scan" ||
      scanType === "Tire DOT Scan"
        ? dataCaptureTest()
        : dataCaptureBarcode()}
      {oneOfManydata.length > 0 && (
        <TouchableOpacity
          onPress={() => setBatchBottomSheetVisible(true)}
          style={{
            height: "6%",
            width: "85%",
            right: 0,
            left: "7%",
            top: "93%",
            position: "absolute",
            zIndex: 1,
            marginRight: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0C54C5",
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: Fonts.appfont_regular,
            }}
          >
            See Details
          </Text>
        </TouchableOpacity>
      )}

      {batchInventry.length > 0 && (
        <TouchableOpacity
          onPress={() => setBatchBottomSheetVisible(true)}
          style={{
            height: "6%",
            width: "85%",
            right: 0,
            left: "7%",

            top: "93%",
            position: "absolute",
            zIndex: 1,
            marginRight: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0C54C5",
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: Fonts.appfont_regular,
            }}
          >
            See Details
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={bottomSheetVisible}
        onRequestClose={() => {
          setBottomSheetVisible(false);
        }}
      >
        <View style={styles.bottomSheetView}>
          <View
            style={{
              height:
                scanType == "Vertical Container Scanning"
                  ? 270
                  : scanType == "TYRE_NUMBER"
                  ? 180
                  : 140,
              width: "100%",
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: "center",
              justifyContent: "center",

              // flexDirection: 'row',
            }}
          >
            <View
              style={{
                height:
                  scanType == "Horizontal Container Scanning" ? "30%" : "10%",
                width: "100%",
                alignItems: "center",
                // justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "80%" }}>
                <View
                  style={{
                    height: 50,
                    marginLeft: 10,
                    alignContent: "flex-start",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Text
                    selectable={true}
                    numberOfLines={2}
                    style={
                      scanType === "Bar code" || scanType === "Any Scan"
                        ? styles.barcodeStyle
                        : styles.qrcodeStyle
                    }
                  >
                    {allData?.text}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => Clipboard.setString(allData?.text)}
                style={{ height: 30, width: 70 }}
              >
                <Svg_copy />
              </TouchableOpacity>
            </View>
            {scanType == "Vertical Container Scanning" && (
              <Image
                style={{
                  width: 80,
                  height: "70%",
                  resizeMode: "center",
                  borderWidth: 1,
                  borderColor: "red",
                  marginTop: 10,
                }}
                source={{ uri: `data:image/jpeg;base64,${textImage}` }}
              />
            )}
            {scanType == "TYRE_NUMBER" && (
              <Image
                style={{
                  width: "60%",
                  height: 40,
                  resizeMode: "center",
                  borderWidth: 1,
                  borderColor: "red",
                  marginTop: 20,
                }}
                source={{ uri: `data:image/jpeg;base64,${textImage}` }}
              />
            )}
            {scanType == "Horizontal Container Scanning" && (
              <Image
                style={{
                  width: "60%",
                  height: 55,
                  resizeMode: "center",
                  borderWidth: 1,
                  borderColor: "red",
                  marginTop: 20,
                }}
                source={{ uri: `data:image/jpeg;base64,${textImage}` }}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={batchBottomSheetVisible}
        onRequestClose={() => {
          setBatchBottomSheetVisible(!batchBottomSheetVisible);
        }}
      >
        <View style={styles.bottomSheetView}>
          <View
            style={{
              minHeight: 250,
              width: "100%",
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 7,
                borderRadius: 20,
                width: 50,
                backgroundColor: "greay",
              }}
            ></View>
            <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
              <FlatList
                // data={batchInventry}
                data={
                  scanType == "Batch Scan"
                    ? batchInventry
                    : scanType == "One of many code"
                    ? oneOfManydata
                    : null
                }
                renderItem={({ item }) => renderData(item)}
                keyExtractor={(item, index) => item.key}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetVisible(false);
                setBatchBottomSheetVisible(false);
                setbatchInvetry([]);
                setOneManyData([]);
              }}
              style={{
                height: 50,
                width: "85%",
                right: 0,

                zIndex: 1,
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0C54C5",
                borderRadius: 30,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 25,
                  fontFamily: Fonts.appfont_regular,
                }}
              >
                Scan More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "black",
    flexDirection: "row",
  },
  headers: {
    height: "50%",
    backgroundColor: "black",
    flexDirection: "row",
  },
  backIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  htitle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    flex: 1,
  },
  htitleText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Fonts.appfont_regular,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "white",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  bottomSheetView: {
    flex: 1,
    // marginTop: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  item: {
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
  },
  flashView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  selectionBoxView: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  selectionBoxAutoView: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  checkBox: {
    height: 20,
    width: 20,
    borderRadius: 2,
    borderColor: "#0C54C5",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C54C5",
  },
  checkBoxenable: {
    height: 20,
    width: 20,
    borderRadius: 2,
    borderColor: "grey",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  zomeCheckBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: "#0C54C5",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  zomeUnCheckBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 17,
    color: "#000",
    fontFamily: Fonts.appfont_regular,
  },
  settingText: {
    fontSize: 25,
    marginLeft: 10,
    // marginTop: 20,
    color: "black",
    fontWeight: "bold",
  },
  settingView: {
    height: 70,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    // alignItems: 'center',
    borderBottomWidth: 0.3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  zoomOptionText: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20,
    color: "grey",
  },
  checkboxEnable: {
    backgroundColor: "#0C54C5",
    height: 10,
    width: 10,
    borderRadius: 10,
  },
  checkBoxDisable: {
    backgroundColor: "white",
    height: 10,
    width: 10,
    borderRadius: 10,
  },
  resulution: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20,
    color: "grey",
  },
  qrcodeStyle: {
    fontSize: 15,
    fontFamily: Fonts.appfont_regular,
    marginLeft: 20,
    color: "#0C54C5",
    alignSelf: "center",
    textDecorationLine: "underline",
    flexWrap: "wrap",
  },
  barcodeStyle: {
    fontSize: 15,
    fontFamily: Fonts.appfont_regular,
    marginLeft: 20,
    color: "#0C54C5",
    textDecorationLine: "underline",
    // flexWrap: "wrap",
  },
});

export default DetailsScreen;
