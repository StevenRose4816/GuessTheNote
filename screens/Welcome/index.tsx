import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { FC, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Routes from "../../navigation/routes";

const Welcome: FC = () => {
  const fontMap = {
    "jersey-regular": require("../../assets/Jersey10-Regular.ttf"),
    "silkscreen-regular": require("../../assets/Silkscreen-Regular.ttf"),
    "silkscreen-bold": require("../../assets/Silkscreen-Bold.ttf"),
  };
  const [fontsLoaded] = useFonts(fontMap);
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const { height, width } = Dimensions.get("window");

  return (
    <View style={{ flex: 1, backgroundColor: "red", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 50,
          fontFamily: "jersey-regular",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        B# or Bb!
      </Text>
      <TouchableOpacity
        // this will open up a modal to make an instrument selection, from which we go into the game.
        // for now we will go straight into game
        onPress={() => navigation.navigate(Routes.home)}
        style={{
          width: width * 0.5,
          backgroundColor: "white",
          borderRadius: 5,
          padding: 5,
        }}
      >
        <Text style={{ textAlign: "center", fontFamily: "jersey-regular" }}>
          Select your instrument
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
