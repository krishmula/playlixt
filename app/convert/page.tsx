"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PlaylistsViewer from "@/components/playlists-viewer";
import { usePlaylistStore } from "@/store/playlistStore";

export default function Convert() {
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const spotifyPlaylist = usePlaylistStore(
    (state) => state.selectedSpotifyPlaylist,
  );
  const spotifyName = usePlaylistStore((state) => state.spotifyPlaylistName);
  const ytMusicPlaylist = usePlaylistStore(
    (state) => state.selectedYtMusicPlaylist,
  );
  const ytMusicName = usePlaylistStore((state) => state.ytMusicPlaylistName);
  const setSelectedSpotifyPlaylist = usePlaylistStore(
    (state) => state.setSelectedSpotifyPlaylist,
  );
  const setSelectedYtMusicPlaylist = usePlaylistStore(
    (state) => state.setSelectedYtMusicPlaylist,
  );

  const handleConvert = async () => {
    if (!source || !target || source === target) {
      setStatus("Please select different source and target platforms");
      return;
    }

    const sourcePlaylist =
      source === "spotify" ? spotifyPlaylist : ytMusicPlaylist;
    if (!sourcePlaylist) {
      setStatus("Please select a playlist to convert");
      return;
    }

    setStatus("Converting playlist...");

    try {
      const resPlaylist = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: source,
          destination: target,
          source_playlist: sourcePlaylist,
          spotify_name: spotifyName,
        }),
      });

      if (!resPlaylist.ok) {
        const errorData = await resPlaylist.json();
        setStatus(`Error: ${errorData.error || "Failed to convert playlist"}`);
        return;
      }

      const data = await resPlaylist.json();
      console.log("Playlist data:", data);
      setStatus("Conversion complete!");
    } catch (error) {
      console.error("Conversion error:", error);
      setStatus("Error: Failed to convert playlist");
    }
  };

  const handleSourceChange = (val: string) => {
    setSource(val);
    // Clear the selected playlist when source changes
    setSelectedSpotifyPlaylist(null);
    setSelectedYtMusicPlaylist(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-4">Convert Playlists</h1>
      <div className="flex gap-8 mb-8">
        <div>
          <Label className="block mb-2 font-semibold">Source Platform</Label>
          <Select value={source} onValueChange={handleSourceChange}>
            <SelectTrigger className="px-4 py-2 rounded border">
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="ytmusic">YouTube Music</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-2 font-semibold">Target Platform</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="px-4 py-2 rounded border">
              <SelectValue placeholder="Select Target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="ytmusic">YouTube Music</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {source && <PlaylistsViewer source={source} />}
      <button
        className="px-8 py-4 rounded-lg shadow transition text-lg font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in srgb,var(--primary),#000 20%)] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          !source ||
          !target ||
          source === target ||
          !(source === "spotify" ? spotifyPlaylist : ytMusicPlaylist)
        }
        onClick={handleConvert}
      >
        Convert Playlist
      </button>
      {status && <div className="mt-4 text-lg font-medium">{status}</div>}
    </main>
  );
}
