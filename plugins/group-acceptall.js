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

                // Bot Match Logic
                if (botId.includes(pId) || botLid === pLid || botNumber === pPhoneNumber) isBotAdmin = true;
                
                // Sender Match Logic
                if (senderId.includes(pId) || senderIdWithoutSuffix === pLid || senderNumber === pPhoneNumber) isSenderAdmin = true;
            }
        }
        return { isBotAdmin, isSenderAdmin };
    } catch (err) {
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

// --- Common Newsletter Context ---
const newsletterContext = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363401706347293@newsletter',
        newsletterName: '🦋⍣⃝🇰ʜᴀɴzada🕊',
        serverMessageId: 143
    }
};

// 1. Show Pending Join Requests
cmd({
    pattern: "requestlist",
    alias: ["listrequest"],
    desc: "Shows pending group join requests",
    category: "group",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command is only for groups.");
        
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, sender);
        if (!isSenderAdmin) return reply("❌ Only admins can see the request list.");
        if (!isBotAdmin) return reply("❌ Make me admin to view requests.");

        const requests = await conn.groupRequestParticipantsList(from);
        if (requests.length === 0) return reply("ℹ️ No pending join requests.");

        let text = `📋 *PENDING JOIN REQUESTS (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `${i + 1}. @${user.jid.split('@')[0]}\n`;
        });
        text += `\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`;

        await conn.sendMessage(from, { 
            text: text, 
            mentions: requests.map(u => u.jid),
            contextInfo: newsletterContext 
        }, { quoted: mek });

    } catch (error) {
        reply("❌ Error fetching join requests.");
    }
});

// 2. Accept All Join Requests
cmd({
    pattern: "acceptall",
    alias: ["approveall"],
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command is only for groups.");
        
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, sender);
        if (!isSenderAdmin) return reply("❌ Only admins can accept requests.");
        if (!isBotAdmin) return reply("❌ I need admin power to approve members.");

        const requests = await conn.groupRequestParticipantsList(from);
        if (requests.length === 0) return reply("ℹ️ No requests found to accept.");

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");
        
        await conn.sendMessage(from, { 
            text: `✅ *APPROVED:* Successfully accepted ${requests.length} members.\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
            contextInfo: newsletterContext 
        }, { quoted: mek });

    } catch (error) {
        reply("❌ Error approving join requests.");
    }
});

// 3. Reject All Join Requests
cmd({
    pattern: "rejectall",
    alias: ["dismissall"],
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command is only for groups.");
        
        const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, sender);
        if (!isSenderAdmin) return reply("❌ Only admins can reject requests.");
        if (!isBotAdmin) return reply("❌ I need admin power to reject members.");

        const requests = await conn.groupRequestParticipantsList(from);
        if (requests.length === 0) return reply("ℹ️ No requests found to reject.");

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");
        
        await conn.sendMessage(from, { 
            text: `❌ *REJECTED:* Successfully rejected ${requests.length} members.\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🦋⍣⃝🇰ʜᴀɴzada🕊*`,
            contextInfo: newsletterContext 
        }, { quoted: mek });

    } catch (error) {
        reply("❌ Error rejecting join requests.");
    }
});
