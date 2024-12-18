'use client'

import { Button } from '@/components/ui/button';
import { AiOutlineSpotify } from "react-icons/ai";

export default function Home() {

  const handleLogin = () => {
    console.log("Login Button Clicked");
    window.location.href = '/api/login';
  }
  
  return (
    <>
      <div className="p-20">
        <p className="text-5xl text-zinc">Look at your Spotify Playlists</p>
      </div>
      <div className="pl-20 pr-20 pb-20">
        <Button onClick={handleLogin} className="bg-black text-white">
          <AiOutlineSpotify className="mr-2 h-7 w-7" />
          Login to Spotify
        </Button>
      </div>
    </>
  );
}
