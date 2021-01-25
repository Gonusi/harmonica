import React from "react";
import classNames from "classnames";
import styles from "./Key.module.scss";

interface FreqRange {
	low: number;
	exact: number;
	high: number;
}

interface Note {
	name: string;
	freq: FreqRange;
}

interface KeyProps {
	note: Note;
	freq: Number;
}

const Key = ({ note, freq }: KeyProps) => {
	const active = freq && freq > note.freq.low && freq <= note.freq.high;
	return (
		<div className={classNames({ [styles.active]: active })}>
			{note.name}, active: {active ? "true" : "false"}
		</div>
	);
};

export default Key;
