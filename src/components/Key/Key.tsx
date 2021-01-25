import React from "react";
import classNames from "classnames";
import styles from "./Key.module.scss";

interface Note {
	name: string;
	pitch: number;
}

interface KeyProps {
	note: Note;
	pitch: Number;
}

const Key = ({ note, pitch }: KeyProps) => {
	if (!note) return <div className={styles.placeholder} />;
	// no time today to calculate proper ranges, let's try a good old + - 20 :)
	const pitchLow = note.pitch - 20;
	const pitchHigh = note.pitch + 20;
	const active = pitch && pitch > pitchLow && pitch <= pitchHigh;
	return (
		<div className={classNames(styles.container, { [styles.active]: active })}>
			{note?.name}
		</div>
	);
};

export default Key;
