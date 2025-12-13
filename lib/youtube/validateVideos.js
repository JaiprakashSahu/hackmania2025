
/**
 * STEP 2: API Validation (STRICT)
 * Checks metadata for privacy, embeddability, region, and explicit Shorts blocking.
 */
export async function validateByAPI(videoIds) {
    if (!videoIds || !videoIds.length) return [];
    if (!process.env.YOUTUBE_API_KEY) return [];

    try {
        const res = await fetch(
            "https://www.googleapis.com/youtube/v3/videos?" +
            new URLSearchParams({
                part: "snippet,status,statistics,contentDetails",
                id: videoIds.join(","),
                key: process.env.YOUTUBE_API_KEY,
            })
        );

        if (!res.ok) {
            console.error(`❌ YouTube Validation Error: ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        if (!data.items) return [];

        return data.items.filter(v => {
            const status = v.status || {};
            const details = v.contentDetails || {};
            const stats = v.statistics || {};
            const snippet = v.snippet || {};

            // 1. Basic Availability Checks
            if (status.privacyStatus !== "public") return false;
            if (status.embeddable !== true) return false;
            if (details.regionRestriction?.blocked) return false;

            // 2. Content Quality Checks
            if (snippet.liveBroadcastContent && snippet.liveBroadcastContent !== "none") return false; // No live streams
            if (!stats.viewCount || Number(stats.viewCount) <= 0) return false;

            // 3. Strict Shorts Blocking
            const title = snippet.title?.toLowerCase() || "";
            const description = snippet.description?.toLowerCase() || "";
            if (title.includes("#shorts") || description.includes("#shorts")) return false;
            // Heuristic: Shorts are often vertical, but API doesn't always show dimensions clearly here. 
            // The #shorts tag is the most reliable metadata signal.

            return true;
        });
    } catch (error) {
        console.error("❌ YouTube Validation Failed:", error);
        return [];
    }
}
