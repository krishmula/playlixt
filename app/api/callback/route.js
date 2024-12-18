import { NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';
import { cookies } from 'next/headers';
// import { setTokens } from '../../../utils/spotify';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  console.log('code is: ', code);
  console.log('state is: ', state);
  const storedState = cookies().get('spotify_auth_state')?.value;

  if (state === null || state !== storedState) {
    return NextResponse.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    cookies().delete('spotify_auth_state');

    try {
      const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }), {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
      console.log('access-token', accessToken);
      console.log('refresh-token', refreshToken);

      // Set cookies
      // setTokens(accessToken, refreshToken);
      cookies().set('spotify_access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
      cookies().set('spotify_refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });


      return NextResponse.redirect('http://localhost:3000/playlists?' + querystring.stringify({ access_token: accessToken, refresh_token: refreshToken }));
    } catch (error) {
      console.error('Error in /callback:', error.response ? error.response.data : error.message);
      return NextResponse.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
    }
  }
}

