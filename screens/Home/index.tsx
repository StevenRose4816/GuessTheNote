import React, { FC, useState } from "react";
import {
  View,
  Text,
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
import { useFonts } from "expo-font";

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

const Home: FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [disabledNotes, setDisabledNotes] = useState<Note[]>([]);
  const [hasNotePlayed, setHasNotePlayed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(false);
  const [inExtendedPlay, setInExtendedPlay] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const dispatch = useDispatch();
  const fontMap = {
    "jersey-regular": require("../../assets/Jersey10-Regular.ttf"),
    "silkscreen-regular": require("../../assets/Silkscreen-Regular.ttf"),
    "silkscreen-bold": require("../../assets/Silkscreen-Bold.ttf"),
  };
  const [fontsLoaded] = useFonts(fontMap);

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
    Bb: require("../../assets/bb_piano.wav"),
    B: require("../../assets/b_piano.wav"),
  };

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

  const playNote = async () => {
    if (hasNotePlayed) {
      return;
    }
    const availableNotes = notes.filter((note) => note !== selectedNote);

    const randomNote =
      availableNotes[Math.floor(Math.random() * availableNotes.length)];

    setSelectedNote(randomNote);
    setDisabledNotes([]);

    try {
      const { sound } = await Audio.Sound.createAsync(noteFiles[randomNote]);
      setSound(sound);
      await sound.playAsync();
      setHasNotePlayed(true);
      setPlayButtonDisabled(true);
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
    if (!hasNotePlayed) {
      setModalTitle("Warning");
      setModalMessage("You need to play a note before guessing.");
      setModalVisible(true);
      return;
    }

    let newScore = score;

    if (note === selectedNote) {
      newScore += 10;
      setScore(newScore);
      setModalTitle("Correct!");
      setModalMessage(
        `You guessed the note ${note.replace("_sharp", "#")} correctly.`
      );
    } else {
      setModalTitle("Incorrect");
      setModalMessage(
        `The correct note was ${selectedNote?.replace("_sharp", "#")}.`
      );

      if (inExtendedPlay) {
        setGameEnded(true);
        setModalTitle("Game Over");
        setModalMessage(
          `The correct note was ${selectedNote?.replace(
            "_sharp",
            "#"
          )}. Your score is ${score}!`
        );
        setModalVisible(true);
      }
    }

    setAttempts((prevAttempts) => prevAttempts + 1);
    setDisabledNotes(notes);
    setModalVisible(true);

    if (attempts + 1 >= 10) {
      if (newScore >= 100) {
        if (!inExtendedPlay) {
          setModalTitle("Congratulations!");
          setModalMessage(
            "Perfect score! Keep playing until you make a mistake."
          );
          setInExtendedPlay(true);
        }
        setPlayButtonDisabled(false);
        setHasNotePlayed(false);
        playNote();
      } else {
        if (newScore > highScore) {
          setHighScore(newScore);
          dispatch(setHighScoreAlias({ highScore: newScore }));
        }
        setModalTitle("Game Over");
        setModalMessage(
          `Your final score is ${newScore}. ${
            note === selectedNote
              ? "You guessed correctly on your last attempt!"
              : `On your last attempt, you guessed ${note?.replace(
                  "_sharp",
                  "#"
                )}. The correct note was ${selectedNote?.replace(
                  "_sharp",
                  "#"
                )}.`
          }`
        );
        setPlayButtonDisabled(true);
        setGameEnded(true);
      }
    } else {
      setHasNotePlayed(false);
      setPlayButtonDisabled(false);
      playNote();
    }
  };

  const handleNotePress = (note: Note) => {
    if (!disabledNotes.includes(note) && !gameEnded) {
      guessNote(note);
    }
  };

  const handleModalClose = () => {
    if (modalTitle === "Incorrect" && gameEnded) {
      setPlayButtonDisabled(true);
    } else if (modalTitle === "Correct!") {
      setPlayButtonDisabled(false);
      setHasNotePlayed(false);
    }
    setModalVisible(false);
  };

  const resetGame = () => {
    setSelectedNote(null);
    setSound(null);
    setScore(0);
    setAttempts(0);
    setDisabledNotes([]);
    setHasNotePlayed(false);
    setModalVisible(false);
    setPlayButtonDisabled(false);
    setInExtendedPlay(false);
    setGameEnded(false);
  };
  //use silklscreen regular and make score and highscore red, one bolder than other.
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
        <Text style={styles.text}>B#, or Bb!, C?</Text>
        <Text style={styles.score}>
          Score: <Text style={[styles.score, { color: "red" }]}>{score}</Text>
        </Text>
        <Text style={styles.score}>High Score: {highScore}</Text>
        <Text style={styles.score}>Attempts: {attempts}</Text>
        <TouchableOpacity
          onPress={playNote}
          disabled={
            playButtonDisabled || gameEnded || (attempts >= 10 && score < 100)
          }
        >
          <Text
            style={{
              color: playButtonDisabled || gameEnded ? "#d3d3d3" : "#007bff",
              fontFamily: "jersey-regular",
              fontSize: 25,
            }}
          >
            Play Note
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={replayNote}
          disabled={
            gameEnded || (attempts >= 10 && score < 100) || !hasNotePlayed
          }
        >
          <Text
            style={{
              color:
                gameEnded || (attempts >= 10 && score < 100) || !hasNotePlayed
                  ? "#d3d3d3"
                  : "#007bff",
              fontFamily: "jersey-regular",
              fontSize: 25,
            }}
          >
            Replay Note
          </Text>
        </TouchableOpacity>
        <View style={styles.noteContainer}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note}
              style={[
                styles.noteButton,
                disabledNotes.includes(note) && styles.disabledNoteButton,
              ]}
              onPress={() => handleNotePress(note)}
              disabled={disabledNotes.includes(note) || gameEnded}
            >
              <Text style={styles.noteButtonText}>
                {note.replace("_sharp", "#")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={resetGame}>
          <Text
            style={{
              color: "#ff0000",
              fontFamily: "jersey-regular",
              fontSize: 25,
            }}
          >
            Restart Game
          </Text>
        </TouchableOpacity>
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
