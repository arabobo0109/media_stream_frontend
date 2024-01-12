import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("http://192.168.149.195:5000/videos");
        const data = await response.json();
        setVideos([...data]);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {videos.map((video) => (
          <div className="col-md-4" key={video.id}>
            <NavLink to={`/player/${video.id}`}>
              <div className="card border-0">
                <img
                  src={`http://192.168.149.195:5000${video.poster}`}
                  alt={video.name}
                />
                <div className="card-body">
                  <p>{video.name}</p>
                  <p>{video.duration}</p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
