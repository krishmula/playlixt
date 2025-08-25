import axios from "axios";
import { cookies } from "next/headers";

interface SpotifyPlaylistRaw {}

interface YTMusicPlaylistRaw {
  id: string;
  name: string;
}

type Playlist = {
  id: string;
  name: string;
};

export async function fetchSpotifyPlaylists(): Promise<Playlist[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    console.error("No Spotify access token found in cookies.");
    return [];
  }
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: { Authorization: `Bearer ${accessToken.value}` },
        params: { limit: 50, offset: 0 },
      },
    );
    const items: SpotifyPlaylistRaw[] = response.data.items;
    return items.map((pl) => ({ id: pl.id, name: pl.name, link: pl.href }));
  } catch (error: any) {
    console.error(
      "Error fetching Spotify playlists",
      error?.response?.data || error,
    );
    return [];
  }
}

export async function fetchYtMusicPlaylists(): Promise<Playlist[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ytmusic_access_token");
  if (!accessToken) {
    console.error("No YTMusic access token found in cookies.");
    return [];
  }
  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    const data = await response.json();
    console.log("ytmusic resp data is: ", data);
    const items =
      data.items?.map(
        (playlist: { id: string; snippet: { title: string } }) => ({
          id: playlist.id,
          name: playlist.snippet.title,
        }),
      ) || [];
    return items;
  } catch (error) {
    console.error("Error fetching YTMusic playlists", error);
    return [];
  }
}
