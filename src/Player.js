import React from "react";
import { useParams } from "react-router-dom";

export default function Player() {
  const { id } = useParams();
  const [videoData, setVideoData] = React.useState({});

  React.useEffect(() => {
    async function fetchVideoData() {
      try {
        const res = await fetch(`http://192.168.149.195:5000/video/${id}/data`);
        const data = await res.json();
        setVideoData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideoData();
  }, [id]);

  return (
    <>
      <video controls muted autoPlay>
        <source
          src={`http://192.168.149.195:5000/video/${id}`}
          type="video/mp4"
        ></source>
      </video>
      <h1>{videoData.name}</h1>
    </>
  );
}
