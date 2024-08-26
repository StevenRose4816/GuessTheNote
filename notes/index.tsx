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

export const pianoNoteFiles: Record<Note, any> = {
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

export const violinNoteFiles: Record<Note, any> = {
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

export const notes: Note[] = [
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
