import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  SafeAreaView,
  useColorScheme,
  StatusBar,
} from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import { Colors } from "react-native/Libraries/NewAppScreen";
import RootNavigator from "./navigation";

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <RootNavigator />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({});
