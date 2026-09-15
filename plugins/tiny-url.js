const { cmd } = require('../inconnuboy');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scraper function for SaveTik
 */
async function tiktokScraper(url) {
    try {
        const r = await axios.post(
            'https://savetik.co/api/ajaxSearch',
            new URLSearchParams({ q: url, lang: 'id' }).toString(),
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    origin: 'https://savetik.co',
                    referer: 'https://savetik.co/id1'
                }
            }
        );
        const $ = cheerio.load(r.data.data);
        return {
            title: $('h3').first().text().trim() || 'TikTok Media',
            thumbnail: $('.image-tik img').attr('src') || $('.thumbnail img').attr('src') || null,
            mp4: $('.dl-action a:contains("MP4")').not(':contains("HD")').attr('href') || null,
            mp4_hd: $('.dl-action a:contains("HD")').attr('href') || null,
            mp3: $('.dl-action a:contains("MP3")').attr('href') || null,
            foto: $('.photo-list a[href*="snapcdn"]').map((_, e) => $(e).attr('href')).get()
        };
    } catch (e) {
        return { status: 'error', msg: e.message };
    }
}

// --- MAIN COMMAND ---

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    react: "📥",
    desc: "Download TikTok videos, audio, or photos with selection.",
    category: "downloader",
    filename: __filename
},           
async (conn, mek, m, { from, q, reply, prefix }) => {
    try {
        if (!q) return reply(`*Usage:* ${prefix}tiktok <link>\n*Example:* ${prefix}tiktok https://vt.tiktok.com/ZSfEbDw89/`);

        const targetChat = conn.decodeJid(from);
        await conn.sendMessage(targetChat, { react: { text: "🔍", key: m.key } });

        const data = await tiktokScraper(q.trim());

        if (data.status === 'error' || (!data.mp4 && data.foto.length === 0)) {
            return reply("❌ Failed to fetch TikTok media. Link invalid or private.");
        }

        const caption = `
🎬 *TIKTOK DOWNLOADER* 🎬

📌 *Title:* ${data.title}

*Inmein se koi ek select karen:*
1️⃣ *Video (MP4)*
2️⃣ *Audio (MP3)*
3️⃣ *Photos (SlideShow)*

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊`;

        // Send Thumbnail and Menu
        const sentMsg = await conn.sendMessage(targetChat, { 
            image: { url: data.thumbnail || 'https://i.ibb.co/3S7S7S7/tiktok.jpg' }, 
            caption: caption 
        }, { quoted: mek });

        const messageID = sentMsg.key.id;

        // Listen for Reply
        conn.ev.on("messages.upsert", async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const text = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const isReply = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (isReply) {
                await conn.sendMessage(targetChat, { react: { text: "⏳", key: receivedMsg.key } });

                switch (text.trim()) {
                    case "1": // Video
                        if (data.mp4 || data.mp4_hd) {
                            await conn.sendMessage(targetChat, {
                                video: { url: data.mp4_hd || data.mp4 },
                                caption: `✅ *${data.title}*\n\n> © 🦋⍣⃝🇰ʜᴀɴzada🕊`,
                                mimetype: "video/mp4"
                            }, { quoted: receivedMsg });
                        } else reply("❌ Video not available.");
                        break;

                    case "2": // Audio
                        if (data.mp3) {
                            await conn.sendMessage(targetChat, {
                                audio: { url: data.mp3 },
                                mimetype: "audio/mpeg",
                                fileName: `${data.title}.mp3`
                            }, { quoted: receivedMsg });
                        } else reply("❌ Audio not available.");
                        break;

                    case "3": // Photos
                        if (data.foto && data.foto.length > 0) {
                            reply(`📸 Sending ${data.foto.length} photos...`);
                            for (let img of data.foto) {
                                await conn.sendMessage(targetChat, { image: { url: img } }, { quoted: receivedMsg });
                            }
                        } else reply("❌ This is a video, not a photo slideshow.");
                        break;

                    default:
                        reply("❌ Invalid choice! Please reply with 1, 2, or 3.");
                }

                await conn.sendMessage(targetChat, { react: { text: "✅", key: receivedMsg.key } });
            }
        });

    } catch (e) {
        console.error("TikTok Error:", e);
        reply("❌ An unexpected error occurred.");
    }
});
