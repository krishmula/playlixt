'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bggkcjhqetwpugypahcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ2tjamhxZXR3cHVneXBhaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0NDM4MjYsImV4cCI6MjAzODAxOTgyNn0.KtcTzCVf2tqr8I0Nvp6QV5f-2ltzCfIo_DpjhuV4AcM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const extractPlaylistData = (apiResponse) => {
  return apiResponse.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    description:playlist.description,
    image_url: playlist.images[0]?.url,
    owner_display_name: playlist.owner.display_name,
    spotify_url: playlist.external_urls.spotify,
  }));
}

const insertPlaylistData = async (playlists) => {
  const { data, error } = await supabase
    .from('playlists') // replace with your table name
    .insert(playlists);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully:', data);
  }
};

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
    let items = response.data.items;
    const playlists = extractPlaylistData(items);
    await insertPlaylistData(playlists);
    console.log(response.data.items);
  } catch (error) {
    console.error('Error fetching the tracks in your playlist', error);
  }
}

export default function Test() {
  const searchParams = useSearchParams();
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');

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
