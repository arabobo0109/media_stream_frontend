import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoRecorder = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    // Access the user's camera and set up media recorder
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMediaStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        setRecorder(mediaRecorder);
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  const sendDataToBackend = (data) => {
    axios
      .post("http://192.168.149.195:5000/video", data)
      .then((response) => {
        console.log("Received processed video from backend:", response.data);
      })
      .catch((error) => {
        console.error("Error sending video data to backend:", error);
      });
  };

  let recordInterval = null;

  const startRecording = () => {
    if (recorder) {
      const chunks = [];
      recorder.ondataavailable = (event) => {
        console.log(event.data);
        chunks.push(event.data);
      };
      recorder.start();

      recordInterval = setInterval(() => {
        // if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: "video/webm" });
        sendDataToBackend(blob);
        // }
      }, 500);
    }
  };

  const stopRecording = () => {
    if (recordInterval) {
      clearInterval(recordInterval);
      recordInterval = null;
      recorder.stop();
    }
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default VideoRecorder;
