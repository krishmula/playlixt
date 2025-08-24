import { NextResponse } from "next/server";
import axios from "axios";

async function getAccessToken() {
  // Implement logic to get or refresh the access token as needed
  // This is a placeholder function
  return "your-access-token";
}

export async function POST(request) {
  const { userId, name, description } = await request.json();

  if (!userId || !name) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: name,
        description: description,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Error creating playlist:",
      error.response ? error.response.data : error.message,
    );
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 },
    );
  }
}
