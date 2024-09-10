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

  const buttonAnimationsX = useRef(
    instruments.map(() => new Animated.Value(-screenWidth))
  ).current;

  const buttonAnimationsY = useRef(
    instruments.map(() => new Animated.Value(0))
  ).current;

  const fadeIn = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  const slideInButtons = () => {
    Animated.stagger(
      200,
      buttonAnimationsX.map((animation) => {
        return Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        });
      })
    ).start();
  };

  const slideOutButtons = (instrument: string) => {
    const selectedIndex = instruments.indexOf(instrument);
    const selectedButtonAnimation = Animated.timing(
      buttonAnimationsY[selectedIndex],
      {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }
    );

    const otherButtonsAnimations = buttonAnimationsY
      .map((animation, index) => {
        if (index !== selectedIndex) {
          return Animated.timing(animation, {
            toValue: screenHeight,
            duration: 500,
            useNativeDriver: true,
          });
        }
        return null; // return null for the selected button and then filter it out
      })
      .filter((animation) => animation !== null);

    const staggeredOtherButtonsAnimations = Animated.stagger(
      200, // delay between animations
      otherButtonsAnimations
    );

    Animated.sequence([
      selectedButtonAnimation,
      staggeredOtherButtonsAnimations,
    ]).start(() => {
      if (instrument) {
        navigation.navigate(Routes.home, { instrument });
      }
    });
  };

  useEffect(() => {
    if (fontsLoaded && isFocused) {
      buttonAnimationsX.filter((animation) => animation.setValue(-screenWidth));
      buttonAnimationsY.filter((animation) => animation.setValue(0));
      fadeAnim.setValue(0);
      fadeIn(() => {
        slideInButtons();
      });
    } else if (fontsLoaded && !isFocused) {
      fadeIn(() => {
        slideInButtons();
      });
    }
  }, [isFocused, fontsLoaded]);

  useEffect(() => {
    if (instrumentPressed !== null) {
      // reset positions before sliding out
      buttonAnimationsY.filter((animation) => animation.setValue(0));
      slideOutButtons(instrumentPressed);
      setInstrumentPressed(null);
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
                  translateX: buttonAnimationsX[index],
                },
                { translateY: buttonAnimationsY[index] },
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
