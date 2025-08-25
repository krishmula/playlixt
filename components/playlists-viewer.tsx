"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePlaylistStore } from "@/store/playlistStore";

interface PlaylistsViewerType {
  source: string;
}

export default function PlaylistsViewer({ source }: PlaylistsViewerType) {
  const selectedSpotify = usePlaylistStore(
    (state) => state.selectedSpotifyPlaylist,
  );
  const setSpotify = usePlaylistStore(
    (state) => state.setSelectedSpotifyPlaylist,
  );
  const selectedYtMusic = usePlaylistStore(
    (state) => state.selectedYtMusicPlaylist,
  );
  const setYtMusic = usePlaylistStore(
    (state) => state.setSelectedYtMusicPlaylist,
  );
  const [playlists, setPlaylists] = useState<PlaylistsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          <Select
            value={selectedSpotify}
            onValueChange={(value) => {
              setSpotify(value);
            }}
          >
            <SelectTrigger className="px-4 py-2 rounded border w-full">
              <SelectValue placeholder="Choose a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.spotify.map((pl) => (
                <SelectItem key={pl.id} value={pl.link}>
                  {pl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
      {/* YouTube Music selection can be added here if needed */}
      {source === "ytmusic" && (
        <>
          <label className="block mb-2 font-semibold">
            Select Youtube Music Playlist
          </label>
          <Select
            value={selectedYtMusic}
            onValueChange={(value) => {
              setYtMusic(value);
            }}
          >
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
      {/* {spotifyPlaylist && spotifyPlaylist[0] && ( */}
      {/*   <div className="mt-4">Selected Playlist: {spotifyPlaylist[0].name}</div> */}
      {/* )} */}
    </div>
  );
}
