import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "jersey-regular",
    fontSize: 48,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  score: {
    fontSize: 25,
    marginVertical: 10,
    fontFamily: "jersey-regular",
    textAlign: "center",
    color: "#333",
  },
  noteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: width * 0.8,
  },
  noteButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 10,
    width: width * 0.3,
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledNoteButton: {
    backgroundColor: "#E0E0E050",
  },
  disabledNoteButtonText: {
    color: "grey",
  },
  noteButtonText: {
    color: "#333",
    fontSize: 18,
    fontFamily: "jersey-regular",
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "jersey-regular",
    textAlign: "center",
    color: "#333",
  },
  modalMessage: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "jersey-regular",
    color: "#333",
  },
  modalCloseButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalCloseButtonText: {
    color: "#333",
    fontSize: 20,
    fontFamily: "jersey-regular",
  },
  restartText: {
    color: "#333",
    fontFamily: "jersey-regular",
    fontSize: 25,
    textAlign: "center",
    marginVertical: 5,
  },
  imageStyle: {
    opacity: 0.2,
  },
  playButton: {
    fontSize: 25,
    color: "#333",
    fontFamily: "jersey-regular",
  },
  replayButton: {
    fontSize: 25,
    color: "#333",
    fontFamily: "jersey-regular",
  },
  disabledButton: {
    color: "#d3d3d3",
  },
});

export default styles;
