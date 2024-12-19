import { cookies } from 'next/headers';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { DataTable } from '@/components/data-table';

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

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "noOfTracks",
    header: "Tracks",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
];

export default async function PlaylistsPage() {

  const cookieStore = cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const playlists = accessToken ? await fetchPlaylists(accessToken) : [];

  return (
    <div className="p-20">
      <div>
        {playlists.length === 0 ? (
          <div>No Playlists found</div>
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id}>
                <Card className="bg-zinc-100 opacity-90 h-[420px] w-80">
                  <CardHeader className="mx-auto">
                    <CardTitle className="text-lg truncate overflow-hidden whitespace-nowrap">{playlist.name}</CardTitle>
                    <CardDescription>
                      <div>Number of Tracks: {playlist.tracks.total}</div>
                      <div>Owner: {playlist.owner.display_name}</div>
                    </CardDescription>
                  </CardHeader>
                  <div>
                    <CardContent>
                      <img className="h-52 w-52 mx-auto" src={playlist.images[0].url} alt={playlist.name} />
                    </CardContent>
                  </div>
                  <CardFooter>
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
      {/* <div> */}
      {/*   <DataTable data={playlists} columns={columns} /> */}
      {/* </div> */}
    </div>
  );
}
