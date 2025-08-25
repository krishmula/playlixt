import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.replace("Bearer ", "");

  try {
    // Fetch user's playlists from YouTube Data API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match your expected format
    const items =
      data.items?.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnails: playlist.snippet.thumbnails,
        itemCount: playlist.contentDetails?.itemCount || 0,
      })) || [];

    console.log("ytmusic items are: ", items);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching YouTube playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
