import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classNames = ['1_finger', '2_finger', '3_finger', 'keine_finger'];

const Camera = () => {
    const videoRef = useRef(null);
    const [model, setModel] = useState(null);
    const [detection, setDetection] = useState(null);

    const modelPath = process.env.PUBLIC_URL + '/my-model/model.json';

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedModel = await tf.loadLayersModel(modelPath);
                setModel(loadedModel);
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        loadModel();
    }, [modelPath]);

    useEffect(() => {
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing camera: ", error);
            }
        };

        getCameraStream();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const detect = async () => {
        if (model && videoRef.current && videoRef.current.readyState === 4) {
            tf.tidy(() => {
                const imgTensor = tf.browser.fromPixels(videoRef.current).toFloat();
                const resizedTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
                const expandedTensor = resizedTensor.expandDims(0);
                const prediction = model.predict(expandedTensor);
                const predictionData = prediction.dataSync();

                const maxPredictionValue = Math.max(...predictionData);
                const maxPredictionIndex = predictionData.indexOf(maxPredictionValue);

                const className = classNames[maxPredictionIndex];

                setDetection(`Erkannt: ${className} mit ${(maxPredictionValue * 100).toFixed(2)}% Wahrscheinlichkeit`);
            });
        }
        setTimeout(detect, 500);
    };

    useEffect(() => {
        if (model) {
            detect();
        }
    }, [model]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div className="overflow-hidden rounded-5" style={{width: '100%', height: '500px', position: 'relative'}}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100 h-100"
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );
};

export default Camera;
