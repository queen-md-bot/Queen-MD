//---------------------------------------------------------------------------
//           Queen MD - FACEBOOK VIDEO DOWNLOADER
//---------------------------------------------------------------------------
//  🚀 HIGH-SPEED FB VIDEO DOWNLOADS (LID & NEWSLETTER SUPPORT)
//---------------------------------------------------------------------------

const { cmd } = require('../inconnuboy');
const axios = require('axios');
const config = require('../config');
const { getNewsletterContext } = require('../lib/channel');

/**
 * Facebook Downloader — uses jawad-tech downloader API
 * (fsaver.net scraper broken tha: homepage par redirect karta hai)
 */
async function fbDownload(videoUrl) {
    try {
        const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl, { timeout: 25000 });
        if (data && data.status === true && data.result && data.result.length > 0) {
            // Pehla available video URL lo
            const item = data.result[0];
            return item.url || item.video || item.link || null;
        }
        return null;
    } catch (err) {
        console.error("FB API Error:", err.message);
        return null;
    }
}

// --- COMMAND: FACEBOOK ---

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "Download videos from Facebook.",
    category: "download",
    react: "🎬",
    filename: __filename,
}, async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("🎬 *Facebook Downloader*\n\nUsage: `.fb <video link>`\nExample: `.fb https://www.facebook.com/watch/?v=123...` ");

    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // 1. API se video link lao
        const videoUrl = await fbDownload(text);

        if (!videoUrl) {
            return reply("❌ Video not found. Please make sure the link is public and correct.\n\n_Note: FB download real public video URL se test karna baqi hai._");
        }

        const caption = `╭──〔 *🎬 FACEBOOK DOWNLOAD* 〕  
├─ 🔗 *Source:* Facebook
├─ 📂 *Format:* MP4
╰───────────────────

*Power by Queen MD*`;

        // 2. Sending Video
        await conn.sendMessage(from, { 
            video: { url: videoUrl }, 
            caption: caption,
            contextInfo: getNewsletterContext()
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("FB Command Error:", e);
        reply("❌ An error occurred while processing your request.");
    }
});
