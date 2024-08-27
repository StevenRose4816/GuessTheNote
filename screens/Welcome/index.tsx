import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { FC } from "react";
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
    <View style={{ flex: 1, backgroundColor: "#FFF5E170", padding: 20 }}>
      <Text
        style={{
          fontSize: 50,
          fontFamily: "jersey-regular",
          marginTop: 20,
          marginBottom: 40,
          color: "#1A1F71",
          textAlign: "center",
        }}
      >
        B# or Bb!
      </Text>
      <View style={{ alignItems: "flex-start" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.home, { instrument: "violin" })
          }
          style={{
            width: width * 0.5,
            backgroundColor: "#2DFFFF",
            borderRadius: 5,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "jersey-regular",
              fontSize: 20,
              color: "#333333",
              textAlign: "center",
            }}
          >
            Violin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.home, { instrument: "piano" })
          }
          style={{
            width: width * 0.5,
            backgroundColor: "#2DFFFF",
            borderRadius: 5,
            padding: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "jersey-regular",
              fontSize: 20,
              color: "#333333",
              textAlign: "center",
            }}
          >
            Piano
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;
