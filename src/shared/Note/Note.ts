const order = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const Note = () => {
	const list = {
		Ab_4: { name: "Ab_4", pitch: 415.3047 },
		A_4: { name: "A_4", pitch: 440.0 },
		A_5: { name: "A_5", pitch: 880 },
		Ab_5: { name: "Ab_5", pitch: 830.6094 },
		A_6: { name: "A_6", pitch: 1760 },
		Ab_6: { name: "Ab_6", pitch: 1661.219 },
		B_4: { name: "B_4", pitch: 493.8833 },
		Bb_4: { name: "Bb_4", pitch: 466.1638 },
		B_5: { name: "B_5", pitch: 987.7666 },
		Bb_5: { name: "Bb_5", pitch: 932.3275 },
		B_6: { name: "B_6", pitch: 1975.533 },
		Bb_6: { name: "Bb_6", pitch: 1864.655 },
		C_4: { name: "C_4", pitch: 261.6256 },
		C_5: { name: "C_5", pitch: 523.2511 },
		C_6: { name: "C_6", pitch: 1046.502 },
		C_7: { name: "C_7", pitch: 2093.005 }, // from 2038 to 2133
		D_4: { name: "D_4", pitch: 293.6648 },
		Db_4: { name: "Db_4", pitch: 277.1826 },
		D_5: { name: "D_5", pitch: 587.3295 },
		Db_5: { name: "Db_5", pitch: 554.3653 },
		D_6: { name: "D_6", pitch: 1174.659 },
		Db_6: { name: "Db_6", pitch: 1108.731 },
		E_4: { name: "E_4", pitch: 329.6276 },
		Eb_4: { name: "Eb_4", pitch: 311.127 },
		E_5: { name: "E_5", pitch: 659.2551 },
		Eb_5: { name: "Eb_5", pitch: 622.254 },
		E_6: { name: "E_6", pitch: 1318.51 },
		Eb_6: { name: "Eb_6", pitch: 1244.508 },
		F_4: { name: "F_4", pitch: 349.2282 },
		F_5: { name: "F_5", pitch: 698.4565 },
		F_6: { name: "F_6", pitch: 1396.913 },
		G_4: { name: "G_4", pitch: 391.9954 },
		Gb_4: { name: "Gb_4", pitch: 369.9944 },
		G_5: { name: "G_5", pitch: 783.9909 },
		Gb_5: { name: "Gb_5", pitch: 739.9888 },
		G_6: { name: "G_6", pitch: 1567.982 },
		Gb_6: { name: "Gb_6", pitch: 1479.978 },
	};

	const next = (note: SingleNote) => {
		const [key, octave] = note.name.split("_");
		const keyIndex = order.indexOf(key);
		const nextKeyIndex = keyIndex === order.length - 1 ? 0 : keyIndex + 1;
		const nextName =
			nextKeyIndex === 0
				? `${order[nextKeyIndex]}_${Number(octave) + 1}`
				: `${order[nextKeyIndex]}_${octave}`;
		return list[nextName as NoteName];
	};

	const prev = (note: SingleNote) => {
		const [key, octave] = note.name.split("_");
		const keyIndex = order.indexOf(key);
		if (keyIndex < 0) console.error("Found key without index. note:", key, octave);
		const prevKeyIndex = keyIndex === 0 ? order.length - 1 : keyIndex - 1;
		const prevName =
			prevKeyIndex === order.length - 1
				? `${order[prevKeyIndex]}_${Number(octave) - 1}`
				: `${order[prevKeyIndex]}_${octave}`;
		return list[prevName as NoteName];
	};

	return { prev, next, list };
};

export default Note;

const note = Note();
export type NoteName = keyof typeof note.list;
export interface SingleNote {
	name: NoteName;
	pitch: number;
}
