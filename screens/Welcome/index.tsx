import React, { FC } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Routes from "../../navigation/routes";
import styles from "./styles";

const Welcome: FC = () => {
  const fontMap = {
    "jersey-regular": require("../../assets/Jersey10-Regular.ttf"),
    "silkscreen-regular": require("../../assets/Silkscreen-Regular.ttf"),
    "silkscreen-bold": require("../../assets/Silkscreen-Bold.ttf"),
  };

  const [fontsLoaded] = useFonts(fontMap);
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const { width } = Dimensions.get("window");

  if (!fontsLoaded) {
    return null;
  }

  const navigateToInstrument = (instrument: string) => {
    navigation.navigate(Routes.home, { instrument });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>B# or Bb!</Text>
      <View style={styles.buttonsContainer}>
        {["Violin", "Piano", "Sax"].map((instrument) => (
          <TouchableOpacity
            key={instrument}
            onPress={() => navigateToInstrument(instrument)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{instrument}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Welcome;
