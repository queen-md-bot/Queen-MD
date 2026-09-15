const { cmd } = require("../inconnuboy"); // 'const' small hona chahiye
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ["play", "ytmp3"],
    desc: "Download songs via name or link.",
    category: "download",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name or YouTube link!");

        // Search Reaction
        await conn.sendMessage(from, { react: { text: "🔎", key: mek.key } });

        let videoUrl = q;
        let vid;

        // Check agar input link hai ya name
        const isUrl = q.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g);

        if (isUrl) {
            // Agar link hai to details fetch karo
            const search = await yts({ videoId: q.split('v=')[1] || q.split('/').pop() });
            vid = search;
            videoUrl = q;
        } else {
            // Agar naam hai to search karo
            const search = await yts(q);
            if (!search || !search.videos.length) return reply("❌ No results found.");
            vid = search.videos[0];
            videoUrl = vid.url;
        }

        const MY_CHANNEL = "120363401706347293@newsletter";

        // Preview Message
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail || vid.image },
            caption: `╭━━〔 🎵 𝗠𝗨𝗦𝗜𝗖 𝗙𝗢𝗨𝗡𝗗 〕━━━╮\n┃ 🎧 *Title* : ${vid.title}\n┃ ⏱️ *Duration* : ${vid.timestamp || 'N/A'}\n┃ 🔗 *Link* : ${videoUrl}\n╰━━━━━━━━━━━━━━━━━╯\n\n⏳ *Downloading audio...*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "🦋⍣⃝🇰ʜᴀɴzada🕊", 
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // API Download
        let api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        let { data } = await axios.get(api);

        if (!data || !data.status || !data.audio) {
            return reply("❌ API error! Try again later.");
        }

        // Sending Audio
        await conn.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: "audio/mpeg",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: MY_CHANNEL,
                    newsletterName: "🦋⍣⃝🇰ʜᴀɴzada🕊",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});
