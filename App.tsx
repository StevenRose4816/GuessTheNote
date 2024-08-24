import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";

type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";

const notes: Note[] = ["C", "D", "E", "F", "G", "A", "B"];

const noteFiles: Record<Note, any> = {
  C: require("./assets/c_piano.wav"),
  D: require("./assets/d_piano.wav"),
  E: require("./assets/e_piano.wav"),
  F: require("./assets/f_piano.wav"),
  G: require("./assets/g_piano.wav"),
  A: require("./assets/a_piano.wav"),
  B: require("./assets/b_piano.wav"),
};

export default function App() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [disabledNotes, setDisabledNotes] = useState<Note[]>([]);
  const [isNotePlayed, setIsNotePlayed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(false);
  const [finalGuessNote, setFinalGuessNote] = useState<Note | null>(null); // Track final guess
  const [finalCorrectNote, setFinalCorrectNote] = useState<Note | null>(null); // Track final correct note

  const playNote = async () => {
    if (attempts >= 10) {
      setModalTitle("Game Over");
      setModalMessage(
        `Your final score is ${score}. ${
          finalGuessNote === finalCorrectNote
            ? "You guessed correctly on your last attempt!"
            : `On your last attempt, you guessed ${finalGuessNote}. The correct note was ${finalCorrectNote}.`
        }`
      );
      setModalVisible(true);
      return;
    }

    if (isNotePlayed) {
      return; // Do nothing if a note is already played
    }

    // Filter out the current selectedNote from the list of notes
    const availableNotes = notes.filter((note) => note !== selectedNote);

    // Randomly select a new note from the filtered list
    const randomNote =
      availableNotes[Math.floor(Math.random() * availableNotes.length)];

    setSelectedNote(randomNote);
    setDisabledNotes([]);

    try {
      const { sound } = await Audio.Sound.createAsync(noteFiles[randomNote]);
      setSound(sound);
      await sound.playAsync();
      setIsNotePlayed(true);
      setPlayButtonDisabled(true); // Disable the button after playing a note
    } catch (error) {
      console.error("Playback error:", error);
      setModalTitle("Error");
      setModalMessage("Failed to play sound.");
      setModalVisible(true);
    }
  };

  const replayNote = async () => {
    if (!selectedNote) {
      setModalTitle("Warning");
      setModalMessage("Play a note first.");
      setModalVisible(true);
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(noteFiles[selectedNote]);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Playback error:", error);
      setModalTitle("Error");
      setModalMessage("Failed to replay sound.");
      setModalVisible(true);
    }
  };

  const guessNote = (note: Note) => {
    if (attempts >= 10) {
      setModalTitle("Game Over");
      setModalMessage(
        `Your final score is ${score}. ${
          finalGuessNote === finalCorrectNote
            ? "You guessed correctly on your last attempt!"
            : `On your last attempt, you guessed ${finalGuessNote}. The correct note was ${finalCorrectNote}.`
        }`
      );
      setModalVisible(true);
      return;
    }

    if (!isNotePlayed) {
      setModalTitle("Warning");
      setModalMessage("You need to play a note before guessing.");
      setModalVisible(true);
      return;
    }

    setFinalGuessNote(note); // Track the guessed note

    if (note === selectedNote) {
      setScore((prevScore) => prevScore + 10);
      setModalTitle("Correct!");
      setModalMessage(`You guessed the note ${note} correctly!`);
      setPlayButtonDisabled(true); // Disable the button temporarily
    } else {
      setModalTitle("Incorrect");
      setModalMessage(`The correct note was ${selectedNote}.`);
      setPlayButtonDisabled(false); // Enable the button for the next try
    }

    setAttempts((prevAttempts) => prevAttempts + 1);
    setDisabledNotes(notes);
    setFinalCorrectNote(selectedNote);

    if (attempts + 1 >= 10) {
      if (score > highScore) {
        setHighScore(score);
      }
      setModalTitle("Game Over");
      setModalMessage(
        `Your final score is ${score}. ${
          finalGuessNote === finalCorrectNote
            ? "You guessed correctly on your last attempt!"
            : `On your last attempt, you guessed ${finalGuessNote}. The correct note was ${finalCorrectNote}.`
        }`
      );
    } else {
      setIsNotePlayed(false);
      playNote(); // Ensure a new note is played after each guess
    }

    setModalVisible(true); // Show the modal regardless of guess correctness
  };

  const handleNotePress = (note: Note) => {
    if (!disabledNotes.includes(note)) {
      guessNote(note);
    }
  };

  const handleModalClose = () => {
    if (modalTitle === "Incorrect") {
      setPlayButtonDisabled(false); // Enable the "Play Note" button when the "Incorrect" modal is closed
    } else if (modalTitle === "Correct!") {
      // Enable the buttons after a correct guess
      setPlayButtonDisabled(false);
      setIsNotePlayed(false); // Allow a new note to be played
    }
    setModalVisible(false);
  };

  const resetGame = () => {
    setSelectedNote(null);
    setSound(null);
    setScore(0);
    setAttempts(0);
    setDisabledNotes([]);
    setIsNotePlayed(false);
    setModalVisible(false);
    setPlayButtonDisabled(false); // Enable the button when resetting the game
    setFinalGuessNote(null); // Reset final guess note
    setFinalCorrectNote(null); // Reset final correct note
  };

  return (
    <ImageBackground
      source={require("../GuessTheNote/assets/note.png")}
      style={styles.container}
      imageStyle={{ opacity: 0.1, paddingLeft: 50 }}
    >
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.score}>High Score: {highScore}</Text>
      <Text style={styles.score}>Attempts: {attempts}</Text>
      <Button
        title="Play Note"
        onPress={playNote}
        disabled={playButtonDisabled || attempts >= 10}
        color={playButtonDisabled ? "#d3d3d3" : "#007bff"}
      />
      <Button
        title="Replay Note"
        onPress={replayNote}
        disabled={!isNotePlayed || attempts >= 10}
      />
      {selectedNote && (
        <View style={styles.buttonContainer}>
          <Text>Guess the note:</Text>
          {notes.map((note) => (
            <TouchableOpacity
              key={note}
              style={[
                styles.noteButton,
                disabledNotes.includes(note) && styles.disabledButton,
              ]}
              onPress={() => handleNotePress(note)}
              disabled={disabledNotes.includes(note)}
            >
              <Text
                style={[
                  styles.noteText,
                  disabledNotes.includes(note) && styles.disabledText,
                ]}
              >
                {note}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (modalTitle === "Game Over") {
                  resetGame();
                } else {
                  handleModalClose();
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  noteButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  noteText: {
    color: "#fff",
    fontSize: 18,
  },
  disabledText: {
    color: "#a9a9a9",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
