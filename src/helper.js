export function updateLastPlayListInLocalStore(videos) {
  // fetch to get lat played videos
  const savedVideos = localStorage.getItem("savedVideos");
  console.log(JSON.stringify(savedVideos));
  // save sanitized videos to local storage
  localStorage.setItem(
    "savedVideos",
    JSON.stringify({
      lastPlayed: videos,
    })
  );
}

export function getLastPlayListFromLocalStore() {
  // fetch to get lat played videos
  const savedVideos = localStorage.getItem("savedVideos");
  return JSON.parse(savedVideos)?.lastPlayed ?? [];
}
