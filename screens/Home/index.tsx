import React, { FC, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { setHighScore as setHighScoreAlias } from "../../store/globalStore/slice";

type Note =
  | "C"
  | "C_sharp"
  | "D"
  | "Eb"
  | "E"
  | "F"
  | "F_sharp"
  | "G"
  | "G_sharp"
  | "A"
  | "Bb"
  | "B";

const notes: Note[] = [
  "C",
  "C_sharp",
  "D",
  "Eb",
  "E",
  "F",
  "F_sharp",
  "G",
  "G_sharp",
  "A",
  "Bb",
  "B",
];

const noteFiles: Record<Note, any> = {
  C: require("../../assets/c_piano.wav"),
  C_sharp: require("../../assets/c#_piano.wav"),
  D: require("../../assets/d_piano.wav"),
  Eb: require("../../assets/eb_piano.wav"),
  E: require("../../assets/e_piano.wav"),
  F: require("../../assets/f_piano.wav"),
  F_sharp: require("../../assets/f#_piano.wav"),
  G: require("../../assets/g_piano.wav"),
  G_sharp: require("../../assets/g#_piano.wav"),
  A: require("../../assets/a_piano.wav"),
  B: require("../../assets/b_piano.wav"),
  Bb: require("../../assets/bb_piano.wav"),
};

const Home: FC = () => {
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
  const dispatch = useDispatch();

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
      setModalMessage(
        `You guessed the note ${note.replace("_sharp", "#")} correctly.`
      );
      setPlayButtonDisabled(true); // Disable the button temporarily
    } else {
      setModalTitle("Incorrect");
      setModalMessage(
        `The correct note was ${selectedNote?.replace("_sharp", "#")}.`
      );
      setPlayButtonDisabled(false); // Enable the button for the next try
    }

    setAttempts((prevAttempts) => prevAttempts + 1);
    setDisabledNotes(notes);
    setFinalCorrectNote(selectedNote);

    if (attempts + 1 >= 10) {
      if (score > highScore) {
        setHighScore(score);
        dispatch(setHighScoreAlias({ highScore: score }));
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
      source={require("../../assets/note.png")}
      style={styles.container}
      imageStyle={{ opacity: 0.1, paddingLeft: 50 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
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
          disabled={attempts >= 10 || !isNotePlayed}
          color="#007bff"
        />
        <View style={styles.noteContainer}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note}
              style={[
                styles.noteButton,
                disabledNotes.includes(note) && styles.disabledNoteButton,
              ]}
              onPress={() => handleNotePress(note)}
              disabled={disabledNotes.includes(note)}
            >
              <Text style={styles.noteButtonText}>
                {note.replace("_sharp", "#")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="Reset Game"
          onPress={resetGame}
          color="#ff0000"
          disabled={attempts >= 10}
        />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable
              onPress={handleModalClose}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Home;
