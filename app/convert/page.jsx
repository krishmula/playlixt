import axios from "axios";
import { headers } from "next/headers";
import PlaylistSelector from "@/components/playlist-selector";

async function fetchPlaylists(accessToken) {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.spotify.com/v1/me/playlists",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
        offset: 0,
      },
    });

    console.log("response data is: ", response.data.items);
    return response.data.items;
  } catch (error) {
    console.error("Error fetching playlists", error);
    return [];
  }
}

export default async function Convert() {
  const headersList = headers();
  const accessToken = headersList.get("x-spotify-token");
  const playlists = accessToken ? await fetchPlaylists(accessToken) : [];

  return (
    <main className="ml-96 min-h-screen flex justify-center">
      <PlaylistSelector playlists={playlists} />
    </main>
  );
}
