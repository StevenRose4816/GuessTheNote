import React, { FC, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
} from "react-native";
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
  const instruments = ["Violin", "Piano", "Saxophone"];
  const screenWidth = Dimensions.get("window").width;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  // setting the animated value to -screenwidth will start off screen (left of screen)
  const buttonAnimations = useRef(
    instruments.map(() => new Animated.Value(-screenWidth))
  ).current;

  const fadeIn = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(callback);
  };

  const slideInButtons = () => {
    Animated.stagger(
      200, // Delay between each button's animation start
      buttonAnimations.map((animation, index) => {
        return Animated.timing(animation, {
          toValue: screenWidth * 0.01,
          duration: 500,
          useNativeDriver: true,
          // delay: index * 300,
        });
      })
    ).start();
  };

  useEffect(() => {
    if (fontsLoaded) {
      fadeIn(() => {
        slideInButtons();
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const navigateToInstrument = (instrument: string) => {
    navigation.navigate(Routes.home, { instrument });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/watercolor.jpg")}
        imageStyle={{ opacity: 0.3 }}
        style={{ minWidth: width, marginBottom: 15 }}
      >
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          B# or Bb!
        </Animated.Text>
      </ImageBackground>
      <View style={styles.buttonsContainer}>
        {instruments.map((instrument, index) => (
          <Animated.View
            key={instrument}
            style={{
              transform: [{ translateX: buttonAnimations[index] }],
            }}
          >
            <TouchableOpacity
              onPress={() => navigateToInstrument(instrument)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{instrument}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default Welcome;
