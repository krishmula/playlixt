"use client";

import { AiOutlineSpotify } from "react-icons/ai";
import { SiYoutubemusic } from "react-icons/si";
import { useEffect, useState } from "react";


export default function Home() {
  const [isSpotifyLoggedIn, setSpotifyLoggedIn] = useState(false);
  const [isYtMusicLoggedIn, setYtMusicLoggedIn] = useState(false);

  useEffect(() => {
    // Check cookies for tokens in the browser
    const cookies = document.cookie.split(';').map(c => c.trim());
    setSpotifyLoggedIn(cookies.some(c => c.startsWith('spotify_access_token=')));
    setYtMusicLoggedIn(cookies.some(c => c.startsWith('ytmusic_access_token=')));
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleYtLogin = async () => {
    const res = await fetch("/api/ytmusic/login", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      alert("Failed to initiate YT Music login.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex flex-col md:flex-row gap-10 justify-center items-center w-full max-w-4xl mx-auto">
        {/* Spotify Card */}
        <div className="bg-[var(--card)]/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 flex flex-col items-center w-80">
          <AiOutlineSpotify className="mb-4 h-12 w-12 text-[var(--secondary)]" />
          <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)] text-center">
            Spotify Playlists
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6 text-center">
            View and manage your Spotify playlists with ease.
          </p>
          {isSpotifyLoggedIn ? (
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-semibold mb-2">
                Logged in to Spotify
              </span>
              {/* Optionally, add a logout button or user info here */}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[color-mix(in srgb,var(--secondary),#000 20%)] text-[var(--secondary-foreground)] font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
            >
              <AiOutlineSpotify className="h-6 w-6" />
              Login to Spotify
            </button>
          )}
        </div>
        {/* YT Music Card */}
        <div className="bg-[var(--card)]/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 flex flex-col items-center w-80">
          <SiYoutubemusic className="mb-4 h-12 w-12 text-[var(--accent)]" />
          <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)] text-center">
            YouTube Music Playlists
          </h2>
          <p className="text-[var(--muted-foreground)] mb-6 text-center">
            Access your YouTube Music playlists in one place.
          </p>
          {isYtMusicLoggedIn ? (
            <div className="flex flex-col items-center">
              <span className="text-red-600 font-semibold mb-2">
                Logged in to YT Music
              </span>
              {/* Optionally, add a logout button or user info here */}
            </div>
          ) : (
            <button
              onClick={handleYtLogin}
              className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[color-mix(in srgb,var(--accent),#000 20%)] text-[var(--accent-foreground)] font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
            >
              <SiYoutubemusic className="h-6 w-6" />
              Login to YT Music
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
