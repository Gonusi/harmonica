import Key from "./components/Key/Key";
import usePitch from "./hooks/usePitch";

let notes = {
	A4: {
		name: "A4",
		freq: {
			low: 420,
			exact: 440,
			high: 460,
		},
	},
};

const App = () => {
	const { start, stop, pitch } = usePitch();

	return (
		<div>
			<header>Harmonica</header>
			<button onClick={start}>Start</button>
			<button onClick={stop}>Stop</button>

			<div>Pitch: {pitch.toFixed(4)}</div>
			<Key note={notes.A4} freq={pitch} />
		</div>
	);
};

export default App;
