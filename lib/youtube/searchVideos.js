
/**
 * STEP 1: Search (IDs ONLY)
 * Fetches 15 video IDs to ensure a good pool for filtering.
 */
export async function searchYouTubeIds(query) {
    if (!process.env.YOUTUBE_API_KEY) {
        console.error("❌ Missing YOUTUBE_API_KEY");
        return [];
    }

    try {
        const res = await fetch(
            "https://www.googleapis.com/youtube/v3/search?" +
            new URLSearchParams({
                part: "id",
                q: query,
                type: "video",
                maxResults: "15",
                safeSearch: "strict",
                key: process.env.YOUTUBE_API_KEY,
            })
        );

        if (!res.ok) {
            console.error(`❌ YouTube Search Error: ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        return data.items
            ?.map(i => i.id?.videoId)
            .filter(Boolean) || [];
    } catch (error) {
        console.error("❌ YouTube Search Failed:", error);
        return [];
    }
}
