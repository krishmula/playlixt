import { cookies } from "next/headers";
import axios from "axios";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  tracks: { total: number };
  owner: { display_name: string };
  external_urls: { spotify: string };
}

interface SpotifyApiError {
  response?: {
    status: number;
    data: {
      error: {
        message: string;
        status: number;
      };
    };
  };
  message: string;
}

async function fetchPlaylists(accessToken: string, refreshToken?: string): Promise<SpotifyPlaylist[]> {
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
    const apiError = error as SpotifyApiError;
    console.error("Error fetching playlists", apiError.response?.status);
    // If the error is due to an expired token and we have a refresh token
    if (apiError.response?.status === 401 && refreshToken) {
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post('/api/refresh-token', {
          refreshToken,
        });
        
        const newAccessToken = refreshResponse.data.accessToken;
        
        // Retry the request with the new token
        const retryResponse = await axios({
          method: "get",
          url: "https://api.spotify.com/v1/me/playlists",
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
          params: {
            limit: 50,
            offset: 0,
          },
        });
        
        return retryResponse.data.items;
      } catch (refreshError) {
        console.error("Error refreshing token", refreshError);
        return [];
      }
    }
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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
  console.log("accessToken in Playlists Page is: ", accessToken);
  console.log("refreshToken in Playlists Page is: ", refreshToken);

  if (!accessToken || !refreshToken) {
    redirect("/login");
  }

  const playlists: SpotifyPlaylist[] = await fetchPlaylists(accessToken, refreshToken);

  return (
    <div className="w-full px-6 py-8">
      <div className="min-h-screen">
        {playlists.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-500">No Playlists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex justify-center">
                <Card className="w-full bg-zinc-100/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ease-in-out">
                  <CardHeader className="px-6">
                    <CardTitle className="text-xl font-semibold truncate overflow-hidden whitespace-nowrap mb-2">
                      {playlist.name}
                    </CardTitle>
                    <CardDescription className="space-y-1.5">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {playlist.tracks.total}
                        </span>{" "}
                        tracks
                      </div>
                      <div className="text-sm text-gray-600">
                        By{" "}
                        <span className="font-medium">
                          {playlist.owner.display_name}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg relative bg-white/5">
                      <Image
                        className="object-cover transform hover:scale-105 transition-transform duration-300"
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-6">
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200"
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
