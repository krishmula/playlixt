"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  fetchSpotifyPlaylists,
  fetchYtMusicPlaylists,
} from "../utils/playlists";
import PlaylistsViewer from "@/components/playlists-viewer";

type Playlist = {
  id: string;
  name: string;
};

export default function Convert() {
  const [source, setSource] = React.useState<string>("");
  const [target, setTarget] = React.useState<string>("");
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");

  const handleConvert = () => {
    setStatus("Converting playlist...");
    // TODO: Implement conversion logic
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
        disabled={!source || !target || !selectedPlaylist || source === target}
        onClick={handleConvert}
      >
        Convert Playlist
      </button>
      {status && <div className="mt-4 text-lg font-medium">{status}</div>}
    </main>
  );
}
