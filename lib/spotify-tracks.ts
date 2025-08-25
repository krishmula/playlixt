import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getSpotifyTrackNames(source_playlist) {
  const cookieStore = await cookies();
  const spotify_access_token = cookieStore.get("spotify_access_token")?.value;
  if (!spotify_access_token) {
    return NextResponse.json(
      { error: "No Spotify access token found. Please login first." },
      { status: 401 },
    );
  }

  const spotifyPlaylistResponse = await fetch(`${source_playlist}`, {
    headers: {
      Authorization: `Bearer ${spotify_access_token}`,
    },
  });

  const spotifyPlaylistData = await spotifyPlaylistResponse.json();
  console.log("spotityPlaylistData is: ", spotifyPlaylistData);
  const items = spotifyPlaylistData?.tracks?.items ?? [];
  const trackEntities = items
    .filter((i: any) => i && i.track)
    .map((i: any) => i.track);

  console.log("spotify tracks are: ", trackEntities);

  const spotifyTracksNames = trackEntities.map((track: any) => ({
    name: track.name,
    album: track.album?.name,
    artists: (track.artists || []).map((a: any) => a.name),
  }));
  console.log("spotifyTracksNames is: ", spotifyTracksNames);

  return NextResponse.json({
    spotifyPlaylistResponse: spotifyPlaylistResponse,
    spotifyTracksNames: spotifyTracksNames,
  });
}
