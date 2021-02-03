import React, { useState, useEffect, useRef } from "react";
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

const linearMap = (xMin: number, xMax: number, yMin: number, yMax: number, x: number) => {
	const percent = (x - yMin) / (yMax - yMin);
	const result = percent * (xMax - xMin) + xMin;
	return Math.floor(result);
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

	const active = pitch && pitch > range.low && pitch <= range.high;
	let percentValue = 0;
	if (active) {
		if (pitch < note.pitch) {
			percentValue = 100 - linearMap(0, 49, range.low, note.pitch, pitch);
		} else if (pitch > note.pitch) {
			percentValue = 100 - linearMap(51, 100, note.pitch, range.high, pitch);
		}
	}

	return (
		<div className={classNames(styles.container, { [styles.active]: active })}>
			{name}
			<div className={styles.position} style={{ top: `${percentValue}%` }} />
		</div>
	);
};

export default Key;
