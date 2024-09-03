import React, { FC, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { Audio, AVPlaybackSource } from "expo-av";
import styles from "./styles";
import { useDispatch } from "react-redux";
import { setHighScore as setHighScoreAlias } from "../../store/globalStore/slice";
import { useFonts } from "expo-font";
import Routes from "../../navigation/routes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../hooks";

type Note =
  | "C"
  // | "C_sharp"
  // | "D"
  // | "Eb"
  // | "E"
  // | "F"
  // | "F_sharp"
  // | "G"
  // | "G_sharp"
  // | "A"
  // | "Bb"
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
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const dispatch = useDispatch();
  const fontMap = {
    "jersey-regular": require("../../assets/Jersey10-Regular.ttf"),
    "silkscreen-regular": require("../../assets/Silkscreen-Regular.ttf"),
    "silkscreen-bold": require("../../assets/Silkscreen-Bold.ttf"),
  };
  const [fontsLoaded] = useFonts(fontMap);
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const highScoreRedux = useAppSelector((state) => state.highScore?.highScore);
  const route = useRoute<any>();
  const routeParams = route.params;

  if (!fontsLoaded) {
    return null;
  }

  const violinNoteFiles: Record<Note, AVPlaybackSource> = {
    C: require("../../assets/C_violin.wav"),
    // C_sharp: require("../../assets/C#_violin.wav"),
    // D: require("../../assets/D_violin.wav"),
    // Eb: require("../../assets/D#_violin.wav"),
    // E: require("../../assets/E_violin.wav"),
    // F: require("../../assets/F_violin.wav"),
    // F_sharp: require("../../assets/F#_violin.wav"),
    // G: require("../../assets/G_violin.wav"),
    // G_sharp: require("../../assets/G#_violin.wav"),
    // A: require("../../assets/A_violin.wav"),
    // Bb: require("../../assets/A#_violin.wav"),
    B: require("../../assets/B_violin.wav"),
  };

  const saxNoteFiles: Record<Note, AVPlaybackSource> = {
    C: require("../../assets/C2_sax.wav"),
    // C_sharp: require("../../assets/C#2_sax.wav"),
    // D: require("../../assets/D2_sax.wav"),
    // Eb: require("../../assets/D#2_sax.wav"),
    // E: require("../../assets/E_sax.wav"),
    // F: require("../../assets/F_sax.wav"),
    // F_sharp: require("../../assets/F#_sax.wav"),
    // G: require("../../assets/G_sax.wav"),
    // G_sharp: require("../../assets/G#_sax.wav"),
    // A: require("../../assets/A_sax.wav"),
    // Bb: require("../../assets/Bb2_sax.wav"),
    B: require("../../assets/B_sax.wav"),
  };

  const noteFiles: Record<Note, AVPlaybackSource> = {
    C: require("../../assets/c_piano.wav"),
    // C_sharp: require("../../assets/c#_piano.wav"),
    // D: require("../../assets/d_piano.wav"),
    // Eb: require("../../assets/eb_piano.wav"),
    // E: require("../../assets/e_piano.wav"),
    // F: require("../../assets/f_piano.wav"),
    // F_sharp: require("../../assets/f#_piano.wav"),
    // G: require("../../assets/g_piano.wav"),
    // G_sharp: require("../../assets/g#_piano.wav"),
    // A: require("../../assets/a_piano.wav"),
    // Bb: require("../../assets/bb_piano.wav"),
    B: require("../../assets/b_piano.wav"),
  };

  const notes: Note[] = [
    "C",
    // "C_sharp",
    // "D",
    // "Eb",
    // "E",
    // "F",
    // "F_sharp",
    // "G",
    // "G_sharp",
    // "A",
    // "Bb",
    "B",
  ];

  const noteFilesFromParam = (() => {
    switch (routeParams?.instrument) {
      case "Saxophone":
        return saxNoteFiles;
      case "Violin":
        return violinNoteFiles;
      case "Piano":
      default:
        return noteFiles;
    }
  })();

  const playNote = async () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (hasNotePlayed) {
      return;
    }
    const availableNotes = notes.filter((note) => note !== selectedNote);
    const randomNote =
      availableNotes[Math.floor(Math.random() * availableNotes.length)];
    setSelectedNote(randomNote);
    setDisabledNotes([]);
    try {
      const { sound } = await Audio.Sound.createAsync(
        noteFilesFromParam[randomNote]
      );
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
      const { sound } = await Audio.Sound.createAsync(
        noteFilesFromParam[selectedNote]
      );
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
      showModal("Warning", "You need to play a note before guessing.");
      return;
    }

    if (note === selectedNote) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess();
    }

    setAttempts((prevAttempts) => prevAttempts + 1);
    setDisabledNotes(notes);
  };

  const handleCorrectGuess = () => {
    const newScore = score + 10;
    setScore(newScore);

    if (attempts + 1 > 10 && newScore >= 100) {
      handlePerfectScore();
    } else {
      showModal(
        "Correct!",
        `You guessed the note ${selectedNote?.replace(
          "_sharp",
          "#"
        )} correctly.`
      );
      resetForNextRound();
    }
  };

  const handleIncorrectGuess = () => {
    const message = `The correct note was ${selectedNote?.replace(
      "_sharp",
      "#"
    )}.`;
    const title =
      inExtendedPlay && score > highScore ? "Game Over" : "Incorrect";

    // this case works fine.
    if (inExtendedPlay) {
      setGameEnded(true);
      const finalMessage =
        score >= 100
          ? `You set the new high score! Your score is ${score}.`
          : `Your score is ${score}.`;
      showModal(title, `${message} ${finalMessage}`);
      if (score >= 100) {
        setHighScore(score);
        dispatch(setHighScoreAlias({ highScore: score }));
      }
    } else if (!inExtendedPlay && attempts + 1 === 10) {
      // not in inExtendedPlay and attempts === 10 so we set gameEnded to true and show the modal.
      // the closeModal() contains the logic for ending the game or not.
      console.log("not in inExtendedPlay and attempts === 10");
      setGameEnded(true);
      showModal(title, message);
      return;
    } else {
      // attempts are less than 10
      console.log("attempts are less than 10");
      showModal(title, message);
      resetForNextRound();
    }
  };

  const handlePerfectScore = () => {
    setInExtendedPlay(true);
    showModal(
      "Congratulations!",
      "Perfect score! Keep playing until you make a mistake."
    );
    resetForNextRound();
  };

  const resetForNextRound = () => {
    setHasNotePlayed(false);
    setPlayButtonDisabled(false);
    playNote();
  };

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleNotePress = (note: Note) => {
    if (!disabledNotes.includes(note) && !gameEnded) {
      guessNote(note);
    }
  };

  const handleModalClose = () => {
    // this is where the problem is when the game ends at 10.
    console.log("handleModalClose()");
    if (modalTitle === "Incorrect") {
      if (gameEnded) {
        console.log("gameEnded");
        setPlayButtonDisabled(true);
      } else {
        console.log("game NOT Ended");
        setPlayButtonDisabled(false);
      }
    } else if (modalTitle === "Correct!") {
      setPlayButtonDisabled(false);
      setHasNotePlayed(false);
    }
    setModalVisible(false);
  };

  const restartGame = () => {
    setGameStarted(false);
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

  const noteSourceFromParam = (() => {
    switch (routeParams?.instrument) {
      case "Saxophone":
        return require("../../assets/watercolorsax.jpeg");
      case "Violin":
        return require("../../assets/watercolorviolin.jpg");
      case "Piano":
        return require("../../assets/watercolorpiano2.jpeg");
      default:
        return require("../../assets/watercolorpiano2.jpeg");
    }
  })();

  return (
    <ImageBackground
      source={noteSourceFromParam}
      style={styles.container}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.text}>B# or Bb!</Text>
        <Text style={styles.score}>
          Score:{" "}
          <Text style={[styles.score, { color: "#FF2D55" }]}>{score}</Text>
        </Text>
        {!highScoreRedux ? (
          <Text style={styles.score}>High Score: {highScore}</Text>
        ) : (
          <Text style={styles.score}>High Score: {highScoreRedux}</Text>
        )}
        <Text style={styles.score}>Attempts: {attempts} / 10+</Text>
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
                (disabledNotes.includes(note) || !gameStarted) &&
                  styles.disabledNoteButton,
              ]}
              onPress={() => handleNotePress(note)}
              disabled={
                disabledNotes.includes(note) || gameEnded || !gameStarted
              }
            >
              <Text
                style={[
                  styles.noteButtonText,
                  (disabledNotes.includes(note) || !gameStarted) &&
                    styles.disabledNoteButtonText,
                ]}
              >
                {note.replace("_sharp", "#")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={restartGame}>
          <Text style={styles.restartText}>Restart Game</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.welcome)}>
          <Text style={[styles.restartText, { color: "#333333" }]}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>

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
