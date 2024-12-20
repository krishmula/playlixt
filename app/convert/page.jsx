import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PlaylistSelector from "@/components/playlist-selector";
import { getAccessToken } from "../utils/spotify";


async function fetchPlaylists(accessToken) {
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

    console.log("response data is: ", response.data.items);
    return response.data.items;
  } catch (error) {
    console.error("Error fetching playlists", error);
    return [];
  }
}

export default async function Convert() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;


  if (!accessToken) {
    redirect('/login');
  }

  const playlists = accessToken ? await fetchPlaylists(accessToken) : [];

  return (
    <main className="ml-96 min-h-screen flex justify-center">
      <PlaylistSelector playlists={playlists} />
    </main>
  );
}
