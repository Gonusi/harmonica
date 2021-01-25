import { useState, useRef } from "react";
import pitchDetection from "../shared/PitchDetection";

declare global {
	interface Window {
		ml5: any;
	}
}

const MODEL_URL =
	"https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

const usePitch = () => {
	let detector: { getPitch: any };
	const running = useRef(false);
	const [pitch, setPitch] = useState(0);

	const start = () => {
		// TODO need to reuse media / audio context this after stop / resume but let's do this later
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: false })
			.then(function (stream) {
				const audioContext = new AudioContext();
				detector = pitchDetection(MODEL_URL, audioContext, stream, modelLoaded);
				running.current = true;
			})
			.catch(function (err) {
				/* TODO handle the error */
			});
	};

	const stop = () => {
		console.log("Stop click");
		running.current = false;
	};

	const step = () => {
		if (!running.current) return;
		// TODO
		// This tends to hang if left to work for a while
		// - need to throttle this, by RAF / possibly by checking timestamps
		// - need to check how frequently the promise returned by detector resolves to get an idea
		// - need to estimate how cpu intensive this stuff is
		// - possibly add a slight timeout between detections if it's processor intensive
		if (!detector) {
			setTimeout(() => {
				step();
			}, 100);
		} else {
			const promise = detector.getPitch();
			promise.then((freq: number | null) => {
				if (freq) setPitch(freq);
				step();
			});
		}
	};

	const modelLoaded = () => {
		step();
	};

	return { start, stop, pitch };
};

export default usePitch;
