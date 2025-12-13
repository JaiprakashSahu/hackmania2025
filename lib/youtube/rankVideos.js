
/**
 * STEP 4: Rank ONLY VERIFIED VIDEOS
 * 70% Views, 30% Likes
 */
export function rankVideos(videos) {
    if (!videos || !videos.length) return [];

    return videos
        .map(v => {
            const viewCount = Number(v.statistics?.viewCount || 0);
            const likeCount = Number(v.statistics?.likeCount || 0);

            return {
                id: v.id,
                title: v.snippet.title,
                channel: v.snippet.channelTitle,
                views: viewCount,
                likes: likeCount,
                thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
                // Score Calculation
                score: (viewCount * 0.7) + (likeCount * 0.3)
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3
}
