"use client";

import { useState } from "react";
import {
  SiYoutubemusic,
  SiApplemusic,
  SiSpotify,
  SiSoundcloud,
} from "react-icons/si";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export default function PlaylistSelector({ playlists }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState({});
  const [selectedService, setSelectedService] = useState("");

  return (
    <div className="flex flex-col space-y-8 items-center w-full max-w-md px-4">
      <div className="text-center w-full">
        <h1 className="text-2xl font-extrabold mb-4">
          What playlist are we converting today?
        </h1>
        <div className="flex justify-center">
          <Select onValueChange={setSelectedPlaylist}>
            <SelectTrigger>
              <SelectValue placeholder="Select the Playlist" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950">
              <SelectGroup>
                <SelectLabel>Playlists</SelectLabel>
                {playlists.map((playlist) => (
                  <SelectItem key={playlist.id} value={playlist}>
                    {playlist.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPlaylist &&
        selectedPlaylist.images &&
        selectedPlaylist.images.length > 0 && (
          <div>
            <h3>The Chosen Playlist is</h3>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>{selectedPlaylist.name}</CardTitle>
                <CardDescription>
                  <div>Number of Tracks: {selectedPlaylist.tracks.total}</div>
                  <div>Owner: {selectedPlaylist.owner.display_name}</div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  className="w-52 l-52"
                  src={selectedPlaylist.images[0].url}
                  alt={selectedPlaylist.name}
                />
              </CardContent>
            </Card>
          </div>
        )}

      <div className="text-center w-full">
        <h1 className="text-2xl font-extrabold mb-4">
          What service are we converting it to?
        </h1>
        <div className="flex justify-center">
          <Select onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Select the Service" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950">
              <SelectGroup>
                <SelectLabel>Service</SelectLabel>
                <SelectItem value="spotify">
                  <div className="flex flex-row items-center gap-2">
                    <SiSpotify />
                    Spotify
                  </div>
                </SelectItem>
                <SelectItem value="appleMusic">
                  <div className="flex flex-row items-center gap-2">
                    <SiApplemusic />
                    Apple Music
                  </div>
                </SelectItem>
                <SelectItem value="ytMusic">
                  <div className="flex flex-row items-center gap-2">
                    <SiYoutubemusic />
                    Youtube Music
                  </div>
                </SelectItem>
                <SelectItem value="soundcloud">
                  <div className="flex flex-row items-center gap-2">
                    <SiSoundcloud />
                    Soundcloud
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Button
          className="bg-zinc-300"
          disabled={!selectedPlaylist || !selectedService}
        >
          Convert
        </Button>
      </div>
    </div>
  );
}
