const config = require('../config')
const { cmd } = require('../inconnuboy')

// --- Helper Functions ---

async function checkAdminStatus(conn, chatId, senderId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';
        
        const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
        const botIdWithoutSuffix = botId.includes('@') ? botId.split('@')[0] : botId;
        const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
        const botLidWithoutSuffix = botLid.includes('@') ? botLid.split('@')[0] : botLid;
        
        const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
        const senderIdWithoutSuffix = senderId.includes('@') ? senderId.split('@')[0] : senderId;
        
        let isBotAdmin = false;
        let isSenderAdmin = false;
        
        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split('@')[0] : '';
                const pFullId = p.id || '';
                const pFullLid = p.lid || '';
                const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;
                
                const botMatches = (
                    botId === pFullId || botId === pFullLid || botLid === pFullLid ||
                    botLidNumeric === pLidNumeric || botLidWithoutSuffix === pLid ||
                    botNumber === pPhoneNumber || botNumber === pId ||
                    botIdWithoutSuffix === pPhoneNumber || botIdWithoutSuffix === pId ||
                    (botLid && botLid.split('@')[0].split(':')[0] === pLid)
                );
                
                if (botMatches) isBotAdmin = true;
                
                const senderMatches = (
                    senderId === pFullId || senderId === pFullLid ||
                    senderNumber === pPhoneNumber || senderNumber === pId ||
                    senderIdWithoutSuffix === pPhoneNumber || senderIdWithoutSuffix === pId ||
                    (pLid && senderIdWithoutSuffix === pLid)
                );
                
                if (senderMatches) isSenderAdmin = true;
            }
        }
        return { isBotAdmin, isSenderAdmin };
    } catch (err) {
        console.error('❌ Error checking admin status:', err);
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

// --- 🔒 MUTE COMMAND ---

cmd({
    pattern: "mute",
    alias: ["lock", "close"],
    react: "🔒",
    desc: "Mute the group (Only admins can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        const senderId = mek.key.participant || mek.key.remoteJid || (mek.key.fromMe ? conn.user?.id : null);
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, senderId);
        
        if (!isSenderAdmin) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmin) return reply("❌ I need to be an admin to mute the group.");
        
        await conn.groupSettingUpdate(from, "announcement");
        
        await conn.sendMessage(from, { 
            text: `*🔒 Group Muted Successfully*\n\nAb sirf admins hi is group mein message kar sakte hain.\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: '🦋⍣⃝🇰ʜᴀɴzada🕊',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error: Group mute karne mein nakami hui.");
    }
})

// --- 🔓 UNMUTE COMMAND ---

cmd({
    pattern: "unmute2",
    alias: ["unlock2", "open2"],
    react: "🔓",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        const senderId = mek.key.participant || mek.key.remoteJid || (mek.key.fromMe ? conn.user?.id : null);
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, senderId);
        
        if (!isSenderAdmin) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmin) return reply("❌ I need to be an admin to unmute the group.");
        
        await conn.groupSettingUpdate(from, "not_announcement");
        
        await conn.sendMessage(from, { 
            text: `*🔓 Group Unmuted Successfully*\n\nAb sabhi participants message kar sakte hain.\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: '🦋⍣⃝🇰ʜᴀɴzada🕊',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error: Group unmute karne mein nakami hui.");
    }
})
            
