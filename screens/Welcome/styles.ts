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
    alignSelf: "center",
    marginTop: 50,
    fontSize: 40,
    fontFamily: "jersey-regular",
    color: "#333",
    marginBottom: 40,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.4,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "silkscreen-regular",
    fontSize: 16,
    color: "#333",
  },
});

export default styles;
