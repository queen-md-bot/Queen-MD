const { cmd } = require('../inconnuboy');
const baileys = require('@whiskeysockets/baileys');
const converter = require('../data/converter'); 
const crypto = require('crypto');

/**
 * LUCKY-MD: Fixed Universal Group Status V2 Relay
 */
async function relayStatus(conn, jid, content, type) {
    const messageSecret = crypto.randomBytes(32);
    let msgContent = {};

    if (type === 'image') {
        msgContent = { image: content.buffer, caption: content.caption };
    } else if (type === 'video') {
        msgContent = { video: content.buffer, caption: content.caption };
    } else if (type === 'audio') {
        // Audio status ke liye direct audio content
        msgContent = { 
            audio: content.buffer, 
            mimetype: 'audio/ogg; codecs=opus', 
            ptt: true 
        };
    } else {
        msgContent = { text: content.text };
    }

    // Generate full message content
    const msg = await baileys.generateWAMessage(jid, msgContent, {
        userJid: conn.user.id,
        upload: conn.waUploadToServer
    });

    // Group Status V2 structure mein convert karna
    const relayMsg = {
        groupStatusMessageV2: {
            message: msg.message,
            messageContextInfo: { messageSecret }
        }
    };

    await conn.relayMessage(jid, relayMsg, { messageId: msg.key.id });
    return msg;
}

cmd({
    pattern: "gcstatus",
    alias: ["groupstatus", "statusrelay"],
    react: "🌟",
    desc: "Relay Text/Photo/Video/Voice as Group Status.",
    category: "tools",
    use: ".gcstatus (reply to any media or type text)",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, isAdmins, isOwner }) => {
    try {
        if (!isAdmins && !isOwner) return reply("❌ *🦋⍣⃝🇰ʜᴀɴzada🕊:* Admins only.");

        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        
        // --- 1. PHOTO STATUS ---
        if (/image/.test(mime)) {
            await reply("⏳ *Uploading Photo Status...*");
            const buffer = await q.download();
            await relayStatus(conn, from, { buffer, caption: text || '' }, 'image');
            return reply("✅ *Photo Status Shared!*");
        }

        // --- 2. VIDEO STATUS ---
        if (/video/.test(mime)) {
            await reply("⏳ *Uploading Video Status...*");
            const buffer = await q.download();
            await relayStatus(conn, from, { buffer, caption: text || '' }, 'video');
            return reply("✅ *Video Status Shared!*");
        }

        // --- 3. VOICE / AUDIO STATUS ---
        if (/audio/.test(mime)) {
            await reply("⏳ *Processing Voice Status...*");
            let buffer = await q.download();
            
            // Conversion to PTT Ogg/Opus
            const ext = mime.split('/')[1] || 'mp3';
            try {
                buffer = await converter.toPTT(buffer, ext);
            } catch (convErr) {
                console.log("Conversion failed, trying direct upload...");
            }

            await relayStatus(conn, from, { buffer }, 'audio');
            return reply("✅ *Voice Status Shared!*");
        }

        // --- 4. TEXT STATUS ---
        if (!text && !m.quoted) return reply("❌ Please reply to media or provide text.");
        
        // Agar sirf text hai
        const statusText = text || (m.quoted ? m.quoted.text : '');
        await reply("⏳ *Sending Text Status...*");
        await relayStatus(conn, from, { text: statusText }, 'text');
        return reply("✅ *Text Status Shared!*");

    } catch (err) {
        console.error(err);
        reply(`❌ *🦋⍣⃝🇰ʜᴀɴzada🕊 Error:* ${err.message}`);
    }
});
