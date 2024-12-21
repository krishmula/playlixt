import { NextResponse } from "next/server";
import querystring from "querystring";
import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function POST(request) {
  const body = await request.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token available" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const newAccessToken = response.data.access_token;
    console.log("New Access Token:", newAccessToken);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response ? error.response.data : error.message,
    );
    return NextResponse.json(
      { error: "Failed to refresh access token" },
      { status: 500 },
    );
  }
}
