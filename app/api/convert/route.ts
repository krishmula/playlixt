import { getSpotifyTrackNames } from "@/lib/spotify-tracks";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { source, destination, source_playlist } = await req.json();
  console.log("source is: ", source);
  console.log("destination is: ", destination);
  console.log("source_playlist is: ", source_playlist);

  try {
    if (source === "spotify") {
      const { spotifyPlaylistResponse, spotifyTracksNames } =
        await getSpotifyTrackNames(source_playlist);

      if (!spotifyTracksNames) {
        console.error(
          "Spotify API error:",
          spotifyPlaylistResponse,
          // spotifyPlaylistResponse.status,
          // spotifyPlaylistResponse.statusText,
        );
        return NextResponse.json({
          error: `Failed to fetch playlist: ${spotifyPlaylistResponse}`,
        });
      }
      return NextResponse.json({ message: "Spotify Playlist data fetched" });
    } else {
      // Handle other sources (YouTube Music, etc.)
      return NextResponse.json(
        { error: "Source not supported yet" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 },
    );
  }
}
