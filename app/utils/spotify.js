import axios from 'axios';
import querystring from 'querystring';
import { cookies } from 'next/headers';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function getAccessToken() {
  const refreshToken = cookies().get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    // Update the access token cookie
    cookies().set('spotify_access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to refresh access token');
  }
}

export function setTokens(accessToken, refreshToken) {
  cookies().set('spotify_access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
  cookies().set('spotify_refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
}

