import { cookies } from "next/headers";

export async function getSpotifyTrackNames(source_playlist: string) {
  const cookieStore = await cookies();
  const spotify_access_token = cookieStore.get("spotify_access_token")?.value;
  if (!spotify_access_token) {
    throw new Error("No Spotify access token found. Please login first.");
  }

  console.log("Fetching Spotify playlist from:", source_playlist);

  const spotifyPlaylistResponse = await fetch(`${source_playlist}`, {
    headers: {
      Authorization: `Bearer ${spotify_access_token}`,
    },
  });

  if (!spotifyPlaylistResponse.ok) {
    throw new Error(`Failed to fetch Spotify playlist: ${spotifyPlaylistResponse.status}`);
  }

  const spotifyPlaylistData = await spotifyPlaylistResponse.json();
  console.log("Spotify playlist data keys:", Object.keys(spotifyPlaylistData));
  console.log("Total tracks in playlist:", spotifyPlaylistData.total);
  
  // The tracks are directly in the items array, not nested under tracks
  const items = spotifyPlaylistData?.items ?? [];
  console.log("Number of track items found:", items.length);

  const trackEntities = items
    .filter((i: any) => i && i.track)
    .map((i: any) => i.track);

  console.log("Number of valid track entities:", trackEntities.length);

  const spotifyTracksNames = trackEntities.map((track: any) => ({
    name: track.name,
    album: track.album?.name,
    artists: (track.artists || []).map((a: any) => a.name),
  }));

  console.log("Processed track names:", spotifyTracksNames);

  return {
    spotifyPlaylistData: spotifyPlaylistData,
    spotifyTracksNames: spotifyTracksNames,
  };
}
