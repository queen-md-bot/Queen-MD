// Jawad Tech

const { cmd } = require("../inconnuboy");
const fetch = require("node-fetch");
 
const islamicQueries = [
    "Islamic video",
    "Islamic status", 
    "Quran",
    "Naat status",
    "islamic motivation",
    "Allah",
    "Islamic quotes"
];

cmd({
    pattern: "islamic",
    desc: "Send random Islamic status videos from TikTok",
    react: '❤️',
    category: 'download',
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        // Select a random Islamic query
        const randomQuery = islamicQueries[Math.floor(Math.random() * islamicQueries.length)];
        
        // Using the API endpoint
        const url = `https://delirius-apiofc.vercel.app/search/tiktoksearch?query=${encodeURIComponent(randomQuery)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate response
        if (!data?.meta || !data.meta.length) {
            return reply("❌ Failed to fetch Islamic video. Please try again.");
        }
        
        const results = data.meta;
        
        // Select one random video
        const randomVideo = results[Math.floor(Math.random() * results.length)];
        
        if (randomVideo.hd) {
            await conn.sendMessage(
                from,
                { 
                    video: { url: randomVideo.hd },
                    caption: `- 🌺 *Islamic Status Video*\n> *© Powered by 🦋⍣⃝🇰ʜᴀɴzada🕊*`
                },
                { quoted: mek }
            );
        } else {
            reply("❌ Failed to retrieve video. Please try again.");
        }
        
    } catch (error) {
        console.error('Islamic Status Error:', error);
        reply("❌ Failed to fetch Islamic video. Please try again.");
    }
});
