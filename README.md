### How the convert feature works

- First, we call the /convert api route with some details.
  - The details being: source, destination, source_playlist_link.
  - Now, based on the source, we take the source playlist link, call the relevant api, and get the name of the playlist, and list of all tracks.
  - Then, we create a new playlist on the destination with the same name as the source playlist.
  - And then, we use the destination api to search for each track, and then find the track on the destination, and then push it to the playlist.
  - Return the destination playlist.
