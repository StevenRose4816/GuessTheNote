import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: "jersey-regular",
    color: "#333",
    marginBottom: 40,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "silkscreen-regular",
    fontSize: 20,
    color: "#333",
  },
});

export default styles;
