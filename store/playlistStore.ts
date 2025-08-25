import { create } from "zustand";

type PlaylistStore = {
  selectedSpotifyPlaylist: string | null;
  setSelectedSpotifyPlaylist: (playlist: string | null) => void;
  selectedYtMusicPlaylist: string | null;
  setSelectedYtMusicPlaylist: (playlist: string | null) => void;
  spotifyPlaylistName: string | null;
  setSpotifyPlaylistName: (name: string | null) => void;
  ytMusicPlaylistName: string | null;
  setYtMusicPlaylistName: (name: string | null) => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  selectedSpotifyPlaylist: null,
  setSelectedSpotifyPlaylist: (playlist) =>
    set({ selectedSpotifyPlaylist: playlist }),
  selectedYtMusicPlaylist: null,
  setSelectedYtMusicPlaylist: (playlist) =>
    set({ selectedYtMusicPlaylist: playlist }),
  spotifyPlaylistName: null,
  setSpotifyPlaylistName: (name) => set({ spotifyPlaylistName: name }),
  ytMusicPlaylistName: null,
  setYtMusicPlaylistName: (name) => set({ ytMusicPlaylistName: name }),
}));
