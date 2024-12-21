import axios from "axios";
import querystring from "querystring";
import { NextResponse } from "next/server";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function getAccessToken() {
  const cookieStore = request.cookies;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // checking for refresh token in cookies. If there, continue. Else, get new one.

  // getting a new access token using the refresh token
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

    const accessToken = response.data.access_token;

    const nextResponse = NextResponse.next();

    // setting the newly obtained access token in the cookie.
    nextResponse.cookies.set("spotify_access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 3600,
    });

    return {
      accessToken,
      response: nextResponse,
    };
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response ? error.response.data : error.message,
    );
    throw new Error("Failed to refresh access token");
  }
}

// helper function to save both tokens at once.
export function setTokens(accessToken, refreshToken) {
  const response = NextResponse.next();

  // Set access token cookie
  response.cookies.set("spotify_access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 3600, // 1 hour expiry for access token
  });

  // Set refresh token cookie
  response.cookies.set("spotify_refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days expiry for refresh token
  });

  return response;
}
