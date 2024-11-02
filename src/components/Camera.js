import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import '@tensorflow/tfjs';

const modelURL = process.env.PUBLIC_URL + '/my-model/home/model.json';
const metadataURL = process.env.PUBLIC_URL + '/my-model/home/metadata.json';

const Camera = () => {
    const webcamContainerRef = useRef(null);
    const [predictions, setPredictions] = useState([]);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const modelRef = useRef(null);
    const webcamRef = useRef(null);

    const init = async () => {
        try {
            // Load the model
            modelRef.current = await tmImage.load(modelURL, metadataURL);
            setIsModelLoaded(true);

            const flip = true;
            webcamRef.current = new tmImage.Webcam(400, 400, flip);
            await webcamRef.current.setup();

            // Check if webcam is ready before calling play
            if (webcamRef.current && typeof webcamRef.current.play === 'function') {
                await webcamRef.current.play();
            } else {
                console.error("Webcam play function is not available.");
                return;
            }

            if (webcamContainerRef.current && webcamRef.current.canvas) {
                webcamContainerRef.current.innerHTML = '';
                webcamContainerRef.current.appendChild(webcamRef.current.canvas);
            }

            requestAnimationFrame(loop);
        } catch (error) {
            console.warn("Non-critical error during webcam play:", error);
        }
    };

    const loop = async () => {
        if (webcamRef.current) {
            webcamRef.current.update();
            await predict();
            requestAnimationFrame(loop);
        }
    };

    const predict = async () => {
        if (modelRef.current && webcamRef.current) {
            const prediction = await modelRef.current.predict(webcamRef.current.canvas);
            setPredictions(prediction);
        }
    };

    useEffect(() => {
        init();

        return () => {
            if (webcamRef.current) {
                webcamRef.current.stop();
            }
        };
    }, []);

    return (
        <div>
            <div id="webcam-container" ref={webcamContainerRef}></div>
            <div id="label-container">
                {predictions.map((pred, index) => (
                    <div key={index}>
                        {pred.className}: {pred.probability.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Camera;
