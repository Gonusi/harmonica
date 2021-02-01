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
	const [pitch, setPitch] = useState(0);
	const streamRef = useRef<MediaStream>();
	const timeoutRef = useRef<number>();
	const detectorRef = useRef<any>(); // TODO

	const start = () => {
		// TODO need to reuse media / audio context this after stop / resume but let's do this later
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: false })
			.then(function (stream) {
				streamRef.current = stream;
				const audioContext = new AudioContext({ sampleRate: 32000 });
				detectorRef.current = pitchDetection(MODEL_URL, audioContext, stream, modelLoaded);
			})
			.catch(function (err) {
				/* TODO handle the error */
			});
	};

	const stop = () => {
		streamRef.current?.getTracks().forEach(function (track) {
			if (track.readyState === "live") {
				track.stop();
			}
		});
		window.clearTimeout(timeoutRef.current);
		detectorRef.current?.stop();
	};

	const step = () => {
		// console.log("STEP");
		// TODO
		// This tends to hang if left to work for a while
		// - need to throttle this, by RAF / possibly by checking timestamps
		// - need to check how frequently the promise returned by detector resolves to get an idea
		// - need to estimate how cpu intensive this stuff is
		// - possibly add a slight timeout between detections if it's processor intensive
		if (detectorRef.current) {
			const promise = detectorRef.current.getPitch();
			promise.then((freq: number | null) => {
				if (freq) setPitch(freq);
				timeoutRef.current = window.setTimeout(() => {
					step(); // This step, it only gets what is saved in class state
					// In reality that class itself updates on each audioEvent whatether that means
					// So throttling here doesn't really do much.
					// I can request this each second and in th PitchDetection class the state will still be updated each 50ms or whatever
				}, 50);
			});
		}
	};

	const modelLoaded = () => {
		step();
	};

	return { start, stop, pitch };
};

export default usePitch;
