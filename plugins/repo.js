const { cmd, commands } = require('../inconnuboy');
const config = require('../config');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "source"],
    desc: "Get bot source code and repository link",
    category: "main",
    react: "📁",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let repoText = `*╭────⬡ ${config.BOT_NAME} ⬡────⭓*
*├▢ 📂 Repository:* 🦋⍣⃝🇰ʜᴀɴzada🕊
*├▢ 👨‍💻 Owner:* ${config.OWNER_NAME}
*├▢ 🏷️ Version:* 1.0
*╰─────────────────⭓*

*╭────⬡ LINK ⬡────*
*├▢ 🌐 Web:* https://khan-zada-f3a760e88caa.herokuapp.com/
*╰────────────────*

> *© Powered by 🦋⍣⃝🇰ʜᴀɴzada🕊*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://up6.cc/2026/06/178265938722861.jpg' },
            caption: repoText,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

