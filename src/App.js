import Key from "./components/Key/Key";
import Note from "./shared/Note/Note";
import styles from "./App.module.scss";
import { useEffect } from "react";
import usePitch from "./hooks/usePitch";

const note = Note();
const notes = Object.values(note.list).reduce((acc, currNote) => {
	acc[currNote.name] = { ...currNote, prev: note.prev(currNote), next: note.next(currNote) };
	return acc;
}, {});

const {
	F_4,
	A_4,
	C_4,
	E_4,
	G_4,
	C_5,
	E_5,
	G_5,
	B_6,
	C_6,
	E_6,
	G_6,
	C_7,
	D_4,
	B_4,
	D_5,
	F_5,
	A_5,
	B_5,
	D_6,
	F_6,
	A_6,
	Bb_6,
	Eb_6,
	Gb_6,
	Db_4,
	Gb_4,
	Bb_4,
	Ab_4,
	Ab_5,
} = notes;

// console.log("notes:", notes);

// Determine typical harmonicas range
// Lowest harmonica G (lowest key) note - G3 / 195.998Hz
// Hightest harmonica F# (hightest key) note - F7# / 2959.955Hz

const c_harmonica_notes = [
	[null, null, null, null, null, null, null, null, null, Bb_6],
	[null, null, null, null, null, null, null, Eb_6, Gb_6, B_6],
	[C_4, E_4, G_4, C_5, E_5, G_5, C_6, E_6, G_6, C_7],
	[D_4, G_4, B_4, D_5, F_5, A_5, B_5, D_6, F_6, A_6],
	[Db_4, Gb_4, Bb_4, Db_4, null, Ab_5, null, null, null, null],
	[null, F_4, A_4, null, null, null, null, null, null, null],
	[null, null, Ab_4, null, null, null, null, null, null, null],
];

const App = () => {
	const { start, stop, pitch } = usePitch();

	useEffect(() => {});

	return (
		<div>
			<header>Harmonica</header>
			<button onClick={start}>Start</button>
			<button onClick={stop}>Stop</button>

			<div>Pitch: {pitch ? pitch.toFixed(4) : "none"}</div>

			{c_harmonica_notes.map((row, index) => (
				<div key={`row_${index}`} className={styles.row}>
					{row.map((note, index) => (
						<Key key={`${index}_${note?.name}`} note={note} pitch={pitch || 0} />
					))}
				</div>
			))}
		</div>
	);
};

export default App;
