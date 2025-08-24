"use client";

import { AiOutlineSpotify } from "react-icons/ai";
import { SiYoutubemusic } from "react-icons/si";

export default function Home() {
  const handleLogin = () => {
    console.log("Login Button Clicked");
    window.location.href = "/api/login";
  };

  const handleYtLogin = () => {
    console.log("YT Music Login");
  };

  return (
    <div className="flex flex-row justify-evenly">
      <div>
        <div className="p-20">
          <p className="text-3xl text-zinc">Look at your Spotify Playlists</p>
        </div>
        <div className="pl-20 pr-20 pb-20">
          <button onClick={handleLogin} className="bg-black text-white">
            <AiOutlineSpotify className="mr-2 h-7 w-7" />
            Login to Spotify
          </button>
        </div>
      </div>
      <div>
        <div className="p-20">
          <p className="text-3xl text-zinc">
            Look at your Youtube Music Playlists
          </p>
        </div>
        <div className="pl-20 pr-20 pb-20">
          <button onClick={handleYtLogin} className="bg-black text-white">
            <SiYoutubemusic className="mr-2 h-7 w-7" />
            Login to YT Music
          </button>
        </div>
      </div>
    </div>
  );
}
