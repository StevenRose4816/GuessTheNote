import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
  const isFocused = useIsFocused();
  const [fontsLoaded] = useFonts(fontMap);
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const { width } = Dimensions.get("window");
  const instruments = ["Violin", "Piano", "Saxophone"];
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [instrumentPressed, setInstrumentPressed] = useState<string | null>(
    null
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const buttonAnimationsOnEnter = useRef(
    instruments.map(() => new Animated.Value(-screenWidth))
  ).current;

  const buttonAnimationsOnExit = useRef(
    instruments.map(() => new Animated.Value(0)) // want to keep at current position initially
  ).current;

  const fadeIn = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(callback);
  };

  const slideInButtons = () => {
    Animated.stagger(
      300,
      buttonAnimationsOnEnter.map((animation) => {
        return Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        });
      })
    ).start();
  };

  const slideOutButtons = (instrument: string) => {
    Animated.stagger(
      300,
      buttonAnimationsOnExit.map((animation) => {
        return Animated.timing(animation, {
          toValue: screenHeight,
          duration: 500,
          useNativeDriver: true,
        });
      })
    ).start(() => {
      if (instrument) {
        navigation.navigate(Routes.home, { instrument });
      }
    });
  };

  useEffect(() => {
    if (fontsLoaded && isFocused) {
      // reset all animations when the screen is focused, (navigating back focuses)
      buttonAnimationsOnEnter.forEach((animation) =>
        animation.setValue(-screenWidth)
      );
      buttonAnimationsOnExit.forEach((animation) => animation.setValue(0));
      fadeAnim.setValue(0);
      fadeIn(() => {
        slideInButtons();
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (fontsLoaded) {
      fadeIn(() => {
        slideInButtons();
      });
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (instrumentPressed !== null) {
      // reset the position of buttons before sliding out
      buttonAnimationsOnExit.forEach((animation) => animation.setValue(0));
      slideOutButtons(instrumentPressed);
      setInstrumentPressed(null); // rseset the instrumentPressed state to avoid repeated triggers
    }
  }, [instrumentPressed]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePress = (instrument: string) => {
    setInstrumentPressed(instrument);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/watercolor.jpg")}
        imageStyle={{ opacity: 0.3 }}
        style={{ minWidth: width, marginBottom: 15 }}
      >
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          B# or Bb
        </Animated.Text>
      </ImageBackground>
      <View style={styles.buttonsContainer}>
        {instruments.map((instrument, index) => (
          <Animated.View
            key={instrument}
            style={{
              transform: [
                {
                  translateX: buttonAnimationsOnEnter[index],
                },
                { translateY: buttonAnimationsOnExit[index] },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => handlePress(instrument)}
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
