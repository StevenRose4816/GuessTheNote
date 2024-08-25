import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#FF6F6150",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontFamily: "jersey-regular",
    fontSize: 60,
    marginBottom: 10,
  },
  noteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: width * 0.9,
  },
  noteButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 5,
    width: width * 0.3,
    alignItems: "center",
  },
  disabledNoteButton: {
    backgroundColor: "#d3d3d3",
  },
  noteButtonText: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "jersey-regular",
  },
  score: {
    fontSize: 25,
    marginVertical: 5,
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
  },
  modalTitle: {
    fontSize: 30,
    marginBottom: 10,
    fontFamily: "jersey-regular",
  },
  modalMessage: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "jersey-regular",
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "jersey-regular",
  },
});

export default styles;
