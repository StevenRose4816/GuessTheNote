import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5E170",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "jersey-regular",
    fontSize: 45,
    marginBottom: 5,
    textAlign: "center",
    color: "#1A1F71",
  },
  noteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: width * 0.8,
  },
  noteButton: {
    backgroundColor: "#1A1F71",
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 4,
    borderRadius: 5,
    width: width * 0.3,
    alignItems: "center",
  },
  disabledNoteButton: {
    backgroundColor: "#d3d3d3",
  },
  noteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "jersey-regular",
  },
  score: {
    fontSize: 25,
    marginVertical: 3,
    fontFamily: "jersey-regular",
    textAlign: "center",
    color: "#333333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: "jersey-regular",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "jersey-regular",
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "jersey-regular",
  },
  restartText: {
    color: "#FF2D55",
    fontFamily: "jersey-regular",
    fontSize: 25,
    textAlign: "center",
  },
  imageStyle: {
    opacity: 0.1,
  },
});

export default styles;
