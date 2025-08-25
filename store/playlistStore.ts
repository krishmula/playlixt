import { create } from "zustand";

type PlaylistStore = {
  selectedSpotifyPlaylist: string | null;
  setSelectedSpotifyPlaylist: (playlist: string | null) => void;
  selectedYtMusicPlaylist: string | null;
  setSelectedYtMusicPlaylist: (playlist: string | null) => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  selectedSpotifyPlaylist: null,
  setSelectedSpotifyPlaylist: (playlist) =>
    set({ selectedSpotifyPlaylist: playlist }),
  selectedYtMusicPlaylist: null,
  setSelectedYtMusicPlaylist: (playlist) =>
    set({ selectedYtMusicPlaylist: playlist }),
}));
