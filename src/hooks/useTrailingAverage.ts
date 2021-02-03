import { useState, useRef, useEffect } from "react";

const useTrailingAverage = (number: number, count: number) => {
	const [numbers, setNumbers] = useState<number[]>([]);
	const [val, setVal] = useState(0);

	useEffect(() => {
		setNumbers((prev: number[]) => {
			const copy = [...prev];
			if (copy.length === count) copy.shift();
			copy.push(number);
			return copy;
		});
	}, [number, count]);

	useEffect(() => {
		const sum = numbers.reduce((a, b) => a + b, 0);
		setVal(sum / count);
	}, [numbers, count]);

	return val;
};

export default useTrailingAverage;
