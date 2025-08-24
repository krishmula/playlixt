import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import querystring from "querystring";

const generateRandomString = (length: number) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function GET() {
  const state = generateRandomString(16);
  const scope =
    "user-library-read user-read-private user-read-email playlist-modify-public playlist-read-private playlist-read-collaborative playlist-modify-private";

  const cookieStore = await cookies();
  cookieStore.set("spotify_auth_state", state, { maxAge: 3600 });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
    });

  return NextResponse.redirect(authUrl);
}
