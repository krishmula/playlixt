import { getSpotifyTrackNames } from "@/lib/spotify-tracks";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { source, destination, source_playlist, spotify_name } =
    await req.json();
  console.log("source is: ", source);
  console.log("destination is: ", destination);
  console.log("source_playlist is: ", source_playlist);
  console.log("spotify_name is: ", spotify_name);
  const part = "snippet,status";
  const cookieStore = await cookies();
  const ytAccessToken = cookieStore.get("ytmusic_access_token");

  if (!ytAccessToken?.value) {
    return NextResponse.json(
      { error: "No YouTube Music access token found. Please login first." },
      { status: 401 },
    );
  }

  try {
    if (source === "spotify") {
      console.log("Processing Spotify to YouTube conversion");
      console.log("Source playlist URL:", source_playlist);
      
      // Test the Spotify API call directly first
      const cookieStore = await cookies();
      const spotify_access_token = cookieStore.get("spotify_access_token")?.value;
      if (spotify_access_token) {
        console.log("Testing direct Spotify API call...");
        const testResponse = await fetch(source_playlist, {
          headers: {
            Authorization: `Bearer ${spotify_access_token}`,
          },
        });
        console.log("Test response status:", testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log("Test response data structure:", Object.keys(testData));
          if (testData.tracks) {
            console.log("Tracks structure:", Object.keys(testData.tracks));
            console.log("Number of track items:", testData.tracks.items?.length);
          }
        }
      }
      
      const spotifyData = await getSpotifyTrackNames(source_playlist);
      console.log("Spotify data received:", spotifyData);
      
      const { spotifyTracksNames } = spotifyData;
      console.log("Extracted spotifyTracksNames:", spotifyTracksNames);
      console.log("Number of tracks:", spotifyTracksNames?.length);

      if (!spotifyTracksNames || spotifyTracksNames.length === 0) {
        return NextResponse.json(
          { error: "No tracks found in the Spotify playlist" },
          { status: 400 },
        );
      }

      const requestBody = {
        snippet: {
          title: spotify_name,
          description: "Created by playlixt",
        },
        status: {
          privacyStatus: "public",
        },
      };

      // First, create the YouTube playlist
      const createYtMusicPlaylist = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=${part}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ytAccessToken.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!createYtMusicPlaylist.ok) {
        const errorData = await createYtMusicPlaylist.json();
        console.error("YouTube API error:", errorData);
        return NextResponse.json(
          {
            error: `Failed to create YouTube playlist: ${errorData.error?.message || "Unknown error"}`,
          },
          { status: createYtMusicPlaylist.status },
        );
      }

      const playlistData = await createYtMusicPlaylist.json();
      const playlistId = playlistData.id;

      console.log("Created YouTube playlist with ID:", playlistId);

      // Now search for YouTube videos for each track and add them to the playlist
      let addedTracks = 0;
      for (const track of spotifyTracksNames) {
        try {
          // Search for the track on YouTube
          const searchQuery = `${track.name} ${track.artists.join(" ")}`;
          const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=1`,
            {
              headers: {
                Authorization: `Bearer ${ytAccessToken.value}`,
              },
            },
          );

          if (!searchResponse.ok) {
            console.error(`Failed to search for track: ${track.name}`);
            continue;
          }

          const searchData = await searchResponse.json();
          const videoId = searchData.items?.[0]?.id?.videoId;

          if (!videoId) {
            console.error(`No video found for track: ${track.name}`);
            continue;
          }

          // Add the video to the playlist
          const addToPlaylistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ytAccessToken.value}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                snippet: {
                  playlistId: playlistId,
                  resourceId: {
                    kind: "youtube#video",
                    videoId: videoId,
                  },
                },
              }),
            },
          );

          if (addToPlaylistResponse.ok) {
            addedTracks++;
            console.log(`Added track: ${track.name}`);
          } else {
            console.error(`Failed to add track: ${track.name}`);
          }
        } catch (error) {
          console.error(`Error processing track ${track.name}:`, error);
        }
      }

      return NextResponse.json({
        message: `Successfully created YouTube playlist with ${addedTracks} tracks`,
        playlistId: playlistId,
        totalTracks: spotifyTracksNames.length,
        addedTracks: addedTracks,
      });
    } else {
      // Handle other sources (YouTube Music, etc.)
      return NextResponse.json(
        { error: "Source not supported yet" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error in playlist conversion:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to convert playlist",
      },
      { status: 500 },
    );
  }
}
