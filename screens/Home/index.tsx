import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { Audio, AVPlaybackSource, AVPlaybackStatus } from "expo-av";
import styles from "./styles";
import { useDispatch } from "react-redux";
import {
  setHighScore as setHighScoreAlias,
  setStatistics as setStatisticsAlias,
} from "../../store/globalStore/slice";
import { useFonts } from "expo-font";
import Routes from "../../navigation/routes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../hooks";

export type Note =
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(false);
  const [replayButtonDisabled, setReplayButtonDisabled] =
    useState<boolean>(true);

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
  const [statistics, setStatistics] = useState<
    Record<Note, { correct: number; total: number }>
  >({
    C: { correct: 0, total: 0 },
    C_sharp: { correct: 0, total: 0 },
    D: { correct: 0, total: 0 },
    Eb: { correct: 0, total: 0 },
    E: { correct: 0, total: 0 },
    F: { correct: 0, total: 0 },
    F_sharp: { correct: 0, total: 0 },
    G: { correct: 0, total: 0 },
    G_sharp: { correct: 0, total: 0 },
    A: { correct: 0, total: 0 },
    Bb: { correct: 0, total: 0 },
    B: { correct: 0, total: 0 },
  });

  if (!fontsLoaded) {
    return null;
  }

  const violinNoteFiles: Record<Note, AVPlaybackSource> = {
    C: require("../../assets/C_violin.wav"),
    C_sharp: require("../../assets/C#_violin.wav"),
    D: require("../../assets/D_violin.wav"),
    Eb: require("../../assets/D#_violin.wav"),
    E: require("../../assets/E_violin.wav"),
    F: require("../../assets/F_violin.wav"),
    F_sharp: require("../../assets/F#_violin.wav"),
    G: require("../../assets/G_violin.wav"),
    G_sharp: require("../../assets/G#_violin.wav"),
    A: require("../../assets/A_violin.wav"),
    Bb: require("../../assets/A#_violin.wav"),
    B: require("../../assets/B_violin.wav"),
  };

  const saxNoteFiles: Record<Note, AVPlaybackSource> = {
    C: require("../../assets/C2_sax.wav"),
    C_sharp: require("../../assets/C#2_sax.wav"),
    D: require("../../assets/D2_sax.wav"),
    Eb: require("../../assets/D#2_sax.wav"),
    E: require("../../assets/E_sax.wav"),
    F: require("../../assets/F_sax.wav"),
    F_sharp: require("../../assets/F#_sax.wav"),
    G: require("../../assets/G_sax.wav"),
    G_sharp: require("../../assets/G#_sax.wav"),
    A: require("../../assets/A_sax.wav"),
    Bb: require("../../assets/Bb2_sax.wav"),
    B: require("../../assets/B_sax.wav"),
  };

  const noteFiles: Record<Note, AVPlaybackSource> = {
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
    const availableNotes = notes.filter((note) => note !== selectedNote);
    const randomNote =
      availableNotes[Math.floor(Math.random() * availableNotes.length)];

    setSelectedNote(randomNote);
    setDisabledNotes([]);
    setPlayButtonDisabled(true);

    try {
      console.log(`Playing note: ${randomNote}`);
      const { sound } = await Audio.Sound.createAsync(
        noteFilesFromParam[randomNote]
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Playback error:", error);
      showModal("Error", "Failed to play sound.");
    }
  };

  useEffect(() => {
    console.log("statistics: ", statistics);
  }, [statistics]);

  useEffect(() => {
    if (sound) {
      const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          if (status.isPlaying) {
            setReplayButtonDisabled(true);
          } else if (!status.isBuffering && !status.isPlaying) {
            setReplayButtonDisabled(false);
          }
        }
      };
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return () => {
        sound.setOnPlaybackStatusUpdate(null);
        // unload sound after using
        sound.unloadAsync();
      };
    }
  }, [sound]);

  const replayNote = async () => {
    if (!selectedNote) {
      showModal("Warning", "Play a note first.");
      return;
    }
    try {
      console.log(`Replaying note: ${selectedNote}`);
      const { sound } = await Audio.Sound.createAsync(
        noteFilesFromParam[selectedNote]
      );
      console.log("Sound object:", sound);
      setSound(sound);
      await sound.playAsync();
      setPlayButtonDisabled(true);
    } catch (error) {
      console.error("Playback error:", error);
      showModal("Error", "Failed to replay sound.");
    }
  };

  const guessNote = (note: Note) => {
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

    setStatistics((prevStats) => ({
      ...prevStats,
      [selectedNote!]: {
        ...prevStats[selectedNote!],
        correct: prevStats[selectedNote!].correct + 1,
        total: prevStats[selectedNote!].total + 1,
      },
    }));
    dispatch(setStatisticsAlias({ statistics }));
    const gameExtended = attempts + 1 >= 10 && newScore >= 100;
    const gameOver = attempts + 1 >= 10 && newScore < 100;

    if (gameExtended) {
      handlePerfectScore();
    } else if (!gameOver) {
      showModal(
        "Correct!",
        `You guessed the note ${selectedNote?.replace(
          "_sharp",
          "#"
        )} correctly.`
      );
    } else if (gameOver && newScore < highScore) {
      showModal(
        "Game Over!",
        `You guessed the note ${selectedNote?.replace(
          "_sharp",
          "#"
        )} correctly.`
      );
    } else if (gameOver && newScore > highScore) {
      setHighScore(score);
      dispatch(setHighScoreAlias({ highScore: newScore }));
      showModal(
        "Game Over!",
        `You set the new high score! Your score is ${newScore}.`
      );
    }
    setDisabledNotes(notes);
  };

  const handleIncorrectGuess = () => {
    setStatistics((prevStats) => ({
      ...prevStats,
      [selectedNote!]: {
        ...prevStats[selectedNote!],
        total: prevStats[selectedNote!].total + 1,
      },
    }));
    dispatch(setStatisticsAlias({ statistics }));
    const message = `The correct note was ${selectedNote?.replace(
      "_sharp",
      "#"
    )}.`;

    const title = attempts + 1 >= 10 ? "Game Over" : "Incorrect";
    const gameOver = attempts + 1 >= 10 && score < 100;
    const extendedGameOver = attempts + 1 >= 10 && score >= 100;

    if (gameOver || extendedGameOver) {
      const finalMessage =
        score > highScore
          ? `You set the new high score! Your score is ${score}.`
          : `Your score is ${score}.`;
      showModal(title, `${message} ${finalMessage}`);
      if (score > highScore) {
        setHighScore(score);
        dispatch(setHighScoreAlias({ highScore: score }));
      }
    } else {
      showModal(title, message);
    }
    setDisabledNotes(notes);
  };

  const handlePerfectScore = () => {
    showModal(
      "Congratulations!",
      "Perfect score! Keep playing until you make a mistake."
    );
    resetForNextRound();
  };

  const resetForNextRound = () => {
    setPlayButtonDisabled(false);
    setDisabledNotes([]);
    setSelectedNote(null);
  };

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleNotePress = (note: Note) => {
    if (!disabledNotes.includes(note)) {
      guessNote(note);
    }
  };

  const handleModalClose = () => {
    const gameOver = attempts === 10 && score < 100;
    const inExtendedPlay = attempts >= 10 && score >= 100;
    if (gameOver && !inExtendedPlay) {
      setPlayButtonDisabled(true);
      setReplayButtonDisabled(true);
    } else {
      setReplayButtonDisabled(true);
      setPlayButtonDisabled(false);
    }
    setModalVisible(false);
  };

  const restartGame = () => {
    setSelectedNote(null);
    setSound(null);
    setScore(0);
    setAttempts(0);
    setDisabledNotes([]);
    setModalVisible(false);
    setPlayButtonDisabled(false);
    setReplayButtonDisabled(true);
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

  const calculateStatistics = () => {};

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
        <TouchableOpacity onPress={playNote} disabled={playButtonDisabled}>
          <Text
            style={{
              color: playButtonDisabled ? "#007bff50" : "#007bff",
              fontFamily: "jersey-regular",
              fontSize: 25,
            }}
          >
            Play Note
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={replayNote} disabled={replayButtonDisabled}>
          <Text
            style={{
              color: replayButtonDisabled ? "#007bff50" : "#007bff",
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
                (disabledNotes.includes(note) || replayButtonDisabled) &&
                  styles.disabledNoteButton,
              ]}
              onPress={() => handleNotePress(note)}
              disabled={disabledNotes.includes(note) || replayButtonDisabled}
            >
              <Text
                style={[
                  styles.noteButtonText,
                  (disabledNotes.includes(note) || replayButtonDisabled) &&
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
