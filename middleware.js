import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessToken } from './utils/spotify';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const accessToken = cookies().get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.redirect('/login');
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
        const newAccessToken = await getAccessToken();
        cookies().set('spotify_access_token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
        return NextResponse.next();
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        return NextResponse.redirect('/login');
      }
    } else {
      console.error('Error in middleware:', error);
      return NextResponse.status(500).json({ error: 'Failed to authenticate with Spotify' });
    }
  }
}

export const config = {
  matcher: ['/protected-route', '/another-protected-route']
};

