const { cmd } = require('../inconnuboy');

/**
 * Advanced Admin Status Check with LID & PN Support
 */
async function checkAdminStatus(conn, chatId, senderId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';
        
        const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
        const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
        
        const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
        const senderIdWithoutSuffix = senderId.split('@')[0];
        
        let isBotAdmin = false;
        let isSenderAdmin = false;
        
        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split('@')[0] : '';
                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';

                if (botId.includes(pId) || botLid === pLid || botNumber === pPhoneNumber) isBotAdmin = true;
                if (senderId.includes(pId) || senderIdWithoutSuffix === pLid || senderNumber === pPhoneNumber) isSenderAdmin = true;
            }
        }
        return { isBotAdmin, isSenderAdmin };
    } catch (err) {
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

cmd({
    pattern: "add",
    alias: ["invite", "joingc"],
    desc: "Add a member to the group.",
    category: "group",
    react: "👤",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, reply, q, sender }) => {
    try {
        // Contact-style quote (Jawad Style)
        let jawad = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `🦋⍣⃝🇰ʜᴀɴzada🕊`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'adED'\nitem1.TEL;waid=${sender.split("@")[0]}:${sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        if (!isGroup) return reply("❌ This command is only for groups!");
        
        // Input check
        if (!q) return reply(`❌ Please provide a number to add.\nExample: \`.add 923xxxxxxxxx\``);

        // Admin verification
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, sender);
        
        if (!isSenderAdmin) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmin) return reply("❌ I need to be an admin to add users.");

        // Format number
        let users = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        // Execute Add
        const response = await conn.groupParticipantsUpdate(from, [users], "add");

        // Error handling based on WhatsApp response
        if (response[0].status === "403") {
            return reply("❌ Failed to add. This user has 'Privacy Settings' enabled. Send them the group link instead!");
        } else if (response[0].status === "408") {
            return reply("❌ This user just left the group. Try again later.");
        } else if (response[0].status === "409") {
            return reply("❌ User is already in the group.");
        }

        // Success Message
        await conn.sendMessage(from, { 
            text: `*👤 USER ADDED SUCCESSFULLY*\n\nUser @${users.split('@')[0]} has been added to the group.\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
            mentions: [users],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401706347293@newsletter',
                    newsletterName: '🦋⍣⃝🇰ʜᴀɴzada🕊',
                    serverMessageId: 143
                }
            }
        }, { quoted: jawad });

    } catch (e) {
        console.error("Error adding user:", e);
        reply("❌ Failed to add the user. Ensure the number is correct with country code.");
    }
})
