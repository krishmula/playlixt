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

type Playlist = {
  id: string;
  name: string;
};

type SpotifyPlaylist = {
  id: string;
  name: string;
  link: string;
};

type YtMusicPlaylist = {
  id: string;
  name: string;
  link: string;
};

export default function Convert() {
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const spotifyPlaylisttt = usePlaylistStore(
    (state) => state.selectedSpotifyPlaylist,
  );
  const ytMusicPlaylisttt = usePlaylistStore(
    (state) => state.selectedYtMusicPlaylist,
  );

  const handleConvert = () => {
    setStatus("Converting playlist...");
    async function convertPlaylist() {
      const resPlaylist = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: source,
          destination: target,
          source_playlist: spotifyPlaylisttt,
        }),
      });
      console.log("resPlaylist is: ", resPlaylist);
    }

    convertPlaylist();
    setTimeout(() => {
      setStatus("Conversion complete!");
    }, 2000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-4">Convert Playlists</h1>
      <div className="flex gap-8 mb-8">
        <div>
          <Label className="block mb-2 font-semibold">Source Platform</Label>
          <Select
            value={source}
            onValueChange={(val) => {
              setSource(val);
              setSelectedPlaylist("");
            }}
          >
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
        className="px-8 py-4 rounded-lg shadow transition text-lg font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in srgb,var(--primary),#000 20%)] mb-4"
        // disabled={!source || !target || !selectedPlaylist || source === target}
        onClick={handleConvert}
      >
        Convert Playlist
      </button>
      {status && <div className="mt-4 text-lg font-medium">{status}</div>}
    </main>
  );
}
