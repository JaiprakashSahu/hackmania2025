
import { cache } from "@/lib/cache";

/**
 * STEP 3: EMBED PROBE (CRITICAL)
 * Actively probes the embed URL to check for "Video unavailable".
 * Caches results for 24h to avoid throttling.
 */
export async function embedProbe(videoId) {
    if (!videoId) return false;

    const CACHE_KEY = `yt_embed_ok:${videoId}`;
    const TTL_SECONDS = 60 * 60 * 24; // 24 hours

    // 1. Check Cache
    const cached = await cache.get(CACHE_KEY);
    if (cached !== null) {
        // If we have a cached boolean, trust it
        return cached === true;
    }

    // 2. Probe Live
    try {
        // We use a HEAD request first if possible, but GET is safer for checking content body
        const res = await fetch(
            `https://www.youtube.com/embed/${videoId}`,
            {
                method: "GET",
                headers: {
                    // Emulate a browser to avoid bot detection being too aggressive
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            }
        );

        if (!res.ok) {
            // 404/403/etc -> definitely bad
            await cache.set(CACHE_KEY, false, TTL_SECONDS);
            return false;
        }

        const html = await res.text();

        // 3. Detect Failure Markers
        const isUnavailable =
            html.includes("Video unavailable") ||
            html.includes("This video is unavailable") ||
            html.includes("Playback on other websites has been disabled") ||
            html.includes("Post-live processing"); // common for just-ended streams

        const isValid = !isUnavailable;

        // 4. Cache Result
        await cache.set(CACHE_KEY, isValid, TTL_SECONDS);

        if (!isValid) {
            console.log(`🚫 Probe Failed [${videoId}]: Video unavailable in embed`);
        }

        return isValid;
    } catch (error) {
        console.error(`⚠️ Probe Error [${videoId}]:`, error);
        // On network error, assume false but maybe shorter cache or no cache? 
        // Safest is to treat as fail for now to ensure UI stability.
        return false;
    }
}
