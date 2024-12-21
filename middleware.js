import { NextResponse } from "next/server";
import axios from "axios";
import { getAccessToken } from "./app/utils/spotify";

export async function middleware(request) {
  const accessToken = request.cookies.get("spotify_access_token")?.value;
  // get the access token from the intercepted requests cookies.

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // if accessToken isn't present, redirect to login page.

  try {
    // call spotify api using accessToken to check if it's valid.
    await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // pass the accessToken to the destination component via headers.
    const response = NextResponse.next();
    response.headers.set("x-spotify-token", accessToken);

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // the accessToken has expired, and is going to be refreshed.
      try {
        const { accessToken: newAccessToken, response } =
          await getAccessToken(request);
        response.headers.set("x-spotify-token", newAccessToken);
        return response;
      } catch (refreshError) {
        // there was an error refreshing the accessToken. So, we redirect to login page.
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      // there is an error in the middleware, so we throw this error.
      return NextResponse.json(
        { error: "Failed to authenticate with Spotify" },
        { status: 500 },
      );
    }
  }
}

export const config = {
  matcher: ["/convert"],
};
