import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./Key.module.scss";
import { SingleNote } from "../../shared/Note/Note";

interface ExtendedSingleNote extends SingleNote {
	prev: SingleNote;
	next: SingleNote;
}

interface KeyProps {
	note: ExtendedSingleNote;
	pitch: number;
}

// Possibly to measure if I need to change this stuff...
// Maybe parent should listen to pitch and know which pitch affects which key, then only update required components
// As of now, all components get updated and do their processing...

const toPercentValue = (valMin: number, valMax: number, val: number) => {
	const percent = (val - valMin) / (valMax - valMin);
	const result = percent * 100;
	return result;
};

const Key = ({ note, pitch }: KeyProps) => {
	const [range, setRange] = useState({ low: 0, high: 0 });
	const [name, setName] = useState("");

	useEffect(() => {
		if (!note) return;
		console.log("note has changed, rerunning effect");

		const prevNotePitch = note.prev?.pitch || note.pitch - 40;
		const nextNotePitch = note.next?.pitch || note.pitch + 40;

		const pitchLowRange = (note.pitch - prevNotePitch) / 2;
		const pitchHighRange = (nextNotePitch - note.pitch) / 2;

		const low = note.pitch - pitchLowRange;
		const high = note.pitch + pitchHighRange;

		if (note) setName(note.name.split("_")[0]);
		setRange({ low, high });
	}, [note]);

	if (!note) return <div className={styles.placeholder} />;

	// if (note.name === "A_4") {
	// 	console.log("A_4 pitchLow:", range.low, " pitchHigh: ", range.high);
	// }
	const active = pitch && pitch > range.low && pitch <= range.high;
	let percentValue;
	if (active) {
		percentValue = toPercentValue(range.low, range.high, pitch);
		console.log(
			percentValue.toFixed(2),
			"curr:",
			pitch,
			"low: ",
			range.low,
			"high:",
			range.high,
			"exact: ",
			note.pitch,
			"next.exact:",
			note.next.pitch
		);
	}
	return <div className={classNames(styles.container, { [styles.active]: active })}>{name}</div>;
};

export default Key;
