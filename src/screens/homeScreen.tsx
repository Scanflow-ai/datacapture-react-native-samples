import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  View,
  Image,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  NativeModules,
} from "react-native";

import Qrcode from "../screens/images/svg/qrcode.svg";
import Barcode from "../screens/images/svg/barcode.svg";
import Any from "../screens/images/svg/any.svg";
import Batch_Inventry from "../screens/images/svg/batch_inventry.svg";
import One_0f_many from "../screens/images/svg/one_0f_many.svg";
import Pivot_view from "../screens/images/svg/pivot_view.svg";
import Idcard from "../screens/images/svg/idcard.svg";
import TyreScan from "../screens/images/svg/tyreScan.svg";
import Homescreen_bg from "../screens/images/svg/homescreen_bg.svg";
import Truck_icon from "../screens/images/svg/Truck_icon.svg";
import Tcon from "../screens/images/svg/icons8-tick-2.svg";
import IconClose from "../screens/images/svg/iconClose.svg";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Fonts from "./Fonts";



export const HomeScreen = ({ navigation, route }: any) => {
  const [curentScreen, setCurentscreen] = React.useState("");
  const [scanType, setScanType] = React.useState("");

  const [autoFlashLight, setAutoflashlight] = React.useState(false);
  const [autoAutoExposure, setAutoExposure] = React.useState(false);
  const [zoom, setZoom] = React.useState(false);
  const [zoomOption, setZoomOption] = React.useState("none");
  const [onTouchZoom, setOneTouchZoom] = React.useState(false);
  const [resolution, setResolution] = React.useState("FULL_HD_1080P");


  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setCurentscreen(route?.params?.screen);
      setScanType(route?.params?.scanType);
    });
    return unsubscribe;
  }, [navigation, route]);

  React.useEffect(() => {
    checkCameraPermission();
  });



  async function checkCameraPermission() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted) {
        // Camera permission granted
        console.log("Camera permission granted");
      } else {
        // Camera permission denied
        console.log("Camera permission denied");
        requestCameraPermission();
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted) {
        // Camera permission granted
        console.log("Camera permission granted");
      } else {
        // Camera permission denied
        console.log("Camera permission denied");
        requestCameraPermission();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Camera permission granted
        console.log("Camera permission granted");
      } else {
        // Camera permission denied
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Camera permission granted
        console.log("Camera permission granted");
      } else {
        // Camera permission denied
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.log(error);
    }
  }


  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cameraInformation");
      console.log("asyn data --->", jsonValue);
      const { flash, exposer, zoom, resolution, oneTouchZoom, zoomOption } =
        JSON.parse(jsonValue);

      if (jsonValue) {
        if (flash !== null) {
          setAutoflashlight(Boolean(flash));
        }
        if (exposer !== null) {
          setAutoExposure(Boolean(exposer));
        }
        if (zoom) {
          setZoom(Boolean(zoom));
          setZoomOption(zoomOption);
        }

        if (oneTouchZoom != null) {
          setOneTouchZoom(Boolean(oneTouchZoom));
          setZoomOption(zoomOption);
        }
        if (resolution !== null) {
          setResolution(resolution);
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  const apply = () => {
    let data = {
      flash: autoFlashLight,
      exposer: autoAutoExposure,
      zoom: zoom,
      oneTouchZoom: onTouchZoom,
      resolution: resolution,
      zoomOption: zoomOption,
    };

    console.log("async store data -->", data);

    storeData(data);

    navigation.navigate("DetailsScreen", {
      scanType: scanType,
      cameraConfig: data,
    });
  };

  const storeData = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("cameraInformation", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const autoflashlight = () => {
    setAutoflashlight(!autoFlashLight);
  };

  const autoExposure = () => {
    setAutoExposure(!autoAutoExposure);
  };

  const zoomCamera = (item: any) => {
    if (item === "autoZoom") {
      setZoom(!zoom);
      setZoomOption("autoZoom");
      setOneTouchZoom(false);
    } else if (item === "touchZoom") {
      setOneTouchZoom(!onTouchZoom);
      setZoom(false);
      setZoomOption("touchZoom");
    } else if (item === "none") {
      setZoom(false);
      setOneTouchZoom(false);
      setZoomOption("none");
    }
  };

  const cameraResolution = (item: any) => {
    if (item === "SD_480P") {
      setResolution("SD_480P");
    } else if (item === "HD_720P") {
      setResolution("HD_720P");
    } else if (item === "FULL_HD_1080P") {
      setResolution("FULL_HD_1080P");
    } else if (item === "UHD_4K") {
      setResolution("UHD_4K");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {curentScreen === "SettingScreen" && (
        <View style={{ flex: 1, backgroundColor:"#FFFFFF" }}>
          <View style={styles.centeredView}>
            <View style={styles.settingView}>
              <Text style={styles.settingText}>Setting</Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DetailsScreen", {
                    scanType: scanType,
                  })
                }
                style={{ marginRight: 20 }}
              >
                <IconClose height={23} width={23} />
              </TouchableOpacity>
            </View>

            <View style={styles.flashView}>
              <View style={styles.selectionBoxAutoView}>
                <TouchableOpacity
                  onPress={() => autoflashlight()}
                  style={
                    autoFlashLight ? styles.checkBox : styles.checkBoxenable
                  }
                >
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
                  }
                >
                  {autoAutoExposure ? <Tcon height={15} width={15} /> : null}
                </TouchableOpacity>
              </View>
              <Text style={styles.optionText}>Enable auto exposure</Text>
            </View>
            {scanType === "Batch Scan" ||
            scanType === "One of many code" ? null : (
              <View>
                <Text style={styles.zoomOptionText}>Zoom Option</Text>

                <View style={styles.flashView}>
                  <View style={styles.selectionBoxView}>
                    <TouchableOpacity
                      onPress={() => zoomCamera("touchZoom")}
                      style={
                        zoomOption === "touchZoom"
                          ? styles.zomeCheckBox
                          : styles.zomeUnCheckBox
                      }
                    >
                      {zoomOption === "touchZoom" ? (
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
                      onPress={() => zoomCamera("autoZoom")}
                      style={
                        zoomOption === "autoZoom"
                          ? styles.zomeCheckBox
                          : styles.zomeUnCheckBox
                      }
                    >
                      {zoomOption === "autoZoom" ? (
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
                      onPress={() => zoomCamera("none")}
                      style={
                        zoomOption === "none"
                          ? styles.zomeCheckBox
                          : styles.zomeUnCheckBox
                      }
                    >
                      {zoomOption === "none" ? (
                        <View style={styles.checkboxEnable} />
                      ) : (
                        <View style={styles.checkBoxDisable} />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.optionText}>None</Text>
                </View>
              </View>
            )}
            <Text style={styles.resulution}>Select Resolution</Text>

            <View style={styles.flashView}>
              <View style={styles.selectionBoxView}>
                {/* <View style={styles.checkBox} /> */}
                <TouchableOpacity
                  onPress={() => cameraResolution("HD_720P")}
                  style={
                    resolution === "HD_720P"
                      ? styles.zomeCheckBox
                      : styles.zomeUnCheckBox
                  }
                >
                  {resolution === "HD_720P" ? (
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
                  onPress={() => cameraResolution("FULL_HD_1080P")}
                  style={
                    resolution === "FULL_HD_1080P"
                      ? styles.zomeCheckBox
                      : styles.zomeUnCheckBox
                  }
                >
                  {resolution === "FULL_HD_1080P" ? (
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
                  onPress={() => cameraResolution("UHD_4K")}
                  style={
                    resolution === "UHD_4K"
                      ? styles.zomeCheckBox
                      : styles.zomeUnCheckBox
                  }
                >
                  {resolution === "UHD_4K" ? (
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
                width: "100%",
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("DetailsScreen", {
                    scanType: scanType,
                  });
                }}
                style={{
                  height: 50,
                  width: 150,
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#0C54C5",
                  borderRadius: 30,
                }}
              >
                <Text style={{ fontSize: 19, color: "#0C54C5", fontWeight:"700" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  apply();
                }}
                style={{
                  height: 50,
                  width: 150,
                  backgroundColor: "#0C54C5",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "blue",
                  borderRadius: 30,
                  marginLeft: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: "#E9EDF4", fontWeight:"700" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {curentScreen !== "SettingScreen" && (
        <View style={{ flex: 1, backgroundColor:"#FFFFFF" }}>
          <Homescreen_bg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 16,
              bottom: 0,
            }}
          />
          <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
            <View
              style={{
                height: 60,
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Image
                resizeMode="center"
                style={{ height: 35, width: 35, marginLeft: 20 }}
                source={require("./images/app_icon.png")}
              />
              <Text
                style={{
                  // marginLeft: 5,
                  fontSize: 23,
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: Fonts.appfont_regular,
                }}
              >
                Scanflow
              </Text>
            </View>
            <Text
              style={{
                padding: 15,
                fontSize: 18,
                color: "#313131",
                // lineHeight: 23,
                fontFamily:Fonts.appfont_light,
                fontWeight: "400" 
              }}
            >
              Scanflow is an AI Scanner on smart devices for data capture &
              workflow automation Kit that captures multiple data from Barcode,
              Qrcode, Text, IDs, Safety codes.
            </Text>
            <View
              style={{
                // height: '66%',
                marginLeft: 10,
                marginRight: 10,
                paddingBottom: 30,

                elevation: 2,
                borderRadius: 10,
                backgroundColor: "#ffffff",
              }}
            >
              <View>
                <Text
                  style={{
                    marginTop: 20,
                    marginLeft: 20,
                    marginBottom: 10,
                    color: "#313131",
                    fontStyle: "normal",
                    fontSize: 20,
                    fontWeight: "700" 

                  }}
                >
                  Select Scanner
                </Text>

                <View style={styles.firstBod}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "QR Code",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Qrcode width={150} height={40} />
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>QR Code</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Bar code",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Barcode width={150} height={40} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Barcode</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Any Scan",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Any width={150} height={40} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Any</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.firstBod}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Batch Scan",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Batch_Inventry width={150} height={40} />
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Batch/</Text>
                      <Text style={styles.textStyle}>Inventory</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "One of many code",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <One_0f_many width={150} height={40} />
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>One of many </Text>
                      <Text style={styles.textStyle}>codes</Text>

                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Pivot View",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Pivot_view width={150} height={40} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Pivot view</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.firstBod}>
                  {/* <TouchableOpacity style={styles.button}>
                    <View style={styles.imageview}>
                      <Idcard width={150} height={40} />
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>ID Card</Text>
                    </View>
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Tire VIN Scan",
                      })
                    }
                    style={styles.button}
                  >
                    <View style={styles.imageview}>
                      <TyreScan width={140} height={30} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Tyre</Text>
                      <Text style={styles.textStyle}>Scanning</Text>

                    </View>
                  </TouchableOpacity>
                  

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Horizontal Container Scanning",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Truck_icon width={140} height={30} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>
                        Horizontal Container Scanning
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Vertical Container Scanning",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                      <Truck_icon width={140} height={30} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>
                        Vertical Container Scanning
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* <View style={styles.button}></View> */}
                </View>

                <View style={styles.firstBod}>
    

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Tire DOT Scan",
                      })
                    }
                    style={styles.button}
                  >
                    <View style={styles.imageview}>
                      <TyreScan width={140} height={30} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>Dot</Text>
                      <Text style={styles.textStyle}>Scanning</Text>

                    </View>
                  </TouchableOpacity>
                  

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Horizontal Container Scanning",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                    </View>

                    <View style={styles.textView}>
                     
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("DetailsScreen", {
                        scanType: "Vertical Container Scanning",
                      })
                    }
                  >
                    <View style={styles.imageview}>
                    </View>

                    <View style={styles.textView}>
                      
                    </View>
                  </TouchableOpacity>
                  {/* <View style={styles.button}></View> */}
                </View>
                <View style={styles.firstBod}>
                  {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('DetailsScreen', {
                        scanType: 'Vertical Container Scanning',
                      })
                    }>
                    <View style={styles.imageview}>
                      <Truck_icon width={140} height={30} />
                    </View>

                    <View style={styles.textView}>
                      <Text style={styles.textStyle}>
                        Vertical Container Scanning
                      </Text>
                    </View>
                  </TouchableOpacity> */}

                  <View style={styles.button} />
                  <View style={styles.button} />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  cameraview: {
    flex: 1,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  tinyLogo1: {
    width: 50,
    height: 20,
  },
  logo: {
    width: 66,
    height: 58,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  firstBod: {
    flexDirection: "row",
    alignItems: "center",

    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  imageview: { alignItems: "center", justifyContent: "center", marginTop: 15 },
  textView: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    height: 65,
  },
  textStyle: {
    color: "#6E6E6E",
    fontSize: 16,
    width: 120,
    textAlign: "center",
    fontWeight: "500",
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  bottomSheetView: {
    flex: 1,
    marginTop: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  item: {
    padding: 20,
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
    borderColor: "blue",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
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
    borderColor: "blue",
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
    fontSize: 18,
    color: "#0F0E13",
    fontWeight:"400",

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
    backgroundColor: "blue",
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
    color: "black",
    alignSelf: "center",
    flexWrap: "wrap",
  },
  barcodeStyle: {
    fontSize: 15,
    fontFamily: Fonts.appfont_regular,
    marginLeft: 20,
    color: "#00008b",
    alignSelf: "center",
    textDecorationLine: "underline",
    flexWrap: "wrap",
  },
});
