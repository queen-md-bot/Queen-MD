// ✅ Coded by JawadTechX for KHAN MD
// ⚙️ API: https://jawad-tech.vercel.app/download/ytdl?url=

const { cmd } = require('../inconnuboy');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "drama",
    alias: ["ep", "episode"],
    desc: "Download YouTube videos as document (via Drkamran API)",
    category: "download",
    react: "📺",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🎥 Please provide a YouTube video name or URL!\n\nExample: `.drama kabhi main kabhi tum ep5`");

        let url = q;
        let videoInfo = null;

        // 🔍 Detect URL or Search by Title
        if (q.startsWith('http://') || q.startsWith('https://')) {
            if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
                return await reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(q);
            if (!videoId) return await reply("❌ Invalid YouTube URL!");
            const searchFromUrl = await yts({ videoId });
            videoInfo = searchFromUrl;
        } else {
            const search = await yts(q);
            videoInfo = search.videos[0];
            if (!videoInfo) return await reply("❌ No video results found!");
            url = videoInfo.url;
        }

        // 🎯 Extract video ID
        function getVideoId(url) {
            const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            return match ? match[1] : null;
        }

        // 🖼️ Send thumbnail preview
        await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: `*🎬 DRAMA DOWNLOADER*\n\n🎞️ *Title:* ${videoInfo.title}\n📺 *Channel:* ${videoInfo.author.name}\n🕒 *Duration:* ${videoInfo.timestamp}\n\n*Status:* Download Drama...\n\n*© Power by Queen MD*`
        }, { quoted: mek });

        // ⚙️ Fetch from working yt-dl API (jawad-tech broken tha)
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl, { timeout: 25000 });

        // Best available video quality
        let videoUrl = null;
        if (data?.status && data?.videos) {
            for (const q of ['360', '240', '144']) {
                if (data.videos[q]) { videoUrl = data.videos[q]; break; }
            }
            if (!videoUrl) {
                const keys = Object.keys(data.videos);
                if (keys.length) videoUrl = data.videos[keys[0]];
            }
        }

        if (!videoUrl) {
            return await reply("❌ Failed to fetch download link! Please try again later.");
        }

        const vidTitle = data.title || 'Drama Video';

        // 📦 Send as document (.mp4)
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            fileName: `${vidTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `🎬 *${vidTitle}*\n\n*Power by Queen MD*`
        }, { quoted: mek });

        // ✅ React success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ Error in .drama command:", e);
        await reply("⚠️ Something went wrong! Try again later.");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
