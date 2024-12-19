import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { cookies } from "next/headers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


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
      <div className="flex flex-col space-y-8 items-center w-full max-w-md px-4">
        <div className="text-center w-full">
          <h1 className="text-2xl font-extrabold mb-4">
            What playlist are we converting today?
          </h1>
          <div className="flex justify-center">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select the Playlist" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Playlists</SelectLabel>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.name}>{playlist.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center w-full">
          <h1 className="text-2xl font-extrabold mb-4">
            What service are we converting it to?
          </h1>
          <div className="flex justify-center">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select the Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Service</SelectLabel>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="appleMusic">Apple Music</SelectItem>
                  <SelectItem value="ytMusic">Youtube Music</SelectItem>
                  <SelectItem value="soundcloud">Soundcloud</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  );
}
