import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
  ScrollView,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Routes from "../../navigation/routes";
import styles from "./styles";
import { useAppSelector } from "../../hooks";

const Welcome: FC = () => {
  const fontMap = {
    "jersey-regular": require("../../assets/Jersey10-Regular.ttf"),
    "silkscreen-regular": require("../../assets/Silkscreen-Regular.ttf"),
    "silkscreen-bold": require("../../assets/Silkscreen-Bold.ttf"),
  };
  const statistics = useAppSelector((state) => state.highScore.statistics);
  const statisticsArray = Object.entries(statistics || {});
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
  const [showStats, setShowStats] = useState(false);

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const statsButtonFadeAnimation = useRef(new Animated.Value(0)).current;

  const buttonAnimationsX = useRef(
    instruments.map(() => new Animated.Value(-screenWidth))
  ).current;

  const buttonAnimationsY = useRef(
    instruments.map(() => new Animated.Value(0))
  ).current;

  const fadeIn = (callback: () => void) => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  const fadeInStatsButton = () => {
    Animated.timing(statsButtonFadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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
    ).start(() => {
      fadeInStatsButton();
    });
  };

  const slideOutButtons = (instrument: string) => {
    const selectedIndex = instruments.indexOf(instrument);
    const selectedButtonAnimation = Animated.timing(
      buttonAnimationsY[selectedIndex],
      {
        toValue: screenHeight,
        duration: 500,
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
      Animated.timing(statsButtonFadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (instrument) {
        navigation.navigate(Routes.home, { instrument });
      }
    });
  };

  useEffect(() => {
    if (fontsLoaded && isFocused) {
      buttonAnimationsX.forEach((animation) =>
        animation.setValue(-screenWidth)
      );
      buttonAnimationsY.forEach((animation) => animation.setValue(0));
      fadeAnimation.setValue(0);
      statsButtonFadeAnimation.setValue(0);
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
      buttonAnimationsY.forEach((animation) => animation.setValue(0));
      slideOutButtons(instrumentPressed);
      setInstrumentPressed(null);
    }
  }, [instrumentPressed]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePress = (instrument: string) => {
    setInstrumentPressed(instrument);
    setShowStats(false);
  };

  const calculatePercentage = (correct: number, total: number) => {
    return total > 0 ? ((correct / total) * 100).toFixed(2) : "0.00";
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/watercolor.jpg")}
        imageStyle={{ opacity: 0.3 }}
        style={{ minWidth: width, marginBottom: 15 }}
      >
        <Animated.Text style={[styles.title, { opacity: fadeAnimation }]}>
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
      {showStats ? (
        <ScrollView
          style={{
            flex: 1,
            alignSelf: "center",
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: 10,
            borderColor: "#333",
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: "#E0E0E080",
          }}
        >
          {statisticsArray.map(([note, { correct, total }]) => (
            <View
              key={note}
              style={{
                marginBottom: 10,
                width: screenWidth * 0.8,
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: "jersey-regular",
                }}
              >
                {note.replace("_sharp", "#")}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "jersey-regular" }}>
                Correct: {correct} / Total: {total}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "jersey-regular" }}>
                Percentage Correct: {calculatePercentage(correct, total)}%
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Animated.View
          style={{
            opacity: statsButtonFadeAnimation,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowStats(true)}
            style={[styles.button, { marginTop: 40, paddingVertical: 5 }]}
          >
            <Text
              style={[styles.buttonText, { padding: 5, textAlign: "center" }]}
            >
              Statistics
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {showStats && (
        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() => setShowStats(false)}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "jersey-regular",
              marginRight: 10,
            }}
          >
            Hide
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Welcome;
