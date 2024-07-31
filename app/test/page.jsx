'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

async function showPlaylists() {
  let accessToken = localStorage.getItem('access_token');
  let refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
        offset: 0,
      }
    });
    items = response.data.items;
    // return items;
    console.log(response.data.items);
  } catch (error) {
    console.error('Error fetching the tracks in your playlist', error);
  }
}

export default function Test() {
  const searchParams = useSearchParams();
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');
  // const [data, setData] = useState(null); 

  useEffect(() => {
    if (access_token && refresh_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
  }, [access_token, refresh_token]);
  
  return (
    <>
      <div className="m-5 p-10">
        <h1>Playlist</h1>
        <Button onClick={showPlaylists}>Show my Playlists</Button>
      </div>
    </>
  )
}
