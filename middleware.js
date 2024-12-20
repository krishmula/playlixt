import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from './utils/spotify';

export async function middleware(request) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return NextResponse.next();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Access Token Expired. Refreshing...');
      try {
        const { accessToken: newAccessToken, response } = await getAccessToken(request);
        return response;
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } else {
      console.error('Error in middleware:', error);
      return NextResponse.json(
        { error: 'Failed to authenticate with Spotify' },
        { status: 500 }
      );
    }
  }
}

export const config = {
  matcher: ['/protected-route', '/another-protected-route']
};
