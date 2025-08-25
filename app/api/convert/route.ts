import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { source, destination, source_playlist } = await req.json();
  console.log("source is: ", source);
  console.log("destination is: ", destination);
  console.log("source_playlist is: ", source_playlist);

  if (source === "spotify") {
    // const spotifyPlaylist =
  } else {
    // const ytMusicPlaylist =
  }

  return NextResponse.json({ message: "Conversion done" }, { status: 200 });
}
