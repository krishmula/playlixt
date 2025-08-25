"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Playlist = {
  id: string;
  name: string;
};

type PlaylistsResponse = {
  spotify: Playlist[];
  ytmusic: Playlist[];
};

export default function PlaylistsViewer({ source }: { source: string }) {
  const [playlists, setPlaylists] = useState<PlaylistsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch(() => setError("Failed to fetch playlists"));
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!playlists) {
    return <div>Loading playlists...</div>;
  }

  return (
    <div className="mb-8 w-80">
      {source === "spotify" && (
        <>
          <label className="block mb-2 font-semibold">
            Select Spotify Playlist
          </label>
          <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
            <SelectTrigger className="px-4 py-2 rounded border w-full">
              <SelectValue placeholder="Choose a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.spotify.map((pl) => (
                <SelectItem key={pl.id} value={pl.id}>
                  {pl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
      {source === "ytmusic" && (
        <>
          <label className="block mb-2 font-semibold">
            Select YouTube Music Playlist
          </label>
          <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
            <SelectTrigger className="px-4 py-2 rounded border w-full">
              <SelectValue placeholder="Choose a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.ytmusic.map((pl) => (
                <SelectItem key={pl.id} value={pl.id}>
                  {pl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
      {selectedPlaylist && (
        <div className="mt-4">Selected Playlist ID: {selectedPlaylist}</div>
      )}
    </div>
  );
}
