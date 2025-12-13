
import { searchYouTubeIds } from "./searchVideos";
import { validateByAPI } from "./validateVideos";
import { embedProbe } from "./embedProbe";
import { rankVideos } from "./rankVideos";

/**
 * FINAL SAFE PIPELINE ORCHESTRATOR
 * 1. Search ids (15)
 * 2. Validate API (Strict)
 * 3. Slice top 8
 * 4. Probe Embed (Cached)
 * 5. Rank & Return 3
 */
export async function getSafeYouTubeVideos(query) {
    console.log(`🔍 Pipeline Start: "${query}"`);

    // Phase 1: Search
    const ids = await searchYouTubeIds(query);
    if (ids.length === 0) {
        console.log(`⚠️ Search returned 0 IDs`);
        return getFallback();
    }

    // Phase 2: API Validation
    const apiValid = await validateByAPI(ids);
    console.log(`✨ API Validated: ${apiValid.length}/${ids.length}`);

    // Phase 3: Limit Candidates to avoid throttling
    const candidates = apiValid.slice(0, 8); // Top 8 most relevant from API search

    // Phase 4: Embed Probe
    const embedValid = [];
    for (const v of candidates) {
        const ok = await embedProbe(v.id);
        if (ok) embedValid.push(v);
    }
    console.log(`🎥 Embed Verified: ${embedValid.length}/${candidates.length}`);

    if (embedValid.length === 0) {
        return getFallback();
    }

    // Phase 5: Rank & Format
    const final = rankVideos(embedValid).map(v => ({
        title: v.title,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        embedUrl: `https://www.youtube.com/embed/${v.id}`, // Helper for frontend
        channelTitle: v.channel, // Normalized key
        views: v.views,
        likes: v.likes,
        thumbnail: v.thumbnail
    }));

    if (final.length === 0) return getFallback();

    return final;
}

function getFallback() {
    // Explicit Hard Fallback
    return [{
        title: "No verified videos available for this module yet.",
        url: null
    }];
}
