import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontFamily: "jersey-regular",
    fontSize: 60,
    marginBottom: 20,
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
    fontWeight: "bold",
    fontSize: 16,
  },
  score: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
