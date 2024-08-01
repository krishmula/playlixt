'use client'

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bggkcjhqetwpugypahcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ2tjamhxZXR3cHVneXBhaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0NDM4MjYsImV4cCI6MjAzODAxOTgyNn0.KtcTzCVf2tqr8I0Nvp6QV5f-2ltzCfIo_DpjhuV4AcM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fetchPlaylists = async () => {
  const { data, error } = await supabase.from('playlists').select('*');

  if (error) {
    console.error('Error fetching playlists', error);
    return [];
  }

  return data;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const getPlaylists = async () => {
      const data = await fetchPlaylists();
      setPlaylists(data);
    }
    getPlaylists();
  }, []);
  
  return (
    <>
      <div className="p-20">
        <h1>My Playlists</h1>
        {playlists.length === 0 ? (
          <p>No playlists found</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {playlists.map((playlist) => (
              <Card className="w-[350px]" key={playlist.id}>
                <CardHeader>
                  <CardTitle className="h-[50px]">{playlist.name}</CardTitle>
                  {/* <CardDescription className="h-[30px]">{playlist.description}</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <img className="p-2" src={playlist.image_url} alt={playlist.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                  <p className="p-2">Owner: {playlist.owner_display_name}</p>
                </CardContent>
                <CardFooter>
                  <Button className="p-4">
                    <a href={playlist.spotify_url}>Listen on Spotify</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
