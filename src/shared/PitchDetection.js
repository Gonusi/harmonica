// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
  Crepe Pitch Detection model
  Based on https://github.com/marl/crepe/tree/gh-pages
  Original model and code: https://marl.github.io/crepe/crepe.js
*/

//https://github.com/ml5js/ml5-library/blob/main/src/PitchDetection/index.js

import * as tf from "@tensorflow/tfjs";

function callCallback(promise, callback) {
	if (callback) {
		promise
			.then((result) => {
				callback(undefined, result);
				return result;
			})
			.catch((error) => {
				callback(error);
				return error;
			});
	}
	return promise;
}

class PitchDetection {
	/**
	 * Create a pitchDetection.
	 * @param {Object} model - The path to the trained model. Only CREPE is available for now. Case insensitive.
	 * @param {AudioContext} audioContext - The browser audioContext to use.
	 * @param {MediaStream} stream  - The media stream to use.
	 * @param {function} callback  - Optional. A callback to be called once the model has loaded. If no callback is provided, it will return a promise that will be resolved once the model has loaded.
	 */
	constructor(model, audioContext, stream, callback) {
		this.isProcessing = false;
		this.scriptNode = null;
		this.onAudioProcessRef = null;
		this.model = model;
		this.audioContext = audioContext;
		this.stream = stream;
		this.frequency = null;
		this.ready = callCallback(this.loadModel(model), callback);
	}

	async loadModel(model) {
		this.model = await tf.loadLayersModel(`${model}/model.json`);
		if (this.audioContext) {
			await this.processStream();
		} else {
			throw new Error("Could not access microphone - getUserMedia not available");
		}
		return this;
	}

	async processStream() {
		await tf.nextFrame();
		const mic = this.audioContext.createMediaStreamSource(this.stream);
		const minBufferSize = (this.audioContext.sampleRate / 32000) * 1024;
		let bufferSize = 4;
		while (bufferSize < minBufferSize) bufferSize *= 2;

		this.scriptNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
		this.onAudioProcessRef = this.handleAudioProcess.bind(this);
		this.scriptNode?.addEventListener("audioprocess", this.onAudioProcessRef);

		mic.connect(this.scriptNode);
		this.scriptNode?.connect(this.audioContext.destination);

		if (this.audioContext.state !== "running") {
			console.warn("User gesture needed to start AudioContext, please click");
		}
	}

	handleAudioProcess(audioEvent) {
		if (!this.isProcessing) {
			// Try to avoid processing until previous work is done
			// Is it working? Need to test
			this.processMicrophoneBuffer(audioEvent);
		}
	}

	stop() {
		this.scriptNode?.disconnect();
		this.scriptNode?.removeEventListener("audioprocess", this.onAudioProcessRef); // Check if I can not use ref maybe by binding in the constructor or just rewrite class to fn
	}
	i;

	async processMicrophoneBuffer(event) {
		// Many calls to this used to accumulate I think (faster than they were being processed), leading to poor performance
		// isProcessing flag hopefully will solve this
		this.isProcessing = true;
		this.results = {};

		PitchDetection.resample(event.inputBuffer, (resampled) => {
			tf.tidy(() => {
				const centMapping = tf.add(
					tf.linspace(0, 7180, 360),
					tf.tensor(1997.3794084376191)
				);

				const frame = tf.tensor(resampled.slice(0, 1024));
				const zeromean = tf.sub(frame, tf.mean(frame));
				const framestd = tf.tensor(tf.norm(zeromean).dataSync() / Math.sqrt(1024));
				const normalized = tf.div(zeromean, framestd);
				const input = normalized.reshape([1, 1024]);
				const activation = this.model.predict([input]).reshape([360]);
				const confidence = activation.max().dataSync()[0];
				const center = activation.argMax().dataSync()[0];
				this.results.confidence = confidence.toFixed(3);

				const start = Math.max(0, center - 4);
				const end = Math.min(360, center + 5);
				const weights = activation.slice([start], [end - start]);
				const cents = centMapping.slice([start], [end - start]);

				const products = tf.mul(weights, cents);
				const productSum = products.dataSync().reduce((a, b) => a + b, 0);
				const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
				const predictedCent = productSum / weightSum;
				const predictedHz = 10 * 2 ** (predictedCent / 1200.0);

				const frequency = confidence > 0.5 ? predictedHz : null;
				this.frequency = frequency * 2;
				this.isProcessing = false;
			});
		});
	}

	/**
	 * Returns the pitch from the model attempting to predict the pitch.
	 * @param {function} callback - Optional. A function to be called when the model has generated content. If no callback is provided, it will return a promise that will be resolved once the model has predicted the pitch.
	 * @returns {number}
	 */

	async getPitch(callback) {
		await this.ready;
		const { frequency } = this;
		if (callback) {
			callback(undefined, frequency);
		}
		return frequency;
	}

	static resample(audioBuffer, onComplete) {
		const original = audioBuffer.getChannelData(0);
		if (audioBuffer.sampleRate === 32000) onComplete(original);

		const interpolate = audioBuffer.sampleRate % 32000 !== 0;
		const multiplier = audioBuffer.sampleRate / 32000;
		const subsamples = new Float32Array(1024);
		for (let i = 0; i < 1024; i += 1) {
			if (!interpolate) {
				subsamples[i] = original[i * multiplier];
			} else {
				const left = Math.floor(i * multiplier);
				const right = left + 1;
				const p = i * multiplier - left;
				subsamples[i] = (1 - p) * original[left] + p * original[right];
			}
		}
		onComplete(subsamples);
	}
}

const pitchDetection = (modelPath = "./", context, stream, callback) =>
	new PitchDetection(modelPath, context, stream, callback);

export default pitchDetection;
