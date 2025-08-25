import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  fetchSpotifyPlaylists,
  fetchYtMusicPlaylists,
} from "@/app/utils/playlists";

async function getAccessToken() {
  // Implement logic to get or refresh the access token as needed
  // This is a placeholder function
  return "your-access-token";
}

export async function GET() {
  try {
    const spotifyPlaylists = await fetchSpotifyPlaylists();
    console.log("spotifyPlaylists is: ", spotifyPlaylists);
    const ytmusicPlaylists = await fetchYtMusicPlaylists();
    return NextResponse.json({
      spotify: spotifyPlaylists,
      ytmusic: ytmusicPlaylists,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch playlists with error ${error}` },
      { status: 500 },
    );
  }
}
