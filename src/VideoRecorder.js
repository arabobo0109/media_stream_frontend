import { useState, useRef, useEffect } from "react";

const VideoRecorder = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const mimeType = "video/webm";

  useEffect(() => {}, []);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: true,
          video: true,
        };
        const audioConstraints = { audio: true };
        // create audio and video streams separately
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        setPermission(true);
        //combine both audio and video streams
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        setStream(combinedStream);
        //set videostream to live feed player
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
  };

  const stopRecording = async () => {
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      // const videoBlob = new Blob(videoChunks, { type: mimeType });
      // const videoUrl = URL.createObjectURL(videoBlob);
      // setRecordedVideo(videoUrl);
      // setVideoChunks([]);
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const formData = new FormData();
      formData.append("video", videoBlob, "recorded-video.webm");

      try {
        const response = await fetch(
          "http://192.168.149.195:5000/convert-video",
          {
            method: "POST",
            body: formData,
          }
        );
        const convertedVideoUrl = await response.text();
        setRecordedVideo("http://192.168.149.195:5000" + convertedVideoUrl);
        setVideoChunks([]);
      } catch (error) {
        console.error("Error converting video:", error);
      }
    };
  };

  return (
    <div>
      <h2>Video Recorder</h2>
      <main>
        <div>
          <h2>Audio Recorder</h2>
          <main>
            <div className="video-controls">
              {!permission ? (
                <button onClick={getCameraPermission} type="button">
                  Get Camera
                </button>
              ) : null}
              {permission && recordingStatus === "inactive" ? (
                <button onClick={startRecording} type="button">
                  Start Recording
                </button>
              ) : null}
              {recordingStatus === "recording" ? (
                <button onClick={stopRecording} type="button">
                  Stop Recording
                </button>
              ) : null}
            </div>
            {recordedVideo ? (
              <div className="video-player">
                <video src={recordedVideo} controls></video>
                <a download href={recordedVideo}>
                  Download Recording
                </a>
              </div>
            ) : null}
          </main>
        </div>
      </main>
    </div>
  );
};
export default VideoRecorder;
