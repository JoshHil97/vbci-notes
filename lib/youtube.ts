export function getYouTubeVideoId(url: string) {
  try {
    if (url.includes("youtube.com/embed/")) {
      return url.split("youtube.com/embed/")[1]?.split(/[/?#&]/)[0] ?? null;
    }

    const parsedUrl = new URL(url);

    const watchId = parsedUrl.searchParams.get("v");
    if (watchId) return watchId;

    if (parsedUrl.hostname === "youtu.be") {
      const shortId = parsedUrl.pathname.replace("/", "");
      return shortId || null;
    }

    if (parsedUrl.pathname.startsWith("/live/")) {
      return parsedUrl.pathname.split("/live/")[1]?.split(/[/?#&]/)[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnailUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
