import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import '@tensorflow/tfjs';

const modelURL = process.env.PUBLIC_URL + '/my-model/home/model.json';
const metadataURL = process.env.PUBLIC_URL + '/my-model/home/metadata.json';

const Camera = ({ onSelectionComplete }) => {
    const webcamContainerRef = useRef(null);
    const [predictions, setPredictions] = useState([]);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const modelRef = useRef(null);
    const webcamRef = useRef(null);
    const countdownRef = useRef(0);

    useEffect(() => {
        init();

        return () => {
            if (webcamRef.current) {
                webcamRef.current.stop();
            }
        };
    }, []);

    const init = async () => {
        try {
            modelRef.current = await tmImage.load(modelURL, metadataURL);
            setIsModelLoaded(true);
            console.log("Modell erfolgreich geladen.");

            const flip = true;
            webcamRef.current = new tmImage.Webcam(400, 400, flip);
            await webcamRef.current.setup();

            if (webcamRef.current && typeof webcamRef.current.play === 'function') {
                await webcamRef.current.play();
            } else {
                console.error("Die 'play'-Funktion der Webcam ist nicht verfügbar.");
                return;
            }

            if (webcamContainerRef.current && webcamRef.current.canvas) {
                webcamContainerRef.current.innerHTML = '';
                webcamContainerRef.current.appendChild(webcamRef.current.canvas);
            }

            requestAnimationFrame(loop);
        } catch (error) {
            console.warn("Nicht-kritischer Fehler beim Initialisieren von Modell und Webcam:", error);
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

    const startTimer = () => {
        setCountdown(5);
        countdownRef.current = 5;
        console.log("Timer gestartet.");

        const timerInterval = setInterval(() => {
            countdownRef.current -= 1;
            setCountdown(countdownRef.current);

            if (countdownRef.current === 0) {
                clearInterval(timerInterval);
                console.log("Countdown beendet. Vorhersage wird erfasst...");
                capturePrediction();
            }
        }, 1000);
    };

    const capturePrediction = async () => {
        if (modelRef.current && webcamRef.current) {
            const prediction = await modelRef.current.predict(webcamRef.current.canvas);
            setPredictions(prediction);

            const topPrediction = prediction.reduce((best, current) =>
                current.probability > best.probability ? current : best
            );

            console.log("Erfasste Vorhersage:", topPrediction);
            if (topPrediction) {
                onSelectionComplete(topPrediction.className);
            } else {
                console.warn("Keine Vorhersage getroffen.");
            }
        }
    };

    return (
        <div>
            <div id="webcam-container" ref={webcamContainerRef}></div>

            <button onClick={startTimer} className="btn btn-primary mt-3">
                Start 5s Timer
            </button>
            {countdown > 0 && <p>Countdown: <b className="text-danger">{countdown}</b></p>}
        </div>
    );
};

export default Camera;
