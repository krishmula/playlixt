import { cookies } from 'next/headers';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

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


export default async function PlaylistsPage() {

  const cookieStore = cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const playlists = accessToken ? await fetchPlaylists(accessToken) : [];

  return (
    <div className="p-20">
      {playlists.length === 0 ? (
        <div>No Playlists found</div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id}>
              <Card className="bg-zinc-300 opacity-90 h-96 w-80">
                <CardHeader className="mx-auto">
                  <CardTitle className="text-lg truncate overflow-hidden whitespace-nowrap">{playlist.name}</CardTitle>
                </CardHeader>
                <div>
                  <CardContent>
                    <img className="h-52 w-52 mx-auto" src={playlist.images[0].url} alt={playlist.name} />
                  </CardContent>
                </div>
                <CardFooter>
                  {/* <Button className="bg-gray-50 mx-auto" onClick={handleRedirect(playlist.external_urls.spotify)}>Open in Spotify</Button> */}
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 mx-auto px-4 py-2 rounded-md"
                    >
                      Open in Spotify
                    </a>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
