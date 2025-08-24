import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";
import { cookies } from "next/headers";
// import { setTokens } from '../../../utils/spotify';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("spotify_auth_state")?.value;

  if (state === null || state !== storedState) {
    return NextResponse.redirect(
      "/#" + querystring.stringify({ error: "state_mismatch" }),
    );
  } else {
    const cookieStore = await cookies();
    cookieStore.delete("spotify_auth_state");

    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
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

      const accessToken = tokenResponse.data.access_token;
      console.log("accessToken in api/callback is: ", accessToken);
      const refreshToken = tokenResponse.data.refresh_token;
      console.log("refreshToken in api/callback is: ", refreshToken);

      // Set cookies
      const cookieStore = await cookies();
      cookieStore.set("spotify_access_token", accessToken, {
        httpOnly: true,
        secure: false, // Disabled for local development
        sameSite: "lax",
        path: "/",
        maxAge: 3600, // 1 hour
      });
      cookieStore.set("spotify_refresh_token", refreshToken, {
        httpOnly: true,
        secure: false, // Disabled for local development
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return NextResponse.redirect(
        "http://localhost:3000/playlists?" +
          querystring.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { data: { error: string } };
        message?: string;
      };
      console.error(
        "Error in /callback:",
        err.response ? err.response.data : err.message,
      );
      return NextResponse.redirect(
        "/#" + querystring.stringify({ error: "invalid_token" }),
      );
    }
  }
}
