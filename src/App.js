import Key from "./components/Key/Key";
import usePitch from "./hooks/usePitch";
import notes from "./shared/notes";
import styles from "./App.module.scss";

const {
	C4,
	E4,
	G4,
	C5,
	E5,
	G5,
	C6,
	E6b,
	E6,
	G6b,
	G6,
	C7,
	D4,
	B4,
	D5,
	F5,
	A5,
	B5,
	D6,
	F6,
	A6,
	B6,
	B6b,
	D4b,
	G4b,
	B4b,
	A5b,
	D5b,
	F4,
	A4,
	A4b,
} = notes;

// TODO C7 is for some reason not detected at all. I mean the pitch doesn't even get detected.
// Tested the mic and the note shows ok on a spectrogram

const c_harmonica_notes = [
	[null, null, null, null, null, null, null, null, null, B6b],
	[null, null, null, null, null, null, null, E6b, G6b, B6],
	[C4, E4, G4, C5, E5, G5, C6, E6, G6, C7],
	[D4, G4, B4, D5, F5, A5, B5, D6, F6, A6],
	[D4b, G4b, B4b, D5b, null, A5b, null, null, null, null],
	[null, F4, A4, null, null, null, null, null, null, null],
	[null, null, A4b, null, null, null, null, null, null, null],
];

const App = () => {
	const { start, stop, pitch } = usePitch();

	return (
		<div>
			<header>Harmonica</header>
			<button onClick={start}>Start</button>
			<button onClick={stop}>Stop</button>

			<div>Pitch: {pitch.toFixed(4)}</div>

			{c_harmonica_notes.map((row) => (
				<div className={styles.row}>
					{row.map((note, index) => (
						<Key key={note?.name || index} note={note} pitch={pitch} />
					))}
				</div>
			))}
		</div>
	);
};

export default App;
