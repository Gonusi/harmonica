import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Key from "./Key";

// Pitches are incorrect for easier use
const note = {
	name: "A4",
	freq: {
		low: 420,
		exact: 440,
		high: 460,
	},
};

test("renders name of note and is not active by default", () => {
	const { getByText } = render(<Key note={note} />);
	const elem = getByText("A4");
	expect(elem).toBeInTheDocument();
	expect(elem.classList.contains("active")).toBeFalsy();
});

test("is active if pitch prop is in its pitch range", () => {
	const { getByText } = render(<Key note={note} freq={440} />);
	const elem = getByText("A4");
	expect(elem).toBeInTheDocument();
	expect(elem.classList.contains("active")).toBeTruthy();
});
